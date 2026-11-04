import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PackageOpen, ImageOff } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FILTERS, money, shortId, formatDate, loadProductMap } from "@/lib/order-utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Orders | ShopMate" };

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "In progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export default async function AccountOrdersPage({ searchParams }) {
  const params = await searchParams;
  const filter = Object.hasOwn(FILTERS, params?.status) ? params.status : "all";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, status, total_amount, order_items (product_id, product_name, quantity)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(`Unable to load orders: ${error.message}`);

  const all = data || [];
  const productIds = all.flatMap((order) => (order.order_items || []).map((item) => item.product_id));
  const productMap = await loadProductMap(supabase, productIds);

  const counts = Object.fromEntries(
    TABS.map(({ key }) => [
      key,
      key === "all"
        ? all.length
        : all.filter((o) => FILTERS[key].includes(o.status || "pending")).length,
    ])
  );

  const orders =
    filter === "all" ? all : all.filter((o) => FILTERS[filter].includes(o.status || "pending"));

  return (
    <>
      <div className="shopmate-hello-accad">
        <span>ORDER HISTORY</span>
        <h1>My orders</h1>
        <p>Check the status of your orders and view past purchases.</p>
      </div>

      <div className="shopmate-tabs-accad" role="tablist">
        {TABS.map(({ key, label }) => (
          <Link
            key={key}
            href={key === "all" ? "/account/orders" : `/account/orders?status=${key}`}
            className={filter === key ? "active-accad" : ""}
            role="tab"
            aria-selected={filter === key}
          >
            {label} <em>{counts[key]}</em>
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="shopmate-empty-accad">
          <span>
            <PackageOpen size={32} />
          </span>
          <strong>{filter === "all" ? "No orders yet" : "No orders in this view"}</strong>
          <p>
            {filter === "all"
              ? "Once you place an order, you can track it right here."
              : "Try another tab to see your other orders."}
          </p>
          <Link href="/products" className="shopmate-btn-primary-shdad">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="shopmate-orders-accad">
          {orders.map((order) => {
            const status = order.status || "pending";
            const items = order.order_items || [];
            const qty = items.reduce((sum, item) => sum + item.quantity, 0);
            const shown = items.slice(0, 4);
            const extra = items.length - shown.length;
            const names = items.map((item) => item.product_name || "Product").join(", ");

            return (
              <article key={order.id} className="shopmate-order-accad">
                <header>
                  <div className="shopmate-meta-accad">
                    <span className="shopmate-idchip-accad font-monospace">#{shortId(order.id)}</span>
                    <small>Placed on {formatDate(order.created_at)}</small>
                  </div>
                  <span className={`shopmate-status-accad status-${status}-accad`}>
                    {status.toUpperCase()}
                  </span>
                </header>

                <div className="shopmate-body-accad">
                  <div className="shopmate-thumbs-accad">
                    {shown.map((item, i) => {
                      const image = productMap[item.product_id]?.imageUrl;
                      return (
                        <span key={i} className="thumb-accad" title={item.product_name}>
                          {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt={item.product_name || "Product"} />
                          ) : (
                            <ImageOff size={18} />
                          )}
                        </span>
                      );
                    })}
                    {extra > 0 && <span className="thumb-accad more-accad">+{extra}</span>}
                  </div>

                  <div className="shopmate-summary-accad">
                    <p>{names}</p>
                    <small>
                      {qty} {qty === 1 ? "item" : "items"}
                    </small>
                  </div>

                  <div className="shopmate-total-accad">
                    <small>Total</small>
                    <strong>{money(order.total_amount)}</strong>
                  </div>
                </div>

                <footer>
                  <Link href={`/account/orders/${order.id}`} className="shopmate-view-accad">
                    View details <ArrowRight size={15} />
                  </Link>
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}