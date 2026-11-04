import { ShieldCheck, Truck, Banknote } from "lucide-react";

const money = (value) => `Rs. ${Number(value).toLocaleString("en-PK")}`;

export default function OrderSummary({ items, subtotal, shipping, freeMin, children }) {
  const total = subtotal + shipping;
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const remaining = Math.max(0, freeMin - subtotal);

  return (
    <aside className="shopmate-summary-chkad">
      <h2>
        Order summary <span>{count} {count === 1 ? "item" : "items"}</span>
      </h2>

      <ul className="shopmate-items-chkad">
        {items.map((item) => (
          <li key={item.id}>
            <div className="thumb-chkad">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt={item.name} />
              )}
              <b>{item.quantity}</b>
            </div>
            <div className="name-chkad">
              <strong>{item.name}</strong>
              <small>{money(item.price)} each</small>
            </div>
            <span>{money(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl>
        <div>
          <dt>Subtotal</dt>
          <dd>{money(subtotal)}</dd>
        </div>
        <div>
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? <em className="free-chkad">Free</em> : money(shipping)}</dd>
        </div>
        <div className="total-chkad">
          <dt>Total</dt>
          <dd>{money(total)}</dd>
        </div>
      </dl>

      {remaining > 0 && (
        <p className="shopmate-hint-chkad">
          <Truck size={15} /> Add {money(remaining)} more to get free shipping.
        </p>
      )}

      {children}

      <ul className="shopmate-trust-chkad">
        <li><ShieldCheck size={15} /> Your details are protected</li>
        <li><Banknote size={15} /> Pay in cash on delivery</li>
      </ul>
    </aside>
  );
}