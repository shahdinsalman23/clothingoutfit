"use client";

import { useState, useEffect, useActionState } from "react";
import { Minus, Plus, ShoppingBag, Zap, Share2, Check, CheckCircle2, AlertCircle } from "lucide-react";
import { addToCart } from "@/app/actions/cart";

export default function AddToCartPanel({ productId, stock, price, inCartQty = 0 }) {
  const [state, formAction, isPending] = useActionState(addToCart, null);
  const [qty, setQty] = useState(1);
  const [copied, setCopied] = useState(false);
  const [showMsg, setShowMsg] = useState(false);

  const soldOut = stock <= 0;
  const maxQty = Math.max(1, stock);

  useEffect(() => {
    if (!state) return;
    setShowMsg(true);
    const timer = setTimeout(() => setShowMsg(false), 4500);
    return () => clearTimeout(timer);
  }, [state]);

  const change = (step) => setQty((prev) => Math.min(maxQty, Math.max(1, prev + step)));

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url: window.location.href });
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <form id="shopmate-atc-form" action={formAction} className="shopmate-buybox-pdpad">
        <input type="hidden" name="product_id" value={productId} />
        <input type="hidden" name="quantity" value={qty} />

        {!soldOut && (
          <div className="shopmate-qtyrow-pdpad">
            <span>Quantity</span>
            <div className="shopmate-qty-pdpad" role="group" aria-label="Quantity">
              <button type="button" onClick={() => change(-1)} disabled={qty <= 1} aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <strong aria-live="polite">{qty}</strong>
              <button type="button" onClick={() => change(1)} disabled={qty >= maxQty} aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <em>
              Total: Rs. {(Number(price) * qty).toLocaleString("en-PK")}
            </em>
          </div>
        )}

        <div className="shopmate-actions-pdpad">
          <button
            type="submit"
            name="intent"
            value="add"
            className="shopmate-atc-pdpad"
            disabled={soldOut || isPending}
          >
            <ShoppingBag size={18} />
            {soldOut ? "Out of stock" : isPending ? "Adding..." : "Add to cart"}
          </button>

          <button
            type="submit"
            name="intent"
            value="buy"
            className="shopmate-buy-pdpad"
            disabled={soldOut || isPending}
          >
            <Zap size={18} /> Buy now
          </button>

          <button type="button" className="shopmate-share-pdpad" onClick={share} aria-label="Share product">
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        </div>

        {inCartQty > 0 && !showMsg && (
          <p className="shopmate-incart-pdpad">
            <CheckCircle2 size={15} /> {inCartQty} already in your cart
          </p>
        )}

        {showMsg && state?.message && (
          <p
            className={`shopmate-msg-pdpad ${state.success ? "ok-pdpad" : "err-pdpad"}`}
            role={state.success ? "status" : "alert"}
          >
            {state.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {state.message}
          </p>
        )}
      </form>

      {/* Mobile sticky bar */}
      {!soldOut && (
        <div className="shopmate-mobilebar-pdpad">
          <div>
            <small>Price</small>
            <strong>Rs. {Number(price).toLocaleString("en-PK")}</strong>
          </div>
          <button type="submit" form="shopmate-atc-form" name="intent" value="add" disabled={isPending}>
            <ShoppingBag size={17} /> {isPending ? "Adding..." : "Add to cart"}
          </button>
        </div>
      )}
    </>
  );
}