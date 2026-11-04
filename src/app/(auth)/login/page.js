import Link from "next/link";
import { login } from "@/app/actions/auth";
import { LoginPasswordField, LoginSubmitButton } from "../auth/LoginControls";
import { SavingOverlay } from "@/components/admin/ProductFormStatus";

export const metadata = {
  title: "Login | ShopMate",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="shopmate-page-logged">
      <div className="shopmate-blob-logged blob-a-logged" />
      <div className="shopmate-blob-logged blob-b-logged" />

      <div className="container">
        <div className="row shopmate-row-logged">
          {/* Left: brand panel */}
          <div className="col-lg-6 shopmate-side-col-logged">
            <div className="shopmate-brand-panel-logged">
              <span className="shopmate-pill-logged">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Welcome back
              </span>

              <h2 className="shopmate-brand-title-logged">
                Pick up right where you <span>left off</span>
              </h2>

              <p className="shopmate-brand-text-logged">
                Login to track your orders, manage your cart and enjoy a faster,
                smoother checkout every time you shop.
              </p>

              <ul className="shopmate-points-logged">
                <li>
                  <span className="shopmate-point-icon-logged">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  Track every order in real time
                </li>
                <li>
                  <span className="shopmate-point-icon-logged">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  Save addresses for one-click checkout
                </li>
                <li>
                  <span className="shopmate-point-icon-logged">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5" /></svg>
                  </span>
                  Secure, encrypted account access
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <div className="col-12 col-md-10 col-lg-6 col-xl-5 shopmate-form-col-logged">
            <div className="shopmate-card-logged">
              <div className="shopmate-card-head-logged">
                <span className="shopmate-card-icon-logged">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <path d="M10 17l5-5-5-5" />
                    <path d="M15 12H3" />
                  </svg>
                </span>
                <h1 className="shopmate-title-logged">Login to ShopMate</h1>
                <p className="shopmate-subtitle-logged">
                  Enter your credentials to access your account.
                </p>
              </div>

              {params?.error && (
                <div className="shopmate-alert-logged error-logged" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{params.error}</span>
                </div>
              )}

              {params?.message === "check-email" && (
                <div className="shopmate-alert-logged success-logged" role="status">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                  <span>Please check your email to confirm your account.</span>
                </div>
              )}

              <form action={login} data-flash="login">
                <SavingOverlay title="Logging you in" text="Verifying your details. Please wait." />
                <div className="shopmate-field-logged">
                  <label htmlFor="email" className="shopmate-label-logged">
                    Email address
                  </label>
                  <div className="shopmate-input-wrap-logged">
                    <span className="shopmate-input-icon-logged" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 7l-10 6L2 7" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      className="shopmate-input-logged"
                    />
                  </div>
                </div>

                <LoginPasswordField />

                <LoginSubmitButton />
              </form>

              <div className="shopmate-divider-logged">
                <span>New to ShopMate?</span>
              </div>

              <p className="shopmate-switch-logged">
                Don&apos;t have an account?{" "}
                <Link href="/signup">Create one</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}