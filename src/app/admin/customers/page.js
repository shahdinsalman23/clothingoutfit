import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import {
  Users,
  UserPlus,
  ShoppingBag,
  Search,
  X,
  Mail,
  Phone,
  CalendarDays,
  AlertCircle,
  UserX,
} from "lucide-react";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminCustomersPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;
  const query = (params?.q || "").toString().trim();

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load customers: ${error.message}`);
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total_amount, status");

  // Per customer order stats
  const orderStats = {};
  (orders || []).forEach((order) => {
    if (!order.user_id) return;
    if (!orderStats[order.user_id]) {
      orderStats[order.user_id] = { count: 0, spent: 0 };
    }
    orderStats[order.user_id].count += 1;
    if (order.status !== "cancelled" && order.status !== "returned") {
      orderStats[order.user_id].spent += Number(order.total_amount || 0);
    }
  });

  const allCustomers = (profiles || []).map((profile) => {
    const name =
      profile.full_name || profile.name || profile.username || "Unnamed Customer";
    const stats = orderStats[profile.id] || { count: 0, spent: 0 };
    return {
      id: profile.id,
      name,
      email: profile.email || "",
      phone: profile.phone || "",
      role: profile.role || "customer",
      createdAt: profile.created_at,
      orderCount: stats.count,
      spent: stats.spent,
    };
  });

  const now = new Date();
  const totalCustomers = allCustomers.length;
  const newThisMonth = allCustomers.filter((c) => {
    if (!c.createdAt) return false;
    const d = new Date(c.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const activeBuyers = allCustomers.filter((c) => c.orderCount > 0).length;

  const customers = query
    ? allCustomers.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q)
        );
      })
    : allCustomers;

  return (
    <div className="shopmate-inv-wrapper-custad container-fluid px-0">

      {/* Top Header Row */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12 col-lg-6">
          <span className="shopmate-inv-eyebrow-custad">CUSTOMER MANAGEMENT</span>
          <h1 className="shopmate-inv-title-custad">Customers</h1>
          <p className="shopmate-inv-subtitle-custad mb-0">
            View your customer base, their activity, and lifetime spending.
          </p>
        </div>

        <div className="col-12 col-lg-5 col-xl-4">
          <form method="get" className="shopmate-search-form-custad" role="search">
            <Search size={17} className="shopmate-search-icon-custad" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search name, email or phone..."
              className="shopmate-search-input-custad"
              aria-label="Search customers"
            />
            {query && (
              <Link
                href="/admin/customers"
                className="shopmate-search-clear-custad"
                aria-label="Clear search"
              >
                <X size={15} />
              </Link>
            )}
          </form>
        </div>
      </div>

      {/* Error Notification Banner */}
      {params?.error && (
        <div className="shopmate-inv-notice-custad shopmate-inv-error-notice-custad mb-4" role="alert">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{params.error}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="shopmate-stat-box-custad">
            <div className="shopmate-stat-icon-wrap-custad shopmate-icon-primary-custad">
              <Users size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-custad">Total Customers</span>
              <strong className="shopmate-stat-value-custad">{totalCustomers}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="shopmate-stat-box-custad">
            <div className="shopmate-stat-icon-wrap-custad shopmate-icon-success-custad">
              <UserPlus size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-custad">New This Month</span>
              <strong className="shopmate-stat-value-custad">{newThisMonth}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-12 col-xl-4">
          <div className="shopmate-stat-box-custad">
            <div className="shopmate-stat-icon-wrap-custad shopmate-icon-warning-custad">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-custad">Active Buyers</span>
              <strong className="shopmate-stat-value-custad">{activeBuyers}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="shopmate-table-card-custad">
        <div className="shopmate-table-header-custad">
          <div>
            <h2 className="shopmate-table-title-custad">Customers Directory</h2>
            <p className="shopmate-table-desc-custad mb-0">
              {query
                ? `Showing results for "${query}"`
                : "Complete list of registered customers, newest first."}
            </p>
          </div>
          <span className="shopmate-table-badge-custad">{customers.length} items</span>
        </div>

        {customers.length === 0 ? (
          <div className="shopmate-empty-box-custad">
            <div className="shopmate-empty-icon-wrap-custad">
              <UserX size={40} />
            </div>
            <h3>{query ? "No matching customers" : "No customers yet"}</h3>
            <p>
              {query
                ? "Try a different name, email or phone number."
                : "Customers will appear here once they sign up to your store."}
            </p>
            {query && (
              <Link href="/admin/customers" className="shopmate-clear-btn-custad">
                Clear search
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="table-responsive d-none d-lg-block">
              <table className="table shopmate-custom-table-custad align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Customer</th>
                    <th>Contact</th>
                    <th>Joined</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th className="text-end pe-4">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="ps-4">
                        <div className="shopmate-customer-cell-custad">
                          <div className="shopmate-avatar-custad">
                            {getInitials(customer.name)}
                          </div>
                          <div className="shopmate-customer-text-custad">
                            <strong>{customer.name}</strong>
                            <small className="font-monospace">
                              #{String(customer.id).slice(0, 8)}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="shopmate-contact-cell-custad">
                          <span>
                            <Mail size={13} />
                            {customer.email || "No email"}
                          </span>
                          <span>
                            <Phone size={13} />
                            {customer.phone || "No phone"}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className="shopmate-date-text-custad">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`shopmate-orders-chip-custad ${
                            customer.orderCount > 0 ? "chip-active-custad" : "chip-idle-custad"
                          }`}
                        >
                          {customer.orderCount} {customer.orderCount === 1 ? "order" : "orders"}
                        </span>
                      </td>

                      <td>
                        <span className="shopmate-price-text-custad">
                          PKR {customer.spent.toLocaleString()}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        <span
                          className={`shopmate-badge-custad ${
                            customer.role === "admin" ? "badge-admin-custad" : "badge-customer-custad"
                          }`}
                        >
                          {String(customer.role).toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile and Tablet Cards */}
            <div className="shopmate-mobile-list-custad d-lg-none">
              {customers.map((customer) => (
                <div key={customer.id} className="shopmate-mobile-card-custad">
                  <div className="shopmate-mobile-top-custad">
                    <div className="shopmate-customer-cell-custad">
                      <div className="shopmate-avatar-custad">
                        {getInitials(customer.name)}
                      </div>
                      <div className="shopmate-customer-text-custad">
                        <strong>{customer.name}</strong>
                        <small className="font-monospace">
                          #{String(customer.id).slice(0, 8)}
                        </small>
                      </div>
                    </div>
                    <span
                      className={`shopmate-badge-custad ${
                        customer.role === "admin" ? "badge-admin-custad" : "badge-customer-custad"
                      }`}
                    >
                      {String(customer.role).toUpperCase()}
                    </span>
                  </div>

                  <div className="shopmate-contact-cell-custad shopmate-mobile-contact-custad">
                    <span>
                      <Mail size={13} />
                      {customer.email || "No email"}
                    </span>
                    <span>
                      <Phone size={13} />
                      {customer.phone || "No phone"}
                    </span>
                    <span>
                      <CalendarDays size={13} />
                      Joined {formatDate(customer.createdAt)}
                    </span>
                  </div>

                  <div className="shopmate-mobile-stats-custad">
                    <div>
                      <small>Orders</small>
                      <strong>{customer.orderCount}</strong>
                    </div>
                    <div>
                      <small>Total Spent</small>
                      <strong>PKR {customer.spent.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}