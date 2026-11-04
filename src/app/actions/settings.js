"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";

export async function updateProfile(prevState, formData) {
  const { supabase } = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Your session has expired. Please log in again." };
  }

  const fullName = String(formData.get("full_name") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const values = { full_name: fullName, phone };

  if (fullName.length < 2) {
    return { success: false, message: "Full name must be at least 2 characters.", values };
  }

  if (phone && !/^[+\d][\d\s-]{6,19}$/.test(phone)) {
    return { success: false, message: "Please enter a valid phone number.", values };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName, phone: phone || null })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: `Unable to update profile: ${error.message}`, values };
  }

  revalidatePath("/admin/settings");
  return { success: true, message: "Profile updated successfully.", values };
}

export async function updatePassword(prevState, formData) {
  const { supabase } = await requireAdmin();

  const password = String(formData.get("new_password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }

  if (password !== confirm) {
    return { success: false, message: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Password changed successfully." };
}

export async function uploadAvatar(formData) {
  const { supabase } = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Your session has expired. Please log in again." };
  }

  const file = formData.get("avatar");

  if (!file || typeof file === "string" || file.size === 0) {
    return { success: false, message: "Please choose an image first." };
  }

  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Only image files are allowed." };
  }

  if (file.size > 2 * 1024 * 1024) {
    return { success: false, message: "Image must be smaller than 2MB." };
  }

  // Remove the previous avatar files of this user
  const { data: existing } = await supabase.storage.from("avatars").list(user.id);
  if (existing?.length) {
    await supabase.storage
      .from("avatars")
      .remove(existing.map((item) => `${user.id}/${item.name}`));
  }

  const path = `${user.id}/avatar-${Date.now()}.jpg`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, buffer, { contentType: "image/jpeg", cacheControl: "3600" });

  if (uploadError) {
    return { success: false, message: `Upload failed: ${uploadError.message}` };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return { success: false, message: `Unable to save photo: ${updateError.message}` };
  }

  revalidatePath("/admin", "layout");
  return { success: true, message: "Profile photo updated." };
}

export async function removeAvatar() {
  const { supabase } = await requireAdmin();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Your session has expired. Please log in again." };
  }

  const { data: existing } = await supabase.storage.from("avatars").list(user.id);
  if (existing?.length) {
    await supabase.storage
      .from("avatars")
      .remove(existing.map((item) => `${user.id}/${item.name}`));
  }

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: `Unable to remove photo: ${error.message}` };
  }

  revalidatePath("/admin", "layout");
  return { success: true, message: "Profile photo removed." };
}