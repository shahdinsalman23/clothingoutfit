import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { updateOrderStatus } from "@/app/actions/orders";
import {
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Clock,
  ExternalLink,
} from "lucide-react";
import SuccessPopup from "@/components/admin/SuccessPopup";
import { SaveButton, SavingOverlay } from "@/components/admin/ProductFormStatus";
// Helper function to safely parse shipping address / customer details
function parseShippingDetails(shippingAddress) {
  let addr = shippingAddress;

  if (typeof addr === "string") {
    try {
      addr = JSON.parse(addr);
    } catch {
      return {
        fullName: "Valued Customer",
        email: "N/A",
        phone: "N/A",
        fullAddress: shippingAddress,
      };
    }
  }

  if (!addr || typeof addr !== "object") {
    return {
      fullName: "Valued Customer",
      email: "N/A",
      phone: "N/A",
      fullAddress: "Standard Shipping",
    };
  }

  const fullName =
    addr.full_name ||
    addr.fullName ||
    addr.name ||
    (addr.first_name ? `${addr.first_name} ${addr.last_name || ""}`.trim() : null) ||
    "Valued Customer";

  const email = addr.email || "N/A";
  const phone = addr.phone || addr.phoneNumber || "N/A";

  const street = addr.address || addr.street || addr.address_line1 || "";
  const city = addr.city || "";
  const state = addr.state || addr.province || "";
  const postalCode = addr.postal_code || addr.zipCode || "";
  const country = addr.country || "Pakistan";

  const addressParts = [street, city, state, postalCode, country].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : "Standard Shipping";

  return {
    fullName,
    email,
    phone,
    fullAddress,
  };
}

