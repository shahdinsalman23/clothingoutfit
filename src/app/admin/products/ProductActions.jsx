"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";

const MENU_WIDTH = 175;
const MENU_HEIGHT = 96;
const MENU_GAP = 6;
const SCREEN_PADDING = 8;
const CLOSE_DURATION = 160;

export default function ProductActions({ productId, productName }) {
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

  const closeMenu = useCallback(() => {
    if (closeTimerRef.current) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      closeTimerRef.current = null;
    }, CLOSE_DURATION);
  }, []);

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

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const menu = (
    <div
      ref={menuRef}
      role="menu"
      className={`shopmate-dropdown-menu-prodad ${
        position.placement === "top" ? "origin-bottom-prodad" : "origin-top-prodad"
      } ${isClosing ? "is-closing-prodad" : "is-open-prodad"}`}
      style={{
        top: position.top,
        bottom: position.bottom,
        left: position.left,
      }}
    >
      <Link
        href={`/admin/products/${productId}/edit`}
        className="shopmate-dropdown-item-prodad"
        role="menuitem"
        onClick={closeMenu}
      >
        <Pencil size={15} className="text-primary" />
        <span>Edit Product</span>
      </Link>

      <form
        action={deleteProduct}
        onSubmit={(e) => {
          if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
            e.preventDefault();
          }
          closeMenu();
        }}
      >
        <input type="hidden" name="product_id" value={productId} />
        <button
          type="submit"
          role="menuitem"
          className="shopmate-dropdown-item-prodad text-danger"
        >
          <Trash2 size={15} />
          <span>Delete Product</span>
        </button>
      </form>
    </div>
  );

  return (
    <div className="shopmate-dropdown-wrapper-prodad">
      <button
        ref={buttonRef}
        type="button"
        className={`shopmate-dots-btn-prodad ${isOpen && !isClosing ? "active-prodad" : ""}`}
        onClick={handleToggle}
        aria-label="Product Actions"
        aria-haspopup="menu"
        aria-expanded={isOpen && !isClosing}
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && createPortal(menu, document.body)}
    </div>
  );
}