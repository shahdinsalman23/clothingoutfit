"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function createCategory(formData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const isActive = formData.get("is_active") === "on";

  if (!name || !slugify(name)) {
    redirect("/admin/categories/new?error=" + encodeURIComponent("Category name is required"));
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description,
    is_active: isActive,
  });

  if (error) {
    redirect("/admin/categories/new?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories?success=created");
}

export async function updateCategory(formData) {
  const categoryId = formData.get("category_id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const isActive = formData.get("is_active") === "on";

  if (!categoryId || !name || !slugify(name)) {
    redirect(`/admin/categories?error=` + encodeURIComponent("Invalid category details"));
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      description,
      is_active: isActive,
    })
    .eq("id", categoryId);

  if (error) {
    redirect(`/admin/categories?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories?success=updated");
}

export async function deleteCategory(formData) {
  const categoryId = formData.get("category_id")?.toString();

  if (!categoryId) {
    redirect("/admin/categories?error=" + encodeURIComponent("Invalid category"));
  }

  const { supabase } = await requireAdmin();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    redirect("/admin/categories?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/admin/categories");
  revalidatePath("/");
  redirect("/admin/categories?success=deleted");
}