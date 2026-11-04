import Link from "next/link";
import { updatePassword } from "@/app/actions/auth";
import { ResetPasswordFields, ResetSubmitButton } from "../auth/ResetControls";

export const metadata = {
  title: "Set New Password | ShopMate",
};

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="shopmate-page-reset">
      <div className="shopmate-blob-reset blob-a-reset" />
      <div className="shopmate-blob-reset blob-b-reset" />

      <div className="container">
        <div className="row shopmate-row-reset">
          {/* Left: brand panel */}
          <div className="col-lg-6 shopmate-side-col-reset">
            <div className="shopmate-brand-panel-reset">
              <span className="shopmate-pill-reset">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Account security
              </span>

              <h2 className="shopmate-brand-title-reset">
                Choose a new password you can <span>trust</span>
              </h2>

              <p className="shopmate-brand-text-reset">
                Almost done. Set a strong password and you will be back to
                shopping in no time.
              </p>

              <ul className="shopmate-points-reset">
                <li>
                  <span className="shopmate-point-icon-reset">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 7V4h16v3" />
                      <path d="M9 20h6" />
                      <path d="M12 4v16" />
                    </svg>
                  </span>
                  <div>
                    <strong>Use at least 8 characters</strong>
                    <small>Longer passwords are harder to guess.</small>
                  </div>
                </li>
                <li>
                  <span className="shopmate-point-icon-reset">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 3l1.9 5.8H20l-4.9 3.6 1.9 5.8-5-3.6-5 3.6 1.9-5.8L4 8.8h6.1z" />
                    </svg>
                  </span>
                  <div>
                    <strong>Mix it up</strong>
                    <small>Combine upper and lower case, numbers and symbols.</small>
                  </div>
                </li>
                <li>
                  <span className="shopmate-point-icon-reset">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <div>
                    <strong>Keep it unique</strong>
                    <small>Do not reuse passwords from other websites.</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <div className="col-12 col-md-10 col-lg-6 col-xl-5 shopmate-form-col-reset">
            <div className="shopmate-card-reset">
              <div className="shopmate-card-head-reset">
                <span className="shopmate-card-icon-reset">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </span>
                <h1 className="shopmate-title-reset">Set New Password</h1>
                <p className="shopmate-subtitle-reset">
                  Enter your new password below.
                </p>
              </div>

              {params?.error && (
                <div className="shopmate-alert-reset" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{params.error}</span>
                </div>
              )}

              <form action={updatePassword} className="shopmate-form-reset">
                <ResetPasswordFields />
                <ResetSubmitButton />
              </form>

              <div className="shopmate-divider-reset" />

              <p className="shopmate-switch-reset">
                <Link href="/login">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}