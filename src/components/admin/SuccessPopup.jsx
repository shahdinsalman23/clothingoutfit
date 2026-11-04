"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Check, X, Plus } from "lucide-react";

const CONTENT = {
  product: {
    addHref: "/admin/products/new",
    addLabel: "Add another",
    variants: {
      created: { title: "Product added successfully", text: "Your new product is saved and ready in your store inventory.", tone: "green" },
      updated: { title: "Product updated", text: "Your changes have been saved successfully.", tone: "blue" },
      deleted: { title: "Product deleted", text: "The product has been removed from your inventory.", tone: "red" },
    },
  },
  category: {
    addHref: "/admin/categories/new",
    addLabel: "Add another",
    variants: {
      created: { title: "Category created successfully", text: "Your new category is ready and can now be assigned to products.", tone: "green" },
      updated: { title: "Category updated", text: "Your category changes have been saved successfully.", tone: "blue" },
      deleted: { title: "Category deleted", text: "The category has been removed from your catalog.", tone: "red" },
    },
  },
  order: {
    addHref: "/admin/orders",
    addLabel: "All orders",
    variants: {
      updated: {
        title: "Order status updated",
        text: "The order status has been saved and the customer will see the new status in their account.",
        tone: "blue",
      },
    },
  },
};

const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: 8 + ((i * 53) % 84),
  delay: (i % 6) * 0.08,
  duration: 1.1 + (i % 5) * 0.18,
  drift: ((i % 7) - 3) * 14,
  color: ["var(--gold)", "var(--gold-dark)", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"][i % 6],
  size: 6 + (i % 3) * 3,
}));

export default function SuccessPopup({ type, entity = "product" }) {
  const router = useRouter();
  const pathname = usePathname();
  const [variant, setVariant] = useState(null);

  const config = CONTENT[entity] || CONTENT.product;

  // URL se param aaye to popup kholo aur URL saaf kar do
  useEffect(() => {
    if (type && config.variants[type]) {
      setVariant(type);
      router.replace(pathname, { scroll: false });
    }
  }, [type, config, pathname, router]);

  // Auto close + Escape
  useEffect(() => {
    if (!variant) return;
    const timer = setTimeout(() => setVariant(null), 5000);
    const onKey = (e) => e.key === "Escape" && setVariant(null);
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
    };
  }, [variant]);

  if (!variant) return null;
  const content = config.variants[variant];
  const close = () => setVariant(null);

  return (
    <div className="backdrop-savead" onClick={close} role="presentation">
      <div
        className={`modal-savead tone-${content.tone}-savead`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title-savead"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="close-savead" onClick={close} aria-label="Close">
          <X size={18} />
        </button>

        <div className="confetti-savead" aria-hidden="true">
          {CONFETTI.map((piece, i) => (
            <span
              key={i}
              style={{
                left: `${piece.left}%`,
                width: piece.size,
                height: piece.size,
                background: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                "--drift": `${piece.drift}px`,
              }}
            />
          ))}
        </div>

        <div className="badge-savead">
          <span className="pulse-savead" />
          <svg viewBox="0 0 52 52" aria-hidden="true">
            <circle className="circle-savead" cx="26" cy="26" r="23" fill="none" />
            <path className="tick-savead" fill="none" d="M15 27 l8 8 l15 -17" />
          </svg>
        </div>

        <h2 id="success-title-savead">{content.title}</h2>
        <p>{content.text}</p>

        <div className="actions-savead">
          {variant === "created" && (
            <Link href={config.addHref} className="secondary-savead" onClick={close}>
              <Plus size={16} /> {config.addLabel}
            </Link>
          )}
          <button type="button" className="primary-savead" onClick={close}>
            <Check size={16} /> Done
          </button>
        </div>

        <div className="timer-savead">
          <span />
        </div>
      </div>
    </div>
  );
}