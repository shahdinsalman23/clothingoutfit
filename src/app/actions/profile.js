"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

const EXPIRED = { success: false, message: "Your session has expired. Please log in again." };

export async function updateProfile(prevState, formData) {
  const { supabase, user } = await getUser();
  if (!user) return EXPIRED;

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
    .update({
      full_name: fullName,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { success: false, message: `Unable to update profile: ${error.message}`, values };
  }

  revalidatePath("/", "layout");
  return { success: true, message: "Profile updated successfully.", values };
}

export async function updatePassword(prevState, formData) {
  const { supabase, user } = await getUser();
  if (!user) return EXPIRED;

  const password = String(formData.get("new_password") || "");
  const confirm = String(formData.get("confirm_password") || "");

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters long." };
  }
  if (password !== confirm) {
    return { success: false, message: "Passwords do not match." };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { success: false, message: error.message };

  return { success: true, message: "Password changed successfully." };
}

async function clearAvatarFiles(supabase, userId) {
  const { data: existing } = await supabase.storage.from("avatars").list(userId);
  if (existing?.length) {
    await supabase.storage
      .from("avatars")
      .remove(existing.map((item) => `${userId}/${item.name}`));
  }
}

export async function uploadAvatar(formData) {
  const { supabase, user } = await getUser();
  if (!user) return EXPIRED;

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

  await clearAvatarFiles(supabase, user.id);

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

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { success: false, message: `Unable to save photo: ${error.message}` };

  revalidatePath("/", "layout");
  return { success: true, message: "Profile photo updated." };
}

export async function removeAvatar() {
  const { supabase, user } = await getUser();
  if (!user) return EXPIRED;

  await clearAvatarFiles(supabase, user.id);

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { success: false, message: `Unable to remove photo: ${error.message}` };

  revalidatePath("/", "layout");
  return { success: true, message: "Profile photo removed." };
}