"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, AlertTriangle, ImageOff } from "lucide-react";
import { updateCartQuantity, removeFromCart } from "@/app/actions/cart";

export default function CartItem({ item }) {
  const [pending, startTransition] = useTransition();

  const run = (action, quantity) => {
    const formData = new FormData();
    formData.set("product_id", item.productId);
    if (quantity !== undefined) formData.set("quantity", String(quantity));
    startTransition(async () => {
      await action(formData);
    });
  };

  const lineTotal = item.price * item.quantity;

  return (
    <article className={`shopmate-item-cartad ${pending ? "pending-cartad" : ""} ${item.available ? "" : "unavailable-cartad"}`}>
      <Link href={`/products/${item.slug}`} className="shopmate-thumb-cartad">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.name} />
        ) : (
          <ImageOff size={24} />
        )}
      </Link>

      <div className="shopmate-info-cartad">
        <div className="shopmate-top-cartad">
          <div>
            <Link href={`/products/${item.slug}`} className="shopmate-name-cartad">
              {item.name}
            </Link>
            <span className="shopmate-unit-cartad">
              Rs. {item.price.toLocaleString("en-PK")} each
            </span>
          </div>

          <button
            type="button"
            className="shopmate-remove-cartad"
            onClick={() => run(removeFromCart)}
            disabled={pending}
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 size={17} />
          </button>
        </div>

        {!item.available && (
          <p className="shopmate-warn-cartad">
            <AlertTriangle size={14} /> This item is currently unavailable and is not included in your total.
          </p>
        )}

        {item.capped && (
          <p className="shopmate-warn-cartad soft-cartad">
            <AlertTriangle size={14} /> Only {item.stock} units are available.
          </p>
        )}

        <div className="shopmate-bottom-cartad">
          {item.available ? (
            <div className="shopmate-qty-cartad" role="group" aria-label="Quantity">
              <button
                type="button"
                onClick={() => run(updateCartQuantity, item.quantity - 1)}
                disabled={pending}
                aria-label="Decrease quantity"
              >
                <Minus size={15} />
              </button>
              <strong aria-live="polite">{item.quantity}</strong>
              <button
                type="button"
                onClick={() => run(updateCartQuantity, item.quantity + 1)}
                disabled={pending || item.quantity >= item.stock}
                aria-label="Increase quantity"
              >
                <Plus size={15} />
              </button>
            </div>
          ) : (
            <span className="shopmate-soldout-cartad">Unavailable</span>
          )}

          <strong className="shopmate-line-cartad">
            Rs. {lineTotal.toLocaleString("en-PK")}
          </strong>
        </div>
      </div>
    </article>
  );
}