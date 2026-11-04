import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { RevenueChart, StatusChart, TopProductsChart } from "./DashboardCharts";
import {
  Wallet,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  AlertTriangle,
  Plus,
  Clock,
  FolderTree,
  CheckCircle2,
  Receipt,
  PackageOpen,
} from "lucide-react";

const TZ = "Asia/Karachi";
const DAYS = 90;
const PLACEHOLDER = "/images/placeholders/product-placeholder.png";

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const dayKey = (value) =>
  new Date(value).toLocaleDateString("en-CA", { timeZone: TZ });

const isValidSale = (order) =>
  order.status !== "cancelled" && order.status !== "returned";

const sum = (rows, field) => rows.reduce((total, row) => total + row[field], 0);

const percentChange = (current, previous) => {
  if (previous > 0) return ((current - previous) / previous) * 100;
  return current > 0 ? 100 : 0;
};

const money = (value) => `PKR ${Math.round(value).toLocaleString("en-PK")}`;

function getGreeting() {
  const hour =
    Number(
      new Date().toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        timeZone: TZ,
      })
    ) % 24;
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Trend({ value }) {
  const up = value >= 0;
  return (
    <span className={`shopmate-trend-dashad ${up ? "up-dashad" : "down-dashad"}`}>
      {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export default async function AdminDashboard() {
  const { supabase, profile } = await requireAdmin();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [
    ordersRes,
    customersRes,
    newCustomersRes,
    productsRes,
    itemsRes,
    categoriesRes,
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("id, created_at, status, total_amount, shipping_address, user_id")
      .order("created_at", { ascending: false })
      .limit(5000),

    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .or("role.is.null,role.neq.admin"),

    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .or("role.is.null,role.neq.admin")
      .gte("created_at", monthStart),

    supabase
      .from("products")
      .select("id, name, slug, price, stock, is_active, product_images (image_url, sort_order)"),

    supabase.from("order_items").select("product_id, quantity").limit(10000),

    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  if (ordersRes.error) {
    throw new Error(`Unable to load dashboard orders: ${ordersRes.error.message}`);
  }

  const orders = ordersRes.data || [];
  const products = productsRes.data || [];
  const orderItems = itemsRes.error ? [] : itemsRes.data || [];

  // ---------- Daily series (last 90 days) ----------
  const series = [];
  const index = {};
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const row = {
      date: dayKey(d),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ }),
      revenue: 0,
      orders: 0,
    };
    series.push(row);
    index[row.date] = row;
  }

  orders.forEach((order) => {
    const row = index[dayKey(order.created_at)];
    if (!row) return;
    row.orders += 1;
    if (isValidSale(order)) row.revenue += Number(order.total_amount || 0);
  });

  // ---------- KPIs ----------
  const totalRevenue = orders
    .filter(isValidSale)
    .reduce((total, o) => total + Number(o.total_amount || 0), 0);
  const totalOrders = orders.length;

  const last30 = series.slice(-30);
  const prev30 = series.slice(-60, -30);
  const revenueTrend = percentChange(sum(last30, "revenue"), sum(prev30, "revenue"));
  const ordersTrend = percentChange(sum(last30, "orders"), sum(prev30, "orders"));

  const totalCustomers = customersRes.count ?? 0;
  const newCustomers = newCustomersRes.count ?? 0;
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const totalCategories = categoriesRes.count ?? 0;

  const validOrders = orders.filter(isValidSale);
  const averageOrder = validOrders.length ? totalRevenue / validOrders.length : 0;
  const pendingCount = orders.filter((o) => !o.status || o.status === "pending").length;

  // ---------- Status breakdown ----------
  const statusData = STATUS_ORDER.map((status) => ({
    name: status,
    value: orders.filter((o) => (o.status || "pending") === status).length,
  })).filter((item) => item.value > 0);

  // ---------- Top selling products ----------
  const soldMap = {};
  orderItems.forEach((item) => {
    if (!item.product_id) return;
    soldMap[item.product_id] = (soldMap[item.product_id] || 0) + Number(item.quantity || 0);
  });
  const nameMap = Object.fromEntries(products.map((p) => [p.id, p.name]));
  const topProducts = Object.entries(soldMap)
    .map(([id, sold]) => ({ name: nameMap[id] || "Deleted product", sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // ---------- Low stock ----------
  const lowStock = products
    .filter((p) => p.is_active && Number(p.stock || 0) < 10)
    .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
    .slice(0, 5)
    .map((p) => {
      const images = [...(p.product_images || [])].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      );
      return { ...p, imageUrl: images[0]?.image_url || PLACEHOLDER };
    });

  // ---------- Recent orders ----------
  const recentOrders = orders.slice(0, 6);

  const firstName = (profile?.full_name || "Admin").split(" ")[0];
  const todayLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: TZ,
  });

  const kpis = [
    {
      label: "Total Revenue",
      value: money(totalRevenue),
      icon: Wallet,
      tone: "success",
      trend: revenueTrend,
      note: "vs previous 30 days",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      tone: "primary",
      trend: ordersTrend,
      note: "vs previous 30 days",
    },
    {
      label: "Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      tone: "violet",
      note: `+${newCustomers} this month`,
    },
    {
      label: "Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      tone: "warning",
      note: `${activeProducts} active`,
    },
  ];

  return (
    <div className="shopmate-inv-wrapper-dashad container-fluid px-0">

      {/* Header */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12 col-md-8">
          <span className="shopmate-inv-eyebrow-dashad">{todayLabel}</span>
          <h1 className="shopmate-inv-title-dashad">
            {getGreeting()}, {firstName}
          </h1>
          <p className="shopmate-inv-subtitle-dashad mb-0">
            Here is what is happening with your store today.
          </p>
        </div>

        <div className="col-12 col-md-auto">
          <Link className="shopmate-primary-btn-dashad" href="/admin/products/new">
            <Plus size={18} className="me-2" />
            Add New Product
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="col-12 col-sm-6 col-xl-3">
              <div className="shopmate-kpi-dashad">
                <div className="shopmate-kpi-top-dashad">
                  <div className={`shopmate-kpi-icon-dashad tone-${kpi.tone}-dashad`}>
                    <Icon size={22} />
                  </div>
                  {kpi.trend !== undefined && <Trend value={kpi.trend} />}
                </div>
                <span className="shopmate-kpi-label-dashad">{kpi.label}</span>
                <strong className="shopmate-kpi-value-dashad">{kpi.value}</strong>
                <small className="shopmate-kpi-note-dashad">{kpi.note}</small>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <div className="shopmate-card-dashad">
            <div className="shopmate-card-header-dashad">
              <div>
                <h2 className="shopmate-card-title-dashad">Revenue Overview</h2>
                <p className="shopmate-card-desc-dashad mb-0">
                  Sales from completed and active orders.
                </p>
              </div>
            </div>
            <RevenueChart data={series} />
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="shopmate-card-dashad">
            <div className="shopmate-card-header-dashad">
              <div>
                <h2 className="shopmate-card-title-dashad">Order Status</h2>
                <p className="shopmate-card-desc-dashad mb-0">Breakdown of all orders.</p>
              </div>
            </div>
            <StatusChart data={statusData} total={totalOrders} />
          </div>
        </div>
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-8">
          <div className="shopmate-card-dashad">
            <div className="shopmate-card-header-dashad">
              <div>
                <h2 className="shopmate-card-title-dashad">Recent Orders</h2>
                <p className="shopmate-card-desc-dashad mb-0">Latest purchases from your store.</p>
              </div>
              <Link href="/admin/orders" className="shopmate-link-btn-dashad">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="shopmate-empty-dashad">
                <div className="shopmate-empty-icon-dashad">
                  <Receipt size={26} />
                </div>
                <strong>No orders yet</strong>
                <span>New orders will show up here.</span>
              </div>
            ) : (
              <ul className="shopmate-order-list-dashad">
                {recentOrders.map((order) => {
                  const status = order.status || "pending";
                  const customer =
                    typeof order.shipping_address === "object" && order.shipping_address?.full_name
                      ? order.shipping_address.full_name
                      : "Valued Customer";
                  return (
                    <li key={order.id}>
                      <Link href={`/admin/orders/${order.id}`} className="shopmate-order-row-dashad">
                        <span className="shopmate-order-id-dashad font-monospace">
                          #{String(order.id).slice(0, 8)}
                        </span>
                        <div className="shopmate-order-main-dashad">
                          <strong>{customer}</strong>
                          <small>
                            {new Date(order.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              timeZone: TZ,
                            })}
                          </small>
                        </div>
                        <span className="shopmate-order-amount-dashad">
                          {money(Number(order.total_amount || 0))}
                        </span>
                        <span className={`shopmate-status-dashad status-${status}-dashad`}>
                          {status.toUpperCase()}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="shopmate-card-dashad">
            <div className="shopmate-card-header-dashad">
              <div>
                <h2 className="shopmate-card-title-dashad">Low Stock Alerts</h2>
                <p className="shopmate-card-desc-dashad mb-0">Active products under 10 units.</p>
              </div>
              <span className="shopmate-alert-icon-dashad">
                <AlertTriangle size={17} />
              </span>
            </div>

            {lowStock.length === 0 ? (
              <div className="shopmate-empty-dashad">
                <div className="shopmate-empty-icon-dashad ok-dashad">
                  <CheckCircle2 size={26} />
                </div>
                <strong>All stocked up</strong>
                <span>No products are running low.</span>
              </div>
            ) : (
              <ul className="shopmate-stock-list-dashad">
                {lowStock.map((product) => {
                  const stock = Number(product.stock || 0);
                  return (
                    <li key={product.id}>
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="shopmate-stock-row-dashad"
                      >
                        <div className="shopmate-thumb-dashad">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={product.imageUrl} alt={product.name} />
                        </div>
                        <div className="shopmate-stock-info-dashad">
                          <strong>{product.name}</strong>
                          <small>Rs. {Number(product.price).toLocaleString("en-PK")}</small>
                        </div>
                        <span
                          className={`shopmate-stock-badge-dashad ${
                            stock <= 0 ? "out-dashad" : "low-dashad"
                          }`}
                        >
                          {stock <= 0 ? "Out" : `${stock} left`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Top Products + Snapshot */}
      <div className="row g-3">
        <div className="col-12 col-xl-7">
          <div className="shopmate-card-dashad">
            <div className="shopmate-card-header-dashad">
              <div>
                <h2 className="shopmate-card-title-dashad">Top Selling Products</h2>
                <p className="shopmate-card-desc-dashad mb-0">Ranked by units sold.</p>
              </div>
            </div>
            <TopProductsChart data={topProducts} />
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="shopmate-card-dashad">
            <div className="shopmate-card-header-dashad">
              <div>
                <h2 className="shopmate-card-title-dashad">Store Snapshot</h2>
                <p className="shopmate-card-desc-dashad mb-0">Quick health check of your store.</p>
              </div>
            </div>

            <ul className="shopmate-snapshot-dashad">
              <li>
                <span className="shopmate-snap-icon-dashad tone-primary-dashad">
                  <Receipt size={17} />
                </span>
                <div>
                  <small>Average order value</small>
                  <strong>{money(averageOrder)}</strong>
                </div>
              </li>
              <li>
                <span className="shopmate-snap-icon-dashad tone-warning-dashad">
                  <Clock size={17} />
                </span>
                <div>
                  <small>Pending orders</small>
                  <strong>{pendingCount}</strong>
                </div>
              </li>
              <li>
                <span className="shopmate-snap-icon-dashad tone-violet-dashad">
                  <FolderTree size={17} />
                </span>
                <div>
                  <small>Categories</small>
                  <strong>{totalCategories}</strong>
                </div>
              </li>
              <li>
                <span className="shopmate-snap-icon-dashad tone-success-dashad">
                  <PackageOpen size={17} />
                </span>
                <div>
                  <small>Active products</small>
                  <strong>
                    {activeProducts} <em>of {totalProducts}</em>
                  </strong>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}