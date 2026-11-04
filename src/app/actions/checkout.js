"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SHIPPING_FEE, FREE_SHIPPING_MIN } from "@/lib/constants";

const PHONE_RE = /^(?:\+92|0092|92|0)3\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function placeOrder(prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?error=${encodeURIComponent("Please log in to place an order.")}`);
  }

  const get = (key) => String(formData.get(key) || "").trim();

  const values = {
    full_name: get("full_name"),
    phone: get("phone"),
    email: get("email"),
    city: get("city"),
    address: get("address"),
    postal_code: get("postal_code"),
    notes: get("notes"),
    payment_method: get("payment_method") || "cod",
  };

  const errors = {};
  if (values.full_name.length < 3) errors.full_name = "Please enter your full name.";
  if (!PHONE_RE.test(values.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  }
  if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.city.length < 2) errors.city = "Please enter your city.";
  if (values.address.length < 10) errors.address = "Please enter your complete delivery address.";
  if (values.postal_code && !/^\d{4,6}$/.test(values.postal_code)) {
    errors.postal_code = "Postal code should be 4 to 6 digits.";
  }
  if (values.payment_method !== "cod") errors.payment_method = "Please choose a payment method.";
  if (values.notes.length > 500) errors.notes = "Notes can be up to 500 characters.";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Please fix the highlighted fields.", errors, values };
  }

  const { data: orderId, error } = await supabase.rpc("place_order", {
    p_address: {
      full_name: values.full_name,
      phone: values.phone.replace(/[\s-]/g, ""),
      email: values.email,
      city: values.city,
      address: values.address,
      postal_code: values.postal_code,
    },
    p_payment_method: values.payment_method,
    p_notes: values.notes,
    p_shipping_fee: SHIPPING_FEE,
    p_free_min: FREE_SHIPPING_MIN,
  });

  if (error) {
    return { success: false, message: error.message, errors: {}, values };
  }

  revalidatePath("/", "layout");
  redirect(`/order-success/${orderId}`);
}