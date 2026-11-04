"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Package, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { logout } from "@/app/actions/auth";

const LINKS = [
  { name: "Overview", href: "/account", icon: LayoutGrid },
  { name: "My Orders", href: "/account/orders", icon: Package },
  { name: "Profile Settings", href: "/account/profile", icon: Settings },
];

function initials(name) {
  return (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default function AccountNav({ viewer }) {
  const pathname = usePathname();
  const [failed, setFailed] = useState(false);

  const isActive = (href) => (href === "/account" ? pathname === "/account" : pathname.startsWith(href));

  return (
    <aside className="shopmate-side-accad">
      <div className="shopmate-user-accad">
        <span className="shopmate-avatar-accad">
          {viewer.avatarUrl && !failed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={viewer.avatarUrl} alt={viewer.name} onError={() => setFailed(true)} />
          ) : (
            initials(viewer.name)
          )}
        </span>
        <div>
          <strong>{viewer.name}</strong>
          <small>{viewer.email}</small>
        </div>
      </div>

      <nav className="shopmate-links-accad" aria-label="Account">
        {LINKS.map(({ name, href, icon: Icon }) => (
          <Link key={href} href={href} className={isActive(href) ? "active-accad" : ""}>
            <Icon size={18} /> <span>{name}</span>
          </Link>
        ))}

        {viewer.isAdmin && (
          <Link href="/admin" className="admin-accad">
            <LayoutDashboard size={18} /> <span>Admin Panel</span>
          </Link>
        )}
      </nav>

      <form action={logout} data-flash="logout" className="shopmate-logout-accad">
        <button type="submit">
          <LogOut size={17} /> <span>Log out</span>
        </button>
      </form>
    </aside>
  );
}