import { requireAdmin } from "@/lib/admin";
import {
  Mail,
  CalendarDays,
  Clock,
  Fingerprint,
  ShieldCheck,
  UserRound,
  KeyRound,
} from "lucide-react";
import ProfileForm from "./ProfileForm";
import PasswordForm from "./PasswordForm";
import AvatarUploader from "./AvatarUploader";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function formatDate(value, withTime = false) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .maybeSingle();

  const name =
    profile?.full_name || profile?.name || profile?.username || "Admin User";
  const email = user?.email || profile?.email || "";
  const phone = profile?.phone || "";
  const role = profile?.role || "admin";

  return (
    <div className="shopmate-inv-wrapper-setad container-fluid px-0">

      {/* Top Header Row */}
      <div className="row align-items-center justify-content-between g-3 mb-4">
        <div className="col-12">
          <span className="shopmate-inv-eyebrow-setad">ACCOUNT SETTINGS</span>
          <h1 className="shopmate-inv-title-setad">Settings</h1>
          <p className="shopmate-inv-subtitle-setad mb-0">
            Manage your personal information, security and account details.
          </p>
        </div>
      </div>

      <div className="row g-4">

        {/* Left: Profile Summary */}
        <div className="col-12 col-xl-4">
          <div className="shopmate-profile-card-setad">
            <div className="shopmate-profile-cover-setad" />

            <div className="shopmate-profile-body-setad">
              <AvatarUploader initials={getInitials(name)} avatarUrl={profile?.avatar_url || ""} />
              <h2 className="shopmate-profile-name-setad">{name}</h2>
              <span className="shopmate-profile-email-setad">{email}</span>

              <span className="shopmate-role-badge-setad">
                <ShieldCheck size={13} />
                {String(role).toUpperCase()}
              </span>

              <ul className="shopmate-info-list-setad">
                <li>
                  <div className="shopmate-info-icon-setad">
                    <Mail size={16} />
                  </div>
                  <div>
                    <small>Email address</small>
                    <strong>{email || "Not set"}</strong>
                  </div>
                </li>
                <li>
                  <div className="shopmate-info-icon-setad">
                    <CalendarDays size={16} />
                  </div>
                  <div>
                    <small>Member since</small>
                    <strong>{formatDate(user?.created_at)}</strong>
                  </div>
                </li>
                <li>
                  <div className="shopmate-info-icon-setad">
                    <Clock size={16} />
                  </div>
                  <div>
                    <small>Last sign in</small>
                    <strong>{formatDate(user?.last_sign_in_at, true)}</strong>
                  </div>
                </li>
                <li>
                  <div className="shopmate-info-icon-setad">
                    <Fingerprint size={16} />
                  </div>
                  <div>
                    <small>Account ID</small>
                    <strong className="font-monospace">
                      #{String(user?.id || "").slice(0, 8)}
                    </strong>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="col-12 col-xl-8">

          <div className="shopmate-card-setad mb-4">
            <div className="shopmate-card-header-setad">
              <div className="shopmate-card-icon-setad shopmate-icon-primary-setad">
                <UserRound size={20} />
              </div>
              <div>
                <h2 className="shopmate-card-title-setad">Profile Information</h2>
                <p className="shopmate-card-desc-setad mb-0">
                  Update your name and contact number.
                </p>
              </div>
            </div>
            <div className="shopmate-card-body-setad">
              <ProfileForm defaultName={name} defaultPhone={phone} email={email} />
            </div>
          </div>

          <div className="shopmate-card-setad">
            <div className="shopmate-card-header-setad">
              <div className="shopmate-card-icon-setad shopmate-icon-warning-setad">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="shopmate-card-title-setad">Security</h2>
                <p className="shopmate-card-desc-setad mb-0">
                  Choose a strong password to keep your admin account safe.
                </p>
              </div>
            </div>
            <div className="shopmate-card-body-setad">
              <PasswordForm />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}