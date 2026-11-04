import Link from "next/link";
import { ArrowRight, FolderTree } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categories | ShopMate" };

export default async function CategoriesPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug, description")
      .eq("is_active", true)
      .order("name", { ascending: true }),
    supabase.from("products").select("category_id").eq("is_active", true),
  ]);

  const counts = {};
  (products || []).forEach((p) => {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] || 0) + 1;
  });

  const list = categories || [];

  return (
    <>
      <section className="shopmate-hero-shopad">
        <div className="shopmate-wrap-homad shopmate-hero-inner-shopad">
          <h1>Shop by category</h1>
          <p>Browse our collections and find exactly what you are looking for.</p>
        </div>
      </section>

      <section className="shopmate-section-homad">
        <div className="shopmate-wrap-homad">
          {list.length === 0 ? (
            <div className="shopmate-empty-homad">
              <span>
                <FolderTree size={30} />
              </span>
              <strong>No categories yet</strong>
              <p>Categories will show up here soon.</p>
            </div>
          ) : (
            <div className="shopmate-cat-grid-homad">
              {list.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="shopmate-cat-card-homad"
                >
                  <span className="shopmate-cat-icon-homad">
                    <FolderTree size={22} />
                  </span>
                  <div>
                    <strong>{cat.name}</strong>
                    <small>
                      {counts[cat.id] || 0} {(counts[cat.id] || 0) === 1 ? "product" : "products"}
                    </small>
                  </div>
                  <ArrowRight size={17} className="shopmate-cat-arrow-homad" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}