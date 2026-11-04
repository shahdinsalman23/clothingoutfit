import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SHIPPING_FEE, FREE_SHIPPING_MIN } from "@/lib/constants";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout | ShopMate" };

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Please log in to continue to checkout.")}`);
  }

  const [cartRes, profileRes] = await Promise.all([
    supabase
      .from("cart_items")
      .select(
        `id, quantity,
         products (id, name, slug, price, stock, is_active, product_images (image_url, sort_order))`
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
  ]);

  if (cartRes.error) throw new Error(`Unable to load checkout: ${cartRes.error.message}`);

  const items = (cartRes.data || [])
    .filter((row) => row.products && row.products.is_active && Number(row.products.stock) > 0)
    .map((row) => {
      const product = row.products;
      const images = [...(product.product_images || [])].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      );
      return {
        id: row.id,
        name: product.name,
        price: Number(product.price),
        quantity: Math.min(row.quantity, Number(product.stock)),
        imageUrl: images[0]?.image_url || "",
      };
    });

  if (items.length === 0) redirect("/cart");

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;

  return (
    <section className="shopmate-chk-chkad">
      <div className="shopmate-wrap-homad">
        <nav className="shopmate-crumbs-shopad plain-shopad" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/cart">Cart</Link>
          <ChevronRight size={14} />
          <span>Checkout</span>
        </nav>

        <ol className="shopmate-steps-chkad" aria-label="Checkout progress">
          <li className="done-chkad"><span>1</span> Cart</li>
          <li className="current-chkad"><span>2</span> Checkout</li>
          <li><span>3</span> Confirmation</li>
        </ol>

        <h1 className="shopmate-title-chkad">Secure checkout</h1>

        <CheckoutForm
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          freeMin={FREE_SHIPPING_MIN}
          defaults={{
            full_name: profileRes.data?.full_name || "",
            phone: profileRes.data?.phone || "",
            email: user.email || "",
          }}
        />
      </div>
    </section>
  );
}