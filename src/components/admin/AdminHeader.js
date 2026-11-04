"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Search, Bell, Sparkles, X } from "lucide-react";

function getInitials(name) {
  return (name || "Administrator")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AdminHeader({ onToggleSidebar, profile }) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [shortcutKey, setShortcutKey] = useState("Ctrl");
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => {
  setImageFailed(false);
}, [profile?.avatar_url]);  

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const displayName = profile?.full_name || "Administrator";
  const avatarUrl = profile?.avatar_url;
  const showImage = avatarUrl && !imageFailed;

  // Show the right shortcut label for the user's platform
  useEffect(() => {
    if (/Mac|iPhone|iPad/i.test(navigator.platform)) setShortcutKey("⌘");
  }, []);

  // Ctrl/Cmd + K focuses the search
  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const desktopVisible = desktopInputRef.current?.offsetParent !== null;
        if (desktopVisible) {
          desktopInputRef.current.focus();
        } else {
          setMobileSearchOpen(true);
        }
      }
      if (event.key === "Escape") setMobileSearchOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen) mobileInputRef.current?.focus();
  }, [mobileSearchOpen]);

  return (
    <header className="shopmate-header-hedad">
      <div className="shopmate-header-inner-hedad">

        {/* Left: Toggle & Search */}
        <div className="shopmate-header-left-hedad">
          <button
            type="button"
            className="shopmate-toggle-btn-hedad"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation"
          >
            <Menu size={19} />
          </button>

          <div className="shopmate-search-hedad">
            <Search size={16} className="shopmate-search-icon-hedad" />
            <input
              ref={desktopInputRef}
              type="text"
              placeholder="Search analytics, orders, products..."
              className="shopmate-search-input-hedad"
              aria-label="Search"
            />
            <kbd className="shopmate-kbd-hedad">{shortcutKey} K</kbd>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="shopmate-header-right-hedad">
          <button
            type="button"
            className="shopmate-icon-btn-hedad shopmate-search-toggle-hedad"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
          >
            {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          <div className="shopmate-live-badge-hedad">
            <span className="shopmate-pulse-dot-hedad" />
            <span>Store Live</span>
          </div>

          <button
            type="button"
            className="shopmate-icon-btn-hedad"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="shopmate-notif-dot-hedad" />
          </button>

          <div className="shopmate-divider-hedad" />

          <Link
            href="/admin/settings"
            className="shopmate-user-hedad"
            aria-label="Open profile settings"
          >
            <div className="shopmate-user-text-hedad">
              <strong>{displayName}</strong>
              <span>
                <Sparkles size={11} />
                Super Admin
              </span>
            </div>
            <div className="shopmate-user-avatar-hedad">
              {showImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile search drawer */}
      <div className={`shopmate-mobile-search-hedad ${mobileSearchOpen ? "open-hedad" : ""}`}>
        <div className="shopmate-search-hedad shopmate-search-full-hedad">
          <Search size={16} className="shopmate-search-icon-hedad" />
          <input
            ref={mobileInputRef}
            type="text"
            placeholder="Search analytics, orders, products..."
            className="shopmate-search-input-hedad"
            aria-label="Search"
          />
        </div>
      </div>
    </header>
  );
}