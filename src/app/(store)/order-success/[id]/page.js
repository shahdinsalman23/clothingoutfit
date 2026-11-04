import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, MapPin, Banknote, Package, ArrowRight, Phone, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { money, shortId, formatDate, parseAddress, loadProductMap } from "@/lib/order-utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order confirmed | ShopMate" };

export default async function OrderSuccessPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, total_amount, subtotal, shipping_fee, shipping_address, payment_method, order_items (product_id, product_name, quantity, unit_price)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const address = parseAddress(order.shipping_address);
  const rawItems = order.order_items || [];
  const productMap = await loadProductMap(supabase, rawItems.map((item) => item.product_id));
  const items = rawItems.map((item) => ({
    ...item,
    imageUrl: productMap[item.product_id]?.imageUrl || "",
  }));

  return (
    <section className="shopmate-chk-chkad">
      <div className="shopmate-wrap-homad">
        <ol className="shopmate-steps-chkad" aria-label="Checkout progress">
          <li className="done-chkad"><span>1</span> Cart</li>
          <li className="done-chkad"><span>2</span> Checkout</li>
          <li className="current-chkad"><span>3</span> Confirmation</li>
        </ol>

        <div className="shopmate-success-chkad">
          <div className="burst-chkad">
            <CheckCircle2 size={44} />
          </div>
          <h1>Thank you, your order is confirmed</h1>
          <p>
            We have received your order and will contact you shortly on{" "}
            <strong>{address.phone || "your phone"}</strong> to confirm delivery.
          </p>
          <span className="orderno-chkad">Order #{shortId(order.id)}</span>
        </div>

        <div className="shopmate-receipt-chkad">
          <div className="shopmate-card-chkad">
            <h2 className="plain-chkad">Items ordered</h2>
            <ul className="shopmate-rows-chkad">
              {items.map((item, i) => (
                <li key={i} className="withimg-chkad">
                  <span className="rowimg-chkad">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.product_name || "Product"} />
                    ) : (
                      <ImageOff size={18} />
                    )}
                  </span>
                  <div>
                    <strong>{item.product_name || "Product"}</strong>
                    <small>{item.quantity} × {money(item.unit_price)}</small>
                  </div>
                  <span>{money(item.quantity * item.unit_price)}</span>
                </li>
              ))}
            </ul>
            <dl className="shopmate-totals-chkad">
              <div><dt>Subtotal</dt><dd>{money(order.subtotal ?? order.total_amount)}</dd></div>
              <div><dt>Shipping</dt><dd>{Number(order.shipping_fee) === 0 ? "Free" : money(order.shipping_fee)}</dd></div>
              <div className="total-chkad"><dt>Total</dt><dd>{money(order.total_amount)}</dd></div>
            </dl>
          </div>

          <div className="shopmate-side-chkad">
            <div className="shopmate-card-chkad">
              <h3><MapPin size={17} /> Delivery address</h3>
              <p>
                <strong>{address.full_name}</strong><br />
                {address.address}<br />
                {[address.city, address.postal_code].filter(Boolean).join(", ")}
              </p>
              {address.phone && (
                <p className="phone-chkad"><Phone size={14} /> {address.phone}</p>
              )}
            </div>
            <div className="shopmate-card-chkad">
              <h3><Banknote size={17} /> Payment</h3>
              <p>
                {order.payment_method === "cod" || !order.payment_method ? "Cash on Delivery" : order.payment_method}
                <br />
                <small>Placed on {formatDate(order.created_at)}</small>
              </p>
            </div>
            <div className="shopmate-card-chkad">
              <h3><Package size={17} /> Status</h3>
              <p><span className="status-chkad">{String(order.status || "pending").toUpperCase()}</span></p>
            </div>
          </div>
        </div>

        <div className="shopmate-cta-chkad">
          <Link href="/account/orders" className="shopmate-btn-ghost-shdad large-shdad">View my orders</Link>
          <Link href="/products" className="shopmate-btn-primary-shdad large-shdad">
            Continue shopping <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}