export default async function AdminOrderDetailPage({ params, searchParams }) {
  const { supabase } = await requireAdmin();
  const resolvedParams = await params;
  const orderId = resolvedParams.id;
  const resolvedSearchParams = await searchParams;

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        id,
        quantity,
        unit_price,
        product_name
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    throw new Error(`Order not found: ${error?.message || ""}`);
  }

  const customer = parseShippingDetails(order.shipping_address);

  return (
    <div className="shopmate-inv-wrapper-ordad container-fluid px-0">
      
      {/* Success Modal / Popup Notification if updated */}
     <SuccessPopup type={resolvedSearchParams?.success ? "updated" : undefined} entity="order" />

      {/* Top Header Row */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12">
          <Link href="/admin/orders" className="shopmate-back-link-ordad">
            <ArrowLeft size={16} /> Back to Orders Directory
          </Link>
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-2">
            <div>
              <span className="shopmate-inv-eyebrow-ordad">ORDER FULFILLMENT</span>
              <h1 className="shopmate-inv-title-ordad font-monospace">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="shopmate-inv-subtitle-ordad mb-0 d-flex align-items-center gap-2">
                <Calendar size={14} /> Placed on {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <div className="shopmate-order-status-badge-wrap">
              <span className={`shopmate-badge-ordad badge-${order.status || "pending"}-ordad fs-6 px-3 py-2`}>
                {(order.status || "PENDING").toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notification Banner */}
      {resolvedSearchParams?.error && (
        <div className="shopmate-inv-notice-ordad shopmate-inv-error-notice-ordad mb-4" role="alert">
          <span>{resolvedSearchParams.error}</span>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Ordered Products & Total Summary */}
        <div className="col-lg-8 col-12">
          <div className="shopmate-table-card-ordad mb-4">
            <div className="shopmate-table-header-ordad">
              <div>
                <h2 className="shopmate-table-title-ordad">Ordered Products</h2>
                <p className="shopmate-table-desc-ordad mb-0">
                  Items purchased in this specific order transaction.
                </p>
              </div>
              <span className="shopmate-table-badge-ordad">
                {order.order_items?.length || 0} items
              </span>
            </div>

            <div className="table-responsive">
              <table className="table shopmate-custom-table-ordad align-middle mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Product Name</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th className="text-end pe-4">Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items?.map((item) => (
                    <tr key={item.id}>
                      <td className="ps-4 fw-bold text-dark">
                        <div className="d-flex align-items-center gap-2">
                          <Package size={18} className="text-primary flex-shrink-0" />
                          <span>{item.product_name || "Product Item"}</span>
                        </div>
                      </td>
                      <td>PKR {Number(item.unit_price).toLocaleString()}</td>
                      <td>
                        <span className="badge bg-light text-dark border px-2 py-1">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="text-end pe-4 fw-bold text-dark">
                        PKR {(Number(item.unit_price) * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="shopmate-table-footer-ordad p-4 bg-light border-top d-flex justify-content-between align-items-center">
              <span className="fw-bold text-muted text-uppercase fs-7">Total Order Value</span>
              <span className="h4 fw-extrabold text-primary mb-0">
                PKR {Number(order.total_amount).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Status Manager & Customer Details */}
        <div className="col-lg-4 col-12">
          {/* Status Update Card */}
          <div className="shopmate-table-card-ordad mb-4">
            <div className="shopmate-table-header-ordad">
              <h2 className="shopmate-table-title-ordad fs-5">Fulfillment Status</h2>
            </div>
            <div className="p-4">
              <form action={updateOrderStatus}>
                <SavingOverlay title="Updating order status" text="Saving the new status. Please do not close this page." />
                <input type="hidden" name="order_id" value={order.id} />
                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-bold text-muted fs-7 text-uppercase">
                    Change Order Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={order.status}
                    className="form-select form-select-lg fs-6 fw-semibold shadow-none border-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="returned">Returned</option>
                  </select>
                </div>
               <SaveButton
                  label="Update Order Status"
                  pendingLabel="Updating..."
                  className="shopmate-submit-btn-contgrid w-100 py-3"
                />
              </form>
            </div>
          </div>

          {/* Customer & Shipping Info Card */}
          <div className="shopmate-table-card-ordad">
            <div className="shopmate-table-header-ordad">
              <h2 className="shopmate-table-title-ordad fs-5">Customer & Shipping Info</h2>
            </div>
            <div className="p-4 d-flex flex-column gap-3">
              <div className="d-flex align-items-start gap-3">
                <div className="shopmate-icon-box-contgrid flex-shrink-0" style={{ width: "38px", height: "38px", borderRadius: "10px" }}>
                  <User size={18} />
                </div>
                <div>
                  <span className="d-block text-muted fs-7 text-uppercase fw-bold">Customer Name</span>
                  <strong className="text-dark">{customer.fullName}</strong>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="shopmate-icon-box-contgrid icon-green-contgrid flex-shrink-0" style={{ width: "38px", height: "38px", borderRadius: "10px" }}>
                  <Mail size={18} />
                </div>
                <div>
                  <span className="d-block text-muted fs-7 text-uppercase fw-bold">Email Address</span>
                  <span className="text-dark fw-medium">{customer.email}</span>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3">
                <div className="shopmate-icon-box-contgrid icon-purple-contgrid flex-shrink-0" style={{ width: "38px", height: "38px", borderRadius: "10px" }}>
                  <Phone size={18} />
                </div>
                <div>
                  <span className="d-block text-muted fs-7 text-uppercase fw-bold">Phone Number</span>
                  <span className="text-dark fw-medium">{customer.phone}</span>
                </div>
              </div>

              <div className="d-flex align-items-start gap-3 pt-2 border-top">
                <div className="shopmate-icon-box-contgrid icon-amber-contgrid flex-shrink-0" style={{ width: "38px", height: "38px", borderRadius: "10px" }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <span className="d-block text-muted fs-7 text-uppercase fw-bold">Delivery Address</span>
                  <p className="text-dark mb-0 bg-light p-3 rounded-3 mt-1 small fw-medium leading-relaxed">
                    {customer.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}