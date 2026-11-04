import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  StickyNote,
  Check,
  XCircle,
  ImageOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { STEPS, money, shortId, formatDate, parseAddress, loadProductMap } from "@/lib/order-utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order details | ShopMate" };

export default async function AccountOrderDetailPage({ params }) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, created_at, status, total_amount, subtotal, shipping_fee, shipping_address, payment_method, notes, order_items (product_id, product_name, quantity, unit_price)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) notFound();

  const status = order.status || "pending";
  const address = parseAddress(order.shipping_address);
  const rawItems = order.order_items || [];
  const productMap = await loadProductMap(supabase, rawItems.map((item) => item.product_id));

  const items = rawItems.map((item) => ({
    ...item,
    imageUrl: productMap[item.product_id]?.imageUrl || "",
    slug: productMap[item.product_id]?.slug || "",
  }));

  const stopped = status === "cancelled" || status === "returned";
  const currentIndex = STEPS.findIndex((step) => step.key === status);
  const subtotal = order.subtotal ?? items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const shipping = Number(order.shipping_fee || 0);

  return (
    <>
      <Link href="/account/orders" className="shopmate-backlink-accad">
        <ChevronLeft size={16} /> Back to orders
      </Link>

      <div className="shopmate-detail-head-accad">
        <div>
          <span className="shopmate-idchip-accad font-monospace big-accad">#{shortId(order.id)}</span>
          <h1>Order details</h1>
          <p>Placed on {formatDate(order.created_at, true)}</p>
        </div>
        <span className={`shopmate-status-accad status-${status}-accad large-accad`}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Tracker */}
      <div className="shopmate-panel-accad padded-accad">
        {stopped ? (
          <div className="shopmate-stopped-accad">
            <XCircle size={22} />
            <div>
              <strong>This order was {status}</strong>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        ) : (
          <ol className="shopmate-track-accad">
            {STEPS.map((step, index) => {
              const done = index < currentIndex || status === "delivered";
              const current = index === currentIndex && status !== "delivered";
              return (
                <li key={step.key} className={done ? "done-accad" : current ? "current-accad" : ""}>
                  <span>{done ? <Check size={15} /> : index + 1}</span>
                  <small>{step.label}</small>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="shopmate-split-accad">
        {/* Items */}
        <div className="shopmate-panel-accad padded-accad">
          <h2 className="shopmate-h2-accad">Items ({items.length})</h2>

          <ul className="shopmate-lines-accad">
            {items.map((item, i) => (
              <li key={i}>
                <span className="thumb-accad big-accad">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.product_name || "Product"} />
                  ) : (
                    <ImageOff size={20} />
                  )}
                </span>
                <div>
                  {item.slug ? (
                    <Link href={`/products/${item.slug}`}>{item.product_name || "Product"}</Link>
                  ) : (
                    <strong>{item.product_name || "Product"}</strong>
                  )}
                  <small>
                    {item.quantity} × {money(item.unit_price)}
                  </small>
                </div>
                <b>{money(item.quantity * item.unit_price)}</b>
              </li>
            ))}
          </ul>

          <dl className="shopmate-totals-accad">
            <div>
              <dt>Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{shipping === 0 ? "Free" : money(shipping)}</dd>
            </div>
            <div className="grand-accad">
              <dt>Total</dt>
              <dd>{money(order.total_amount)}</dd>
            </div>
          </dl>
        </div>

        {/* Info */}
        <div className="shopmate-infocol-accad">
          <div className="shopmate-panel-accad padded-accad">
            <h3 className="shopmate-h3-accad">
              <MapPin size={17} /> Delivery address
            </h3>
            {address.address || address.full_name ? (
              <p className="shopmate-addr-accad">
                <strong>{address.full_name}</strong>
                {address.address}
                <br />
                {[address.city, address.postal_code].filter(Boolean).join(", ")}
              </p>
            ) : (
              <p className="shopmate-addr-accad muted-accad">Address not available.</p>
            )}
            {address.phone && (
              <span className="shopmate-contact-accad">
                <Phone size={14} /> {address.phone}
              </span>
            )}
            {address.email && (
              <span className="shopmate-contact-accad">
                <Mail size={14} /> {address.email}
              </span>
            )}
          </div>

          <div className="shopmate-panel-accad padded-accad">
            <h3 className="shopmate-h3-accad">
              <CreditCard size={17} /> Payment
            </h3>
            <p className="shopmate-addr-accad">
              {order.payment_method === "cod" || !order.payment_method
                ? "Cash on Delivery"
                : order.payment_method}
              <br />
              <small>Pay when your order arrives.</small>
            </p>
          </div>

          {order.notes && (
            <div className="shopmate-panel-accad padded-accad">
              <h3 className="shopmate-h3-accad">
                <StickyNote size={17} /> Your notes
              </h3>
              <p className="shopmate-addr-accad">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}