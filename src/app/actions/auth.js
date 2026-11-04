"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function login(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    redirect("/login?error=Please%20enter%20email%20and%20password");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function signup(formData) {
  const fullName = formData.get("full_name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!fullName || !email || !password) {
    redirect("/signup?error=Please%20fill%20in%20all%20fields");
  }

  if (password.length < 8) {
    redirect("/signup?error=Password%20must%20be%20at%20least%208%20characters");
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!origin) {
    redirect("/signup?error=Unable%20to%20determine%20the%20website%20URL");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/confirm?next=/login`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/verify-email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData) {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    redirect("/forgot-password?error=Please%20enter%20your%20email");
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!origin) {
    redirect("/forgot-password?error=Unable%20to%20determine%20the%20website%20URL");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?message=reset-email-sent");
}

export async function updatePassword(formData) {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!password || password.length < 8) {
    redirect("/reset-password?error=Password%20must%20be%20at%20least%208%20characters");
  }

  if (password !== confirmPassword) {
    redirect("/reset-password?error=Passwords%20do%20not%20match");
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/forgot-password?error=Reset%20session%20expired.%20Request%20a%20new%20link");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  await supabase.auth.signOut();

  redirect("/login?message=password-updated");
}