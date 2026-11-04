import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, ShoppingBag, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { SHIPPING_FEE, FREE_SHIPPING_MIN } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your Cart | ShopMate" };



export default async function CartPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Please log in to view your cart.")}`);
  }

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `id, quantity, product_id,
       products (id, name, slug, price, stock, is_active, product_images (image_url, sort_order))`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Unable to load cart: ${error.message}`);

  const items = (data || [])
    .filter((row) => row.products)
    .map((row) => {
      const product = row.products;
      const images = [...(product.product_images || [])].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      );
      const stock = Number(product.stock || 0);
      const available = product.is_active && stock > 0;
      const quantity = available ? Math.min(row.quantity, stock) : row.quantity;

      return {
        id: row.id,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        stock,
        quantity,
        available,
        capped: available && row.quantity > stock,
        imageUrl: images[0]?.image_url || "",
      };
    });

  const payable = items.filter((item) => item.available);
  const subtotal = payable.reduce((total, item) => total + item.price * item.quantity, 0);
  const itemCount = payable.reduce((total, item) => total + item.quantity, 0);
  const shipping = payable.length === 0 || subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <section className="shopmate-cart-cartad">
      <div className="shopmate-wrap-homad">
        <nav className="shopmate-crumbs-shopad plain-shopad" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span>Cart</span>
        </nav>

        <div className="shopmate-head-cartad">
          <h1>Shopping cart</h1>
          {items.length > 0 && (
            <span>
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="shopmate-empty-cartad">
            <span>
              <ShoppingBag size={34} />
            </span>
            <h2>Your cart is empty</h2>
            <p>Looks like you have not added anything yet. Explore the shop and find something you love.</p>
            <Link href="/products" className="shopmate-btn-primary-shdad large-shdad">
              Start shopping <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="shopmate-layout-cartad">
            <div className="shopmate-list-cartad">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              <Link href="/products" className="shopmate-continue-cartad">
                Continue shopping
              </Link>
            </div>

            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              itemCount={itemCount}
              freeMin={FREE_SHIPPING_MIN}
              canCheckout={payable.length > 0}
            />
          </div>
        )}
      </div>
    </section>
  );
}