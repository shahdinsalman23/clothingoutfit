"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Package,
  Users,
  Settings,
  Globe,
  LogOut,
  X,
  Zap,
  ArrowUpRight,
} from "lucide-react";

function getInitials(name) {
  return (name || "Administrator")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AdminSidebar({ isOpen, onClose, profile }) {
  const pathname = usePathname();
  const [imageFailed, setImageFailed] = useState(false);
   useEffect(() => {
      setImageFailed(false);
    }, [profile?.avatar_url]);


  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: Package },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const displayName = profile?.full_name || "Administrator";
  const avatarUrl = profile?.avatar_url;
  const showImage = avatarUrl && !imageFailed;
 

  const closeOnMobile = () => {
    if (window.innerWidth < 992) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`shopmate-overlay-sidad ${isOpen ? "active-sidad" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sidebar Component */}
      <aside className={`shopmate-sidebar-sidad ${isOpen ? "open-sidad" : ""}`}>
        {/* Brand Header */}
        <div className="shopmate-brand-box-sidad">
          <Link href="/admin" className="shopmate-brand-link-sidad" onClick={closeOnMobile}>
            <span className="shopmate-brand-icon-sidad">
              <Zap size={18} fill="currentColor" />
            </span>
            <span className="shopmate-brand-text-sidad"> Clothing Outfits </span>
            <span className="shopmate-brand-badge-sidad">Admin</span>
          </Link>
          <button
            type="button"
            className="shopmate-close-btn-sidad d-lg-none"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="shopmate-menu-box-sidad">
          <span className="shopmate-menu-title-sidad">Main Menu</span>
          <ul className="shopmate-nav-list-sidad">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeOnMobile}
                    className={`shopmate-nav-item-sidad ${isActive ? "active-sidad" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span className="shopmate-nav-icon-sidad">
                      <IconComponent size={18} />
                    </span>
                    <span className="shopmate-nav-label-sidad">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <span className="shopmate-menu-title-sidad shopmate-menu-title-spaced-sidad">
            Store View
          </span>
          <ul className="shopmate-nav-list-sidad">
            <li>
              <Link
                href="/"
                target="_blank"
                onClick={closeOnMobile}
                className="shopmate-nav-item-sidad"
              >
                <span className="shopmate-nav-icon-sidad">
                  <Globe size={18} />
                </span>
                <span className="shopmate-nav-label-sidad">View Live Store</span>
                <ArrowUpRight size={15} className="shopmate-nav-external-sidad" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer Profile Card */}
        <div className="shopmate-footer-box-sidad">
          <div className="shopmate-profile-card-sidad">
            <Link
              href="/admin/settings"
              onClick={closeOnMobile}
              className="shopmate-profile-link-sidad"
              aria-label="Open profile settings"
            >
              <div className="shopmate-avatar-sidad">
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
                <i className="shopmate-online-dot-sidad" />
              </div>
              <div className="shopmate-profile-info-sidad">
                <strong>{displayName}</strong>
                <small>Admin Access</small>
              </div>
            </Link>

           <form action={logout} data-flash="logout">
              <button type="submit" className="shopmate-logout-btn-sidad" title="Logout">
                <LogOut size={17} />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}