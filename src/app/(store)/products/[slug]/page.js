import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  Flame,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import AddToCartPanel from "@/components/products/AddToCartPanel";

export const dynamic = "force-dynamic";

const byOrder = (a, b) => (a.sort_order || 0) - (b.sort_order || 0);

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("name").eq("slug", slug).maybeSingle();
  return { title: data ? `${data.name} | ShopMate` : "Product | ShopMate" };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, product_images (image_url, alt_text, sort_order)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) notFound();

  const images = [...(product.product_images || [])]
    .sort(byOrder)
    .map((img) => ({ url: img.image_url, alt: img.alt_text }));

  const [
    {
      data: { user },
    },
    categoryRes,
    othersRes,
  ] = await Promise.all([
    supabase.auth.getUser(),
    product.category_id
      ? supabase.from("categories").select("name, slug").eq("id", product.category_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("products")
      .select("id, name, slug, price, stock, is_featured, category_id, product_images (image_url, sort_order)")
      .eq("is_active", true)
      .neq("id", product.id)
      .order("created_at", { ascending: false })
      .limit(16),
  ]);

  const category = categoryRes.data;

  // Same category pehle, phir baaqi products se 4 tak fill
  const others = othersRes.data || [];
  const sameCategory = others.filter((p) => product.category_id && p.category_id === product.category_id);
  const rest = others.filter((p) => !sameCategory.includes(p));
  const related = [...sameCategory, ...rest].slice(0, 4).map((item) => {
    const imgs = [...(item.product_images || [])].sort(byOrder);
    return { ...item, imageUrl: imgs[0]?.image_url || "" };
  });

  let inCartQty = 0;
  if (user) {
    const { data: cartRow } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();
    inCartQty = cartRow?.quantity || 0;
  }

  const stock = Number(product.stock || 0);
  const stockLabel =
    stock <= 0 ? "Out of stock" : stock < 10 ? `Only ${stock} left in stock` : "In stock";

  return (
    <>
      <section className="shopmate-pdp-pdpad">
        <div className="shopmate-wrap-homad">
          <nav className="shopmate-crumbs-shopad plain-shopad" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products">Shop</Link>
            {category && (
              <>
                <ChevronRight size={14} />
                <Link href={`/products?category=${category.slug}`}>{category.name}</Link>
              </>
            )}
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>

          <div className="shopmate-pdp-grid-pdpad">
            <ProductGallery images={images} name={product.name} />

            <div className="shopmate-info-pdpad sticky-pdpad">
              <div className="shopmate-tags-pdpad">
                {category && (
                  <Link href={`/products?category=${category.slug}`} className="chip-pdpad">
                    {category.name}
                  </Link>
                )}
                {product.is_featured && <span className="chip-pdpad gold-pdpad">Featured</span>}
              </div>

              <h1>{product.name}</h1>

              <div className="shopmate-pricebox-pdpad">
                <div className="price-pdpad">Rs. {Number(product.price).toLocaleString("en-PK")}</div>
                <div className={`stock-pdpad ${stock > 0 ? "in-pdpad" : "out-pdpad"}`}>
                  {stock > 0 ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {stockLabel}
                </div>
              </div>

              {stock > 0 && stock < 10 && (
                <p className="shopmate-urgent-pdpad">
                  <Flame size={15} /> Selling fast, order soon
                </p>
              )}

              {product.description && (
                <p className="desc-pdpad short-pdpad">{product.description}</p>
              )}

              <AddToCartPanel
                productId={product.id}
                stock={stock}
                price={product.price}
                inCartQty={inCartQty}
              />

              <ul className="shopmate-perks-pdpad">
                <li>
                  <span>
                    <ShieldCheck size={19} />
                  </span>
                  <div>
                    <strong>Secure checkout</strong>
                    <small>Protected payments</small>
                  </div>
                </li>
                <li>
                  <span>
                    <Truck size={19} />
                  </span>
                  <div>
                    <strong>Fast delivery</strong>
                    <small>Quick dispatch</small>
                  </div>
                </li>
                <li>
                  <span>
                    <BadgeCheck size={19} />
                  </span>
                  <div>
                    <strong>Quality checked</strong>
                    <small>Reviewed listing</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Details */}
          <div className="shopmate-details-pdpad">
            <div className="shopmate-detail-card-pdpad">
              <h2>About this product</h2>
              <p>{product.description || "No description has been added for this product yet."}</p>
            </div>

            <div className="shopmate-detail-card-pdpad">
              <h2>Product details</h2>
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd>{category?.name || "General"}</dd>
                </div>
                <div>
                  <dt>Availability</dt>
                  <dd>{stockLabel}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>Rs. {Number(product.price).toLocaleString("en-PK")}</dd>
                </div>
                <div>
                  <dt>Product code</dt>
                  <dd className="font-monospace">#{String(product.id).slice(0, 8)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="shopmate-section-homad alt-homad shopmate-related-pdpad">
          <div className="shopmate-wrap-homad">
            <div className="shopmate-section-head-homad">
              <div>
                <span className="shopmate-eyebrow-homad">YOU MAY ALSO LIKE</span>
                <h2>Related products</h2>
              </div>
              <Link href="/products" className="shopmate-more-homad">
                Shop all
              </Link>
            </div>
            <div className="shopmate-prod-grid-homad">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}