import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const raw = new URL(request.url).searchParams.get("q") || "";
  const q = raw.replace(/[%_,()\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("id, name, slug, price, stock, category_id, product_images (image_url, sort_order)", {
      count: "exact",
    })
    .eq("is_active", true);

  if (q) {
    query = query.ilike("name", `%${q}%`).order("name", { ascending: true }).limit(12);
  } else {
    query = query
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(4);
  }

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }

  let rows = data || [];

  // Jin ke naam us text se shuru hote hain wo pehle
  if (q) {
    const lower = q.toLowerCase();
    rows = [...rows]
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(lower) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(lower) ? 0 : 1;
        return aStarts - bStarts;
      })
      .slice(0, 6);
  }

  const categoryIds = [...new Set(rows.map((r) => r.category_id).filter(Boolean))];
  const categoryMap = {};
  if (categoryIds.length) {
    const { data: cats } = await supabase.from("categories").select("id, name").in("id", categoryIds);
    (cats || []).forEach((c) => (categoryMap[c.id] = c.name));
  }

  const results = rows.map((product) => {
    const images = [...(product.product_images || [])].sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      stock: Number(product.stock || 0),
      category: categoryMap[product.category_id] || "",
      imageUrl: images[0]?.image_url || "",
    };
  });

  return NextResponse.json(
    { results, total: q ? count || results.length : results.length },
    { headers: { "Cache-Control": "no-store" } }
  );
}