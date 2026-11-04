"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

// Slugify helper function
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// 1. CREATE PRODUCT ACTION
export async function createProduct(formData) {
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price"));
  const compareAtValue = formData.get("compare_at_price");
  const compareAtPrice =
    compareAtValue !== "" && compareAtValue != null
      ? Number(compareAtValue)
      : null;
  const stock = Number(formData.get("stock"));
  const categoryValue = formData.get("category_id")?.toString() || "";
  const categoryId = categoryValue || null;
  const isFeatured = formData.get("is_featured") === "on";
  const isActive = formData.get("is_active") === "on";
  const image = formData.get("image");

  if (
    !name ||
    !slugify(name) ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    (compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < 0)) ||
    !(image instanceof File) ||
    image.size === 0
  ) {
    redirect(
      `/admin/products/new?error=${encodeURIComponent("Please check the product details and upload an image")}`
    );
  }

  if (
    !["image/jpeg", "image/png", "image/webp"].includes(image.type) ||
    image.size > 5 * 1024 * 1024
  ) {
    redirect(
      `/admin/products/new?error=${encodeURIComponent("Use a JPG, PNG or WebP image under 5MB")}`
    );
  }

  const { user, supabase } = await requireAdmin();

  const extension =
    image.type === "image/jpeg"
      ? "jpg"
      : image.type === "image/png"
        ? "png"
        : "webp";

  const storagePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(storagePath, image, {
      contentType: image.type,
      upsert: false,
    });

  if (uploadError) {
    redirect(
      `/admin/products/new?error=${encodeURIComponent(uploadError.message)}`
    );
  }

  const publicUrl = supabase.storage
    .from("product-images")
    .getPublicUrl(storagePath).data.publicUrl;

  const { data: newProduct, error: insertError } = await supabase
    .from("products")
    .insert({
      name,
      slug: slugify(name),
      description,
      price,
      compare_at_price: compareAtPrice,
      stock,
      category_id: categoryId,
      is_featured: isFeatured,
      is_active: isActive,
    })
    .select("id")
    .single();

  if (insertError) {
    await supabase.storage.from("product-images").remove([storagePath]);
    redirect(
      `/admin/products/new?error=${encodeURIComponent(insertError.message)}`
    );
  }

  const { error: imageError } = await supabase
    .from("product_images")
    .insert({
      product_id: newProduct.id,
      image_url: publicUrl,
      storage_path: storagePath,
      alt_text: name,
      sort_order: 0,
    });

  if (imageError) {
    await supabase.storage.from("product-images").remove([storagePath]);
    await supabase.from("products").delete().eq("id", newProduct.id);
    redirect(
      `/admin/products/new?error=${encodeURIComponent(imageError.message)}`
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products?success=created");
}

// 2. UPDATE PRODUCT ACTION
export async function updateProduct(formData) {
  const productId = formData.get("product_id")?.toString();
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const price = Number(formData.get("price"));
  const compareAtValue = formData.get("compare_at_price");
  const compareAtPrice =
    compareAtValue !== "" && compareAtValue != null
      ? Number(compareAtValue)
      : null;
  const stock = Number(formData.get("stock"));
  const categoryValue = formData.get("category_id")?.toString() || "";
  const categoryId = categoryValue || null;
  const isFeatured = formData.get("is_featured") === "on";
  const isActive = formData.get("is_active") === "on";
  const image = formData.get("image");

  if (
    !productId ||
    !name ||
    !slugify(name) ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock) ||
    stock < 0 ||
    (compareAtPrice !== null &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < 0))
  ) {
    redirect(
      `/admin/products/${encodeURIComponent(productId || "")}/edit?error=${encodeURIComponent("Please check the product details")}`
    );
  }

  const hasNewImage = image instanceof File && image.size > 0;

  if (
    hasNewImage &&
    (!["image/jpeg", "image/png", "image/webp"].includes(image.type) ||
      image.size > 5 * 1024 * 1024)
  ) {
    redirect(
      `/admin/products/${encodeURIComponent(productId)}/edit?error=${encodeURIComponent("Use a JPG, PNG or WebP image under 5MB")}`
    );
  }

  const { user, supabase } = await requireAdmin();

  const { data: existingProduct, error: existingError } = await supabase
    .from("products")
    .select("id, slug")
    .eq("id", productId)
    .single();

  if (existingError || !existingProduct) {
    redirect("/admin/products?error=Product%20not%20found");
  }

  const { data: oldImage } = await supabase
    .from("product_images")
    .select("id, storage_path")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  let newStoragePath = null;
  let newPublicUrl = null;

  if (hasNewImage) {
    const extension =
      image.type === "image/jpeg"
        ? "jpg"
        : image.type === "image/png"
          ? "png"
          : "webp";

    newStoragePath = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(newStoragePath, image, {
        contentType: image.type,
        upsert: false,
      });

    if (uploadError) {
      redirect(
        `/admin/products/${encodeURIComponent(productId)}/edit?error=${encodeURIComponent(uploadError.message)}`
      );
    }

    newPublicUrl = supabase.storage
      .from("product-images")
      .getPublicUrl(newStoragePath).data.publicUrl;
  }

  const { error: updateError } = await supabase
    .from("products")
    .update({
      name,
      slug: slugify(name),
      description,
      price,
      compare_at_price: compareAtPrice,
      stock,
      category_id: categoryId,
      is_featured: isFeatured,
      is_active: isActive,
    })
    .eq("id", productId);

  if (updateError) {
    if (newStoragePath) {
      await supabase.storage.from("product-images").remove([newStoragePath]);
    }

    redirect(
      `/admin/products/${encodeURIComponent(productId)}/edit?error=${encodeURIComponent(updateError.message)}`
    );
  }

  if (hasNewImage) {
    let imageError;

    if (oldImage) {
      const result = await supabase
        .from("product_images")
        .update({
          image_url: newPublicUrl,
          storage_path: newStoragePath,
          alt_text: name,
          sort_order: 0,
        })
        .eq("id", oldImage.id);

      imageError = result.error;
    } else {
      const result = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          image_url: newPublicUrl,
          storage_path: newStoragePath,
          alt_text: name,
          sort_order: 0,
        });

      imageError = result.error;
    }

    if (imageError) {
      await supabase.storage.from("product-images").remove([newStoragePath]);

      redirect(
        `/admin/products/${encodeURIComponent(productId)}/edit?error=${encodeURIComponent(imageError.message)}`
      );
    }

    if (oldImage?.storage_path) {
      await supabase.storage
        .from("product-images")
        .remove([oldImage.storage_path]);
    }
  } else if (oldImage) {
    await supabase
      .from("product_images")
      .update({ alt_text: name })
      .eq("id", oldImage.id);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/");
  redirect("/admin/products?success=updated");
}

// 3. DELETE PRODUCT ACTION
export async function deleteProduct(formData) {
  const productId = formData.get("product_id")?.toString();

  if (!productId) {
    redirect("/admin/products?error=Invalid%20product");
  }

  const { supabase } = await requireAdmin();

  const { data: images, error: imageQueryError } = await supabase
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  if (imageQueryError) {
    redirect(
      `/admin/products?error=${encodeURIComponent(imageQueryError.message)}`
    );
  }

  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (deleteError) {
    redirect(
      `/admin/products?error=${encodeURIComponent(deleteError.message)}`
    );
  }

  const paths = (images || [])
    .map((item) => item.storage_path)
    .filter(Boolean);

  if (paths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove(paths);

    if (storageError) {
      console.error("Product deleted, but some images remain:", storageError.message);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products?success=deleted");
}