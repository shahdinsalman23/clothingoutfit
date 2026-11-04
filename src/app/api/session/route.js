import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const headers = { "Cache-Control": "no-store" };

  if (!user) return NextResponse.json({ user: null }, { headers });

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json(
    { user: { name: profile?.full_name || user.email?.split("@")[0] || "there" } },
    { headers }
  );
}