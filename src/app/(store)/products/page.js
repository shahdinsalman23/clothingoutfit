import { createClient } from "@/lib/supabase/server";
import ShopHeroSection from "@/components/products/ShopHeroSection";
import ProductFilters, { SortSelect } from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";

export const dynamic = "force-dynamic";
export const metadata = { title: "Shop | ShopMate" };

const PAGE_SIZE = 12;

const SORTS = {
  newest: { column: "created_at", ascending: false },
  price_asc: { column: "price", ascending: true },
  price_desc: { column: "price", ascending: false },
  name: { column: "name", ascending: true },
};

const pick = (value) => (Array.isArray(value) ? value[0] : value) || "";

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;

  const q = pick(params?.q).trim().replace(/[%_,()]/g, " ").slice(0, 80);
  const categorySlug = pick(params?.category);
  const sort = SORTS[pick(params?.sort)] ? pick(params?.sort) : "newest";
  const min = pick(params?.min);
  const max = pick(params?.max);
  const instock = pick(params?.instock) === "1";
  const page = Math.max(1, parseInt(pick(params?.page), 10) || 1);

  const supabase = await createClient();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const categories = categoriesData || [];
  const activeCategory = categories.find((c) => c.slug === categorySlug) || null;

  let products = [];
  let total = 0;

  // Agar category slug galat ho to khali result dikhao
  if (!categorySlug || activeCategory) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("products")
      .select(
        "id, name, slug, price, stock, is_featured, product_images (image_url, sort_order)",
        { count: "exact" }
      )
      .eq("is_active", true);

    if (q) query = query.ilike("name", `%${q}%`);
    if (activeCategory) query = query.eq("category_id", activeCategory.id);
    if (min !== "" && !Number.isNaN(Number(min))) query = query.gte("price", Number(min));
    if (max !== "" && !Number.isNaN(Number(max))) query = query.lte("price", Number(max));
    if (instock) query = query.gt("stock", 0);

    const { column, ascending } = SORTS[sort];
    query = query.order(column, { ascending }).range(from, to);

    const { data, count, error } = await query;
    if (error) throw new Error(`Unable to load products: ${error.message}`);

    total = count || 0;
    products = (data || []).map((product) => {
      const images = [...(product.product_images || [])].sort(
        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
      );
      return { ...product, imageUrl: images[0]?.image_url || "" };
    });
  }

  const current = { q, category: categorySlug, sort, min, max, instock: instock ? "1" : "" };
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const lastItem = Math.min(page * PAGE_SIZE, total);

  return (
    <>
      <ShopHeroSection total={total} q={q} categoryName={activeCategory?.name} />

      <section className="shopmate-shop-shopad">
        <div className="shopmate-wrap-homad">
          <div className="shopmate-layout-shopad">
            <ProductFilters categories={categories} current={current} />

            <div className="shopmate-results-shopad">
              <div className="shopmate-toolbar-shopad">
                <p>
                  {total === 0
                    ? "No products found"
                    : `Showing ${firstItem}-${lastItem} of ${total} products`}
                </p>
                <SortSelect current={current} />
              </div>

              <ProductGrid
                products={products}
                total={total}
                page={page}
                pageSize={PAGE_SIZE}
                current={current}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}