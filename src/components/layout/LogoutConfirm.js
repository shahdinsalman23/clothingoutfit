"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useFormStatus } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";
import { logout } from "@/app/actions/auth";

function Actions({ onClose }) {
  const { pending } = useFormStatus();
  return (
    <div className="actions-flshad">
      <button type="button" className="cancel-flshad" onClick={onClose} disabled={pending}>
        Stay logged in
      </button>
      <button type="submit" className="danger-flshad" disabled={pending}>
        {pending ? <Loader2 size={16} className="spin-flshad" /> : <LogOut size={16} />}
        {pending ? "Logging out..." : "Yes, log out"}
      </button>
    </div>
  );
}

export default function LogoutConfirm({ open, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="backdrop-flshad" onMouseDown={onClose} role="presentation">
      <div
        className="modal-flshad tone-red-flshad"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-title-flshad"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="icon-flshad">
          <LogOut size={30} />
        </div>
        <h2 id="logout-title-flshad">Log out of ShopMate?</h2>
        <p>You will need to log in again to access your cart, orders and account.</p>

        <form action={logout} data-flash="logout">
          <Actions onClose={onClose} />
        </form>
      </div>
    </div>,
    document.body
  );
}