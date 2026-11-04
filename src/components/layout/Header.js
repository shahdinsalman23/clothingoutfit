import { createClient } from "@/lib/supabase/server";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  let cartCount = 0;

  if (user) {
    const [{ data }, { data: cartRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, role, avatar_url")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("cart_items").select("quantity").eq("user_id", user.id),
    ]);
    profile = data;
    cartCount = (cartRows || []).reduce((total, row) => total + row.quantity, 0);
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .limit(8);

  const viewer = user
    ? {
        name: profile?.full_name || user.email?.split("@")[0] || "Account",
        email: user.email || "",
        avatarUrl: profile?.avatar_url || "",
        isAdmin: profile?.role === "admin",
      }
    : null;

  return <HeaderClient viewer={viewer} categories={categories || []} cartCount={cartCount} />;
}