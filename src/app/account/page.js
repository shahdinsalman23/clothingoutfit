import Link from "next/link";
import { redirect } from "next/navigation";
import { ShoppingBag, Clock, Wallet, ArrowRight, PackageOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { money, shortId, formatDate } from "@/lib/order-utils";

export const metadata = { title: "My Account | ShopMate" };

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase
      .from("orders")
      .select("id, created_at, status, total_amount")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const all = orders || [];
  const activeStatuses = ["pending", "confirmed", "processing", "shipped"];
  const activeCount = all.filter((o) => activeStatuses.includes(o.status || "pending")).length;
  const spent = all
    .filter((o) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const recent = all.slice(0, 3);
  const firstName = (profile?.full_name || user.email?.split("@")[0] || "there").split(" ")[0];

  const stats = [
    { label: "Total orders", value: all.length, icon: ShoppingBag, tone: "primary" },
    { label: "In progress", value: activeCount, icon: Clock, tone: "warning" },
    { label: "Total spent", value: money(spent), icon: Wallet, tone: "success" },
  ];

  return (
    <>
      <div className="shopmate-hello-accad">
        <span>MY ACCOUNT</span>
        <h1>Welcome back, {firstName}</h1>
        <p>Track your orders and manage your purchases from one place.</p>
      </div>

      <div className="shopmate-stats-accad">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="shopmate-stat-accad">
            <span className={`tone-${tone}-accad`}>
              <Icon size={21} />
            </span>
            <div>
              <small>{label}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="shopmate-panel-accad">
        <header>
          <h2>Recent orders</h2>
          <Link href="/account/orders">
            View all <ArrowRight size={14} />
          </Link>
        </header>

        {recent.length === 0 ? (
          <div className="shopmate-empty-accad slim-accad">
            <span>
              <PackageOpen size={26} />
            </span>
            <strong>No orders yet</strong>
            <p>When you place an order, it will show up here.</p>
            <Link href="/products" className="shopmate-btn-primary-shdad">
              Start shopping
            </Link>
          </div>
        ) : (
          <ul className="shopmate-mini-accad">
            {recent.map((order) => {
              const status = order.status || "pending";
              return (
                <li key={order.id}>
                  <Link href={`/account/orders/${order.id}`}>
                    <span className="shopmate-idchip-accad font-monospace">#{shortId(order.id)}</span>
                    <div>
                      <strong>{money(order.total_amount)}</strong>
                      <small>{formatDate(order.created_at)}</small>
                    </div>
                    <span className={`shopmate-status-accad status-${status}-accad`}>
                      {status.toUpperCase()}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}