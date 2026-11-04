"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function updateOrderStatus(formData) {
  const orderId = formData.get("order_id")?.toString();
  const status = formData.get("status")?.toString();

  if (!orderId || !status) {
    redirect("/admin/orders?error=" + encodeURIComponent("Invalid order details"));
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    redirect(`/admin/orders/${orderId}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  redirect(`/admin/orders/${orderId}?success=updated`);
}