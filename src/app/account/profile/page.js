import { redirect } from "next/navigation";
import { Sparkles, Mail, CalendarDays, Clock, ShieldCheck, UserRound, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/order-utils";
import ProfileAvatar from "@/components/account/ProfileAvatar";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/account/PasswordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Profile Settings | ShopMate" };

function initials(name) {
  return (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export default async function AccountProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, avatar_url, role")
    .eq("id", user.id)
    .maybeSingle();

  const name = profile?.full_name || user.email?.split("@")[0] || "Customer";
  const role = String(profile?.role || "customer").toUpperCase();

  return (
    <>
      <div className="shopmate-hello-accad">
        <span className="shopmate-eyebrow-prfad">
          <Sparkles size={13} /> ACCOUNT SETTINGS
        </span>
        <h1>Profile settings</h1>
        <p>Update your photo, personal details and password.</p>
      </div>

      <div className="shopmate-grid-prfad">
        {/* Identity card */}
        <aside className="shopmate-identity-prfad">
          <div className="shopmate-cover-prfad" />
          <div className="shopmate-id-body-prfad">
            <ProfileAvatar initials={initials(name)} avatarUrl={profile?.avatar_url || ""} />
            <h2>{name}</h2>
            <span className="shopmate-mail-prfad">{user.email}</span>
            <span className="shopmate-role-prfad">
              <ShieldCheck size={13} /> {role}
            </span>

            <ul className="shopmate-facts-prfad">
              <li>
                <span><Mail size={16} /></span>
                <div>
                  <small>Email</small>
                  <strong>{user.email}</strong>
                </div>
              </li>
              <li>
                <span><CalendarDays size={16} /></span>
                <div>
                  <small>Member since</small>
                  <strong>{formatDate(user.created_at)}</strong>
                </div>
              </li>
              <li>
                <span><Clock size={16} /></span>
                <div>
                  <small>Last sign in</small>
                  <strong>{formatDate(user.last_sign_in_at, true)}</strong>
                </div>
              </li>
            </ul>
          </div>
        </aside>

        {/* Forms */}
        <div className="shopmate-forms-prfad">
          <section className="shopmate-card-prfad">
            <header>
              <span className="tone-blue-prfad"><UserRound size={20} /></span>
              <div>
                <h2>Personal information</h2>
                <p>This name is used on your orders and deliveries.</p>
              </div>
            </header>
            <div className="shopmate-card-body-prfad">
              <ProfileForm
                defaultName={profile?.full_name || ""}
                defaultPhone={profile?.phone || ""}
                email={user.email || ""}
              />
            </div>
          </section>

          <section className="shopmate-card-prfad">
            <header>
              <span className="tone-amber-prfad"><KeyRound size={20} /></span>
              <div>
                <h2>Password and security</h2>
                <p>Use a strong password you do not use anywhere else.</p>
              </div>
            </header>
            <div className="shopmate-card-body-prfad">
              <PasswordForm />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}