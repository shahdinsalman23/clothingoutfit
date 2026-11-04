"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/categories";

const MENU_WIDTH = 175;
const MENU_HEIGHT = 96;
const MENU_GAP = 6;
const SCREEN_PADDING = 8;
const CLOSE_DURATION = 160;

export default function CategoryActions({ categoryId, categoryName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    bottom: "auto",
    left: 0,
    placement: "bottom",
  });

  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Smooth close: play exit animation first, then unmount
  const closeMenu = useCallback(() => {
    if (closeTimerRef.current) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, CLOSE_DURATION);
  }, []);

  // Calculate where the menu should appear (flips upward if no space below)
  const calculatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpwards =
      spaceBelow < MENU_HEIGHT + MENU_GAP + SCREEN_PADDING &&
      rect.top > MENU_HEIGHT + MENU_GAP + SCREEN_PADDING;

    const left = Math.max(
      SCREEN_PADDING,
      Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - SCREEN_PADDING)
    );

    setPosition({
      top: openUpwards ? "auto" : rect.bottom + MENU_GAP,
      bottom: openUpwards ? window.innerHeight - rect.top + MENU_GAP : "auto",
      left,
      placement: openUpwards ? "top" : "bottom",
    });
  };

  const handleToggle = () => {
    if (isClosing) return;
    if (isOpen) {
      closeMenu();
      return;
    }
    calculatePosition();
    setIsOpen(true);
  };

  // Outside click, scroll, resize and Escape handling
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event) {
      const clickedButton = buttonRef.current?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);
      if (!clickedButton && !clickedMenu) closeMenu();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", closeMenu, true);
    window.addEventListener("resize", closeMenu);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", closeMenu, true);
      window.removeEventListener("resize", closeMenu);
    };
  }, [isOpen, closeMenu]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      className={`shopmate-dropdown-menu-catead ${
        position.placement === "top" ? "origin-bottom-catead" : "origin-top-catead"
      } ${isClosing ? "is-closing-catead" : "is-open-catead"}`}
      style={{
        top: position.top,
        bottom: position.bottom,
        left: position.left,
      }}
    >
      <Link
        href={`/admin/categories/${categoryId}/edit`}
        className="shopmate-dropdown-item-catead"
        role="menuitem"
        onClick={closeMenu}
      >
        <Pencil size={15} className="text-primary" />
        <span>Edit Category</span>
      </Link>

      <form
        action={deleteCategory}
        onSubmit={(e) => {
          if (!confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            e.preventDefault();
          }
          closeMenu();
        }}
      >
        <input type="hidden" name="category_id" value={categoryId} />
        <button
          type="submit"
          role="menuitem"
          className="shopmate-dropdown-item-catead text-danger shopmate-delete-action-catead"
        >
          <Trash2 size={15} />
          <span>Delete Category</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="shopmate-dropdown-wrapper-catead">
      <button
        ref={buttonRef}
        type="button"
        className={`shopmate-dots-btn-catead ${isOpen && !isClosing ? "active-catead" : ""}`}
        onClick={handleToggle}
        aria-label="Category Actions"
        aria-haspopup="menu"
        aria-expanded={isOpen && !isClosing}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && createPortal(menu, document.body)}
    </div>
  );
}