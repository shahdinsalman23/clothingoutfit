import { createClient } from "@/lib/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import BenefitsSection from "@/components/home/BenefitsSection";
import PromoBannerSection from "@/components/home/PromoBannerSection";
import TabbedProductsSection from "@/components/home/TabbedProductsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const [
    {
      data: { user },
    },
    categoriesRes,
    productsRes,
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("categories")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .order("name", { ascending: true })
      .limit(6),
    supabase
      .from("products")
      .select("id, name, slug, price, stock, is_featured, product_images (image_url, sort_order)")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const products = (productsRes.data || []).map((product) => {
    const images = [...(product.product_images || [])].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
    return { ...product, imageUrl: images[0]?.image_url || "" };
  });

  return (
    <>
      <HeroSection isLoggedIn={Boolean(user)} product={products[0] || null} />
      <CategoriesSection categories={categoriesRes.data || []} />
      <FeaturedProducts products={products} />
      <PromoBannerSection />
      <TabbedProductsSection products={products} />
      <TestimonialsSection/>
      {/* <BenefitsSection /> */}
    </>
  );
}