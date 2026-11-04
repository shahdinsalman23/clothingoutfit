import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import {
  ShoppingBag,
  Clock,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  PackageOpen,
} from "lucide-react";

// Helper function to safely extract customer display details
function getCustomerDetails(shippingAddress) {
  let addr = shippingAddress;

  // If shipping_address comes as a JSON string from database, parse it safely
  if (typeof addr === "string") {
    try {
      addr = JSON.parse(addr);
    } catch {
      // If it's a plain text address string
      return {
        name: "Valued Customer",
        addressText: shippingAddress,
      };
    }
  }

  if (!addr || typeof addr !== "object") {
    return {
      name: "Valued Customer",
      addressText: "Standard Shipping",
    };
  }

  // 1. Extract Customer Name
  const name =
    addr.full_name ||
    addr.fullName ||
    addr.name ||
    (addr.first_name ? `${addr.first_name} ${addr.last_name || ""}`.trim() : null) ||
    "Valued Customer";

  // 2. Format Readable Address or City
  const street = addr.address || addr.street || addr.address_line1 || "";
  const city = addr.city || "";
  const state = addr.state || addr.province || "";
  const country = addr.country || "Pakistan";

  const locationParts = [street, city, state || country].filter(Boolean);
  const formattedAddress =
    locationParts.length > 0
      ? locationParts.join(", ")
      : addr.email || "Standard Shipping";

  return {
    name,
    addressText: formattedAddress,
  };
}

export default async function AdminOrdersPage({ searchParams }) {
  const { supabase } = await requireAdmin();
  const params = await searchParams;

  // Fetching orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      status,
      total_amount,
      shipping_address,
      user_id
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load orders: ${error.message}`);
  }

  const allOrders = orders || [];
  const totalOrders = allOrders.length;
  const pendingCount = allOrders.filter(
    (o) => !o.status || o.status === "pending"
  ).length;
  const totalRevenue = allOrders
    .filter((o) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const statusClasses = {
    pending: "badge-pending-ordad",
    confirmed: "badge-confirmed-ordad",
    processing: "badge-processing-ordad",
    shipped: "badge-shipped-ordad",
    delivered: "badge-delivered-ordad",
    cancelled: "badge-cancelled-ordad",
    returned: "badge-returned-ordad",
  };

  return (
    <div className="shopmate-inv-wrapper-ordad container-fluid px-0">

      {/* Top Header Row */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12 col-md-8">
          <span className="shopmate-inv-eyebrow-ordad">ORDER MANAGEMENT</span>
          <h1 className="shopmate-inv-title-ordad">Orders</h1>
          <p className="shopmate-inv-subtitle-ordad mb-0">
            Monitor and manage customer purchases, fulfillment, and status.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {params?.success && (
        <div className="shopmate-inv-notice-ordad shopmate-inv-success-notice-ordad mb-4" role="status">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          <span>Order status updated successfully!</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {params?.error && (
        <div className="shopmate-inv-notice-ordad shopmate-inv-error-notice-ordad mb-4" role="alert">
          <AlertCircle size={18} className="flex-shrink-0" />
          <span>{params.error}</span>
        </div>
      )}

      {/* Stats Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-ordad">
            <div className="shopmate-stat-icon-wrap-ordad shopmate-icon-primary-ordad">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-ordad">Total Orders</span>
              <strong className="shopmate-stat-value-ordad">{totalOrders}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-ordad">
            <div className="shopmate-stat-icon-wrap-ordad shopmate-icon-warning-ordad">
              <Clock size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-ordad">Pending Orders</span>
              <strong className="shopmate-stat-value-ordad">{pendingCount}</strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="shopmate-stat-box-ordad">
            <div className="shopmate-stat-icon-wrap-ordad shopmate-icon-success-ordad">
              <Wallet size={22} />
            </div>
            <div>
              <span className="shopmate-stat-label-ordad">Total Revenue</span>
              <strong className="shopmate-stat-value-ordad">
                PKR {totalRevenue.toLocaleString()}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="shopmate-table-card-ordad">
        <div className="shopmate-table-header-ordad">
          <div>
            <h2 className="shopmate-table-title-ordad">Orders Directory</h2>
            <p className="shopmate-table-desc-ordad mb-0">
              Complete list of customer orders, newest first.
            </p>
          </div>
          <span className="shopmate-table-badge-ordad">{totalOrders} items</span>
        </div>

        {allOrders.length === 0 ? (
          <div className="shopmate-empty-box-ordad">
            <div className="shopmate-empty-icon-wrap-ordad">
              <PackageOpen size={40} />
            </div>
            <h3>No orders found</h3>
            <p>Orders placed by customers will appear here once they start coming in.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table shopmate-custom-table-ordad align-middle mb-0">
              <thead>
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer Info</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order) => {
                  const customer = getCustomerDetails(order.shipping_address);

                  return (
                    <tr key={order.id}>
                      <td className="ps-4">
                        <span className="shopmate-order-id-ordad font-monospace">
                          #{order.id.slice(0, 8)}
                        </span>
                      </td>

                      <td>
                        <div className="shopmate-customer-cell-ordad">
                          <strong className="d-block text-dark fw-bold">
                            {customer.name}
                          </strong>
                          <small
                            className="text-muted text-truncate d-block"
                            style={{ maxWidth: "220px" }}
                            title={customer.addressText}
                          >
                            {customer.addressText}
                          </small>
                        </div>
                      </td>

                      <td>
                        <span className="shopmate-date-text-ordad">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      <td>
                        <span className="shopmate-price-text-ordad">
                          PKR {Number(order.total_amount).toLocaleString()}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`shopmate-badge-ordad ${
                            statusClasses[order.status] || "badge-default-ordad"
                          }`}
                        >
                          {order.status ? order.status.toUpperCase() : "PENDING"}
                        </span>
                      </td>

                      <td className="text-end pe-4">
                        <div className="shopmate-action-buttons-ordad justify-content-end">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="shopmate-view-btn-ordad"
                          >
                            <span>View Details</span>
                            <ArrowRight size={15} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}