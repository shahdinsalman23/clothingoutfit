"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Check, X } from "lucide-react";

const KEY = "shopmate_flash";

export default function FlashPopup() {
  const [flash, setFlash] = useState(null);
  const watching = useRef(false);

  // Server se confirm karo ke login/logout sach mein hua
  const watch = useCallback((type) => {
    if (watching.current) return;
    watching.current = true;
    let tries = 0;

    const tick = async () => {
      tries += 1;
      try {
        const res = await fetch("/api/session", { cache: "no-store" });
        const { user } = await res.json();
        const done = type === "login" ? Boolean(user) : !user;
        if (done) {
          sessionStorage.removeItem(KEY);
          watching.current = false;
          setFlash({ type, name: user?.name || "" });
          return;
        }
      } catch {
        /* retry */
      }
      if (tries >= 12) {
        sessionStorage.removeItem(KEY);
        watching.current = false;
        return;
      }
      setTimeout(tick, 600);
    };

    tick();
  }, []);

  useEffect(() => {
    // data-flash wale form submit hon to flag lagao
    const onSubmit = (e) => {
      const type = e.target?.dataset?.flash;
      if (type !== "login" && type !== "logout") return;
      sessionStorage.setItem(KEY, type);
      watch(type);
    };
    document.addEventListener("submit", onSubmit, true);

    // Hard redirect ke baad bhi chale
    const saved = sessionStorage.getItem(KEY);
    if (saved) watch(saved);

    return () => document.removeEventListener("submit", onSubmit, true);
  }, [watch]);

  // Auto close + Escape
  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 4500);
    const onKey = (e) => e.key === "Escape" && setFlash(null);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [flash]);

  if (!flash) return null;

  const isLogin = flash.type === "login";
  const first = flash.name.split(" ")[0];
  const close = () => setFlash(null);

  return (
    <div className="backdrop-flshad" onMouseDown={close} role="presentation">
      <div
        className={`modal-flshad ${isLogin ? "tone-green-flshad" : "tone-blue-flshad"}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="flash-title-flshad"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="close-flshad" onClick={close} aria-label="Close">
          <X size={18} />
        </button>

        <div className="badge-flshad">
          <span className="pulse-flshad" />
          <svg viewBox="0 0 52 52" aria-hidden="true">
            <circle className="circle-flshad" cx="26" cy="26" r="23" fill="none" />
            <path className="tick-flshad" fill="none" d="M15 27 l8 8 l15 -17" />
          </svg>
        </div>

        <h2 id="flash-title-flshad">{isLogin ? `Welcome back, ${first}` : "Logged out successfully"}</h2>
        <p>
          {isLogin
            ? "You have logged in successfully. Happy shopping!"
            : "Thanks for visiting ShopMate. See you again soon."}
        </p>

        <div className="actions-flshad single-flshad">
          <button type="button" className="primary-flshad" onClick={close}>
            <Check size={16} /> {isLogin ? "Continue" : "Done"}
          </button>
        </div>

        <div className="timer-flshad">
          <span />
        </div>
      </div>
    </div>
  );
}