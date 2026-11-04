export const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

export const shortId = (id) => String(id || "").slice(0, 8).toUpperCase();

export function formatDate(value, withTime = false) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

// shipping_address text ho ya jsonb, dono se object nikalta hai
export function parseAddress(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : { address: String(value) };
  } catch {
    return { address: String(value) };
  }
}

export const FILTERS = {
  all: null,
  active: ["pending", "confirmed", "processing", "shipped"],
  delivered: ["delivered"],
  cancelled: ["cancelled", "returned"],
};

export const STEPS = [
  { key: "pending", label: "Order placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

// product_id se image aur slug ka map banata hai
export async function loadProductMap(supabase, productIds) {
  const ids = [...new Set((productIds || []).filter(Boolean))];
  if (ids.length === 0) return {};

  const { data } = await supabase
    .from("products")
    .select("id, slug, product_images (image_url, sort_order)")
    .in("id", ids);

  const map = {};
  (data || []).forEach((product) => {
    const images = [...(product.product_images || [])].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
    map[product.id] = { imageUrl: images[0]?.image_url || "", slug: product.slug };
  });
  return map;
}