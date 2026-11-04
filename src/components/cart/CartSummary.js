import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, Lock } from "lucide-react";

const money = (value) => `Rs. ${Number(value).toLocaleString("en-PK")}`;

export default function CartSummary({ subtotal, shipping, total, itemCount, freeMin, canCheckout }) {
  const remaining = Math.max(0, freeMin - subtotal);
  const progress = Math.min(100, (subtotal / freeMin) * 100);

  return (
    <aside className="shopmate-summary-cartad">
      <h2>Order summary</h2>

      {canCheckout && (
        <div className="shopmate-ship-cartad">
          <p>
            <Truck size={16} />
            {remaining > 0 ? (
              <span>
                Add <strong>{money(remaining)}</strong> more for free shipping
              </span>
            ) : (
              <span>
                <strong>You unlocked free shipping</strong>
              </span>
            )}
          </p>
          <div className="shopmate-bar-cartad">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <dl>
        <div>
          <dt>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? (canCheckout ? "Free" : "-") : money(shipping)}</dd>
        </div>
        <div className="total-cartad">
          <dt>Total</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      {canCheckout ? (
        <Link href="/checkout" className="shopmate-checkout-cartad">
          <Lock size={16} /> Proceed to checkout <ArrowRight size={16} />
        </Link>
      ) : (
        <span className="shopmate-checkout-cartad disabled-cartad">Nothing to checkout</span>
      )}

      <p className="shopmate-secure-cartad">
        <ShieldCheck size={15} /> Secure checkout, your details stay protected.
      </p>

      {/* Mobile sticky bar */}
      {canCheckout && (
        <div className="shopmate-mobilebar-cartad">
          <div>
            <small>Total</small>
            <strong>{money(total)}</strong>
          </div>
          <Link href="/checkout">
            Checkout <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </aside>
  );
}