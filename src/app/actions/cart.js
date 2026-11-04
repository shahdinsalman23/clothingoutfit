"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addToCart(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Please log in to add items to your cart.")}`);
  }

  const productId = String(formData.get("product_id") || "");
  const intent = String(formData.get("intent") || "add");
  const quantity = Math.floor(Number(formData.get("quantity")));

  if (!productId || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
    return { success: false, message: "Please choose a valid quantity.", ts: Date.now() };
  }

  const { data: product } = await supabase
    .from("products")
    .select("id, name, stock, is_active")
    .eq("id", productId)
    .maybeSingle();

  if (!product || !product.is_active) {
    return { success: false, message: "This product is no longer available.", ts: Date.now() };
  }

  const stock = Number(product.stock || 0);
  if (stock <= 0) {
    return { success: false, message: "Sorry, this product is out of stock.", ts: Date.now() };
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("quantity")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  const current = existing?.quantity || 0;

  if (current >= stock) {
    return {
      success: false,
      message: "You already have the maximum available quantity in your cart.",
      ts: Date.now(),
    };
  }

  const newQuantity = Math.min(current + quantity, stock);

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: user.id,
      product_id: productId,
      quantity: newQuantity,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,product_id" }
  );

  if (error) {
    return { success: false, message: `Could not update cart: ${error.message}`, ts: Date.now() };
  }

  revalidatePath("/", "layout");

  if (intent === "buy") redirect("/cart");

  return {
    success: true,
    message:
      current + quantity > stock
        ? `Added. Only ${stock} units are available, so your cart is capped at ${stock}.`
        : `${product.name} added to your cart.`,
    ts: Date.now(),
  };
}

// Neeche ke 2 functions cart page banate waqt use honge
export async function updateCartQuantity(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const productId = String(formData.get("product_id") || "");
  const quantity = Math.floor(Number(formData.get("quantity")));
  if (!productId || !Number.isFinite(quantity)) return;

  if (quantity < 1) {
    await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
  } else {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .maybeSingle();
    const capped = Math.min(quantity, Number(product?.stock || 0));
    if (capped >= 1) {
      await supabase
        .from("cart_items")
        .update({ quantity: capped, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("product_id", productId);
    }
  }

  revalidatePath("/", "layout");
}

export async function removeFromCart(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const productId = String(formData.get("product_id") || "");
  if (!productId) return;

  await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
  revalidatePath("/", "layout");
}