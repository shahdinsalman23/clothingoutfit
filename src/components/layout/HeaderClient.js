"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  UserRound,
  Package,
  LayoutDashboard,
  LogOut,
  Settings,
  ArrowRight,
} from "lucide-react";
import SearchModal from "./SearchModal";
import LogoutConfirm from "./LogoutConfirm";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/products" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function getInitials(name) {
  return (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ viewer, size = "md" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [viewer.avatarUrl]);

  return (
    <span className={`shopmate-avatar-shdad size-${size}-shdad`}>
      {viewer.avatarUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={viewer.avatarUrl} alt={viewer.name} onError={() => setFailed(true)} />
      ) : (
        getInitials(viewer.name)
      )}
    </span>
  );
}

export default function HeaderClient({ viewer, categories, cartCount }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // "cats" | "user" | null
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const popRef = useRef(null);

  const loggedIn = Boolean(viewer);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close everything on route change
  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Logout ho jaye to confirm popup band
  useEffect(() => {
    setLogoutOpen(false);
  }, [loggedIn]);

  // Shadow after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Outside click and Escape
  useEffect(() => {
    const onClick = (e) => {
      if (popRef.current && !popRef.current.contains(e.target)) setOpenMenu(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Ctrl/Cmd + K search kholta hai
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const toggleMenu = (name) => setOpenMenu((prev) => (prev === name ? null : name));

  const askLogout = () => {
    setOpenMenu(null);
    setDrawerOpen(false);
    setLogoutOpen(true);
  };

  const openSearch = () => {
    setOpenMenu(null);
    setDrawerOpen(false);
    setSearchOpen(true);
  };

  return (
    <>
      <header className={`shopmate-header-shdad ${scrolled ? "scrolled-shdad" : ""}`}>
        <div className="shopmate-inner-shdad">
          {/* Logo */}
          <Link href="/" className="shopmate-logo-shdad" aria-label="ShopMate home">
              <img src="/logomini.png" alt="ShopMate" style={{ width: "50px", height: "auto", objectFit: "contain" }} />
               <span className="shopmate-logo-text-shdad header-logoad">Clothing Outfits</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="shopmate-nav-shdad" ref={popRef} aria-label="Main">
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shopmate-link-shdad ${isActive(link.href) ? "active-shdad" : ""}`}
              >
                {link.name}
              </Link>
            ))}

            {categories.length > 0 && (
              <div className="shopmate-dropdown-shdad">
                <button
                  type="button"
                  className={`shopmate-link-shdad shopmate-link-btn-shdad ${
                    pathname.startsWith("/categories") ? "active-shdad" : ""
                  }`}
                  onClick={() => toggleMenu("cats")}
                  aria-expanded={openMenu === "cats"}
                >
                  Categories
                  <ChevronDown size={15} className={openMenu === "cats" ? "flip-shdad" : ""} />
                </button>

                <div className={`shopmate-pop-shdad ${openMenu === "cats" ? "open-shdad" : ""}`}>
                  {categories.map((cat) => (
                    <Link key={cat.slug} href={`/categories/${cat.slug}`} className="shopmate-pop-item-shdad">
                      {cat.name}
                    </Link>
                  ))}
                  <Link href="/categories" className="shopmate-pop-all-shdad">
                    All categories <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {NAV_LINKS.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shopmate-link-shdad ${isActive(link.href) ? "active-shdad" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="shopmate-actions-shdad">
            <button
              type="button"
              className="shopmate-cart-shdad"
              onClick={openSearch}
              aria-label="Search products"
              title="Search (Ctrl K)"
            >
              <Search size={19} />
            </button>

            <Link href="/cart" className="shopmate-cart-shdad" aria-label="Shopping cart">
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="shopmate-cart-badge-shdad">{cartCount}</span>}
            </Link>

            {viewer ? (
              <div className="shopmate-dropdown-shdad shopmate-desktop-only-shdad">
                <button
                  type="button"
                  className="shopmate-user-btn-shdad"
                  onClick={() => toggleMenu("user")}
                  aria-expanded={openMenu === "user"}
                  aria-label="Account menu"
                >
                  <Avatar viewer={viewer} />
                  <ChevronDown size={15} className={openMenu === "user" ? "flip-shdad" : ""} />
                </button>

                <div className={`shopmate-pop-shdad pop-right-shdad ${openMenu === "user" ? "open-shdad" : ""}`}>
                  <div className="shopmate-pop-user-shdad">
                    <Avatar viewer={viewer} size="lg" />
                    <div>
                      <strong>{viewer.name}</strong>
                      <small>{viewer.email}</small>
                    </div>
                  </div>

                  {viewer.isAdmin ? (
                    <Link href="/admin" className="shopmate-pop-item-shdad highlight-shdad">
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link href="/account" className="shopmate-pop-item-shdad">
                        <UserRound size={16} /> My Account
                      </Link>
                      <Link href="/account/orders" className="shopmate-pop-item-shdad">
                        <Package size={16} /> My Orders
                      </Link>
                      <Link href="/account/profile" className="shopmate-pop-item-shdad">
                        <Settings size={16} /> Profile Settings
                      </Link>
                    </>
                  )}

                  <button type="button" className="shopmate-pop-item-shdad danger-shdad" onClick={askLogout}>
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="shopmate-auth-shdad shopmate-desktop-only-shdad">
                <Link href="/login" className="shopmate-btn-ghost-shdad">
                  Log in
                </Link>
                <Link href="/signup" className="shopmate-btn-primary-shdad">
                  Sign up
                </Link>
              </div>
            )}

            {viewer?.isAdmin && (
              <Link href="/admin" className="shopmate-admin-pill-shdad shopmate-desktop-only-shdad">
                <LayoutDashboard size={15} /> Admin Panel
              </Link>
            )}

            <button
              type="button"
              className="shopmate-burger-shdad"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`shopmate-overlay-shdad ${drawerOpen ? "open-shdad" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />
      <aside className={`shopmate-drawer-shdad ${drawerOpen ? "open-shdad" : ""}`} aria-label="Mobile menu">
        <div className="shopmate-drawer-head-shdad">
          <Link href="/" className="shopmate-logo-shdad">
            <span className="shopmate-logo-icon-shdad">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Clothing Outfits" style={{ width: "24px", height: "24px", objectFit: "contain" }} />
            </span>
            <span className="shopmate-logo-text-shdad"> Clothing Outfits </span>
          </Link>
          <button
            type="button"
            className="shopmate-burger-shdad show-shdad"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="shopmate-drawer-body-shdad">
          {viewer && (
            <div className="shopmate-drawer-user-shdad">
              <Avatar viewer={viewer} size="lg" />
              <div>
                <strong>{viewer.name}</strong>
                <small>{viewer.email}</small>
              </div>
            </div>
          )}

          <button type="button" className="shopmate-drawer-search-srcad" onClick={openSearch}>
            <Search size={17} />
            <span>Search products...</span>
          </button>

          <nav className="shopmate-drawer-links-shdad">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={isActive(link.href) ? "active-shdad" : ""}>
                {link.name}
              </Link>
            ))}
            <Link href="/cart" className={isActive("/cart") ? "active-shdad" : ""}>
              Cart {cartCount > 0 && <em>{cartCount}</em>}
            </Link>
          </nav>

          {categories.length > 0 && (
            <>
              <span className="shopmate-drawer-title-shdad">Categories</span>
              <div className="shopmate-chips-shdad">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="shopmate-drawer-foot-shdad">
          {viewer ? (
            <>
              {viewer.isAdmin ? (
                <Link href="/admin" className="shopmate-btn-primary-shdad block-shdad">
                  <LayoutDashboard size={16} /> Admin Dashboard
                </Link>
              ) : (
                <div className="shopmate-drawer-row-shdad">
                  <Link href="/account" className="shopmate-btn-ghost-shdad block-shdad">
                    My Account
                  </Link>
                  <Link href="/account/orders" className="shopmate-btn-ghost-shdad block-shdad">
                    Orders
                  </Link>
                </div>
              )}
              <button type="button" className="shopmate-btn-danger-shdad block-shdad" onClick={askLogout}>
                <LogOut size={16} /> Log out
              </button>
            </>
          ) : (
            <div className="shopmate-drawer-row-shdad">
              <Link href="/login" className="shopmate-btn-ghost-shdad block-shdad">
                Log in
              </Link>
              <Link href="/signup" className="shopmate-btn-primary-shdad block-shdad">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </aside>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <LogoutConfirm open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </>
  );
}