import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AccountNav from "@/components/account/AccountNav";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const viewer = {
    name: profile?.full_name || user.email?.split("@")[0] || "Account",
    email: user.email || "",
    avatarUrl: profile?.avatar_url || "",
    isAdmin: profile?.role === "admin",
  };

  return (
    <div className="shopmate-shell-shdad">
      <Header />
      <main className="shopmate-main-shdad">
        <section className="shopmate-acc-accad">
          <div className="shopmate-wrap-homad">
            <div className="shopmate-grid-accad">
              <AccountNav viewer={viewer} />
              <div className="shopmate-content-accad">{children}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}