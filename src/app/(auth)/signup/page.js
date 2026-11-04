import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { SignupPasswordField, SignupSubmitButton } from "../auth/SignupControls";

export const metadata = {
  title: "Create Account | ShopMate",
};

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="shopmate-page-signed">
      <div className="shopmate-blob-signed blob-a-signed" />
      <div className="shopmate-blob-signed blob-b-signed" />

      <div className="container">
        <div className="row shopmate-row-signed">
          {/* Left: brand panel */}
          <div className="col-lg-6 shopmate-side-col-signed">
            <div className="shopmate-brand-panel-signed">
              <span className="shopmate-pill-signed">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                </svg>
                Join ShopMate
              </span>

              <h2 className="shopmate-brand-title-signed">
                Create your account and start <span>shopping smarter</span>
              </h2>

              <p className="shopmate-brand-text-signed">
                It takes less than a minute. Get quality products, fast
                delivery and a checkout that remembers you.
              </p>

              <ul className="shopmate-points-signed">
                <li>
                  <span className="shopmate-point-icon-signed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <div>
                    <strong>Secure by default</strong>
                    <small>Your data stays encrypted and private.</small>
                  </div>
                </li>
                <li>
                  <span className="shopmate-point-icon-signed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      <path d="M3.3 7L12 12l8.7-5" />
                      <path d="M12 22V12" />
                    </svg>
                  </span>
                  <div>
                    <strong>Track your orders</strong>
                    <small>See every order from checkout to delivery.</small>
                  </div>
                </li>
                <li>
                  <span className="shopmate-point-icon-signed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </span>
                  <div>
                    <strong>Faster checkout</strong>
                    <small>Save addresses and reorder in a click.</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right: form card */}
          <div className="col-12 col-md-10 col-lg-6 col-xl-5 shopmate-form-col-signed">
            <div className="shopmate-card-signed">
              <div className="shopmate-card-head-signed">
                <span className="shopmate-card-icon-signed">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M19 8v6" />
                    <path d="M22 11h-6" />
                  </svg>
                </span>
                <h1 className="shopmate-title-signed">Create Account</h1>
                <p className="shopmate-subtitle-signed">
                  Sign up for your Clothing Outfits account.
                </p>
              </div>

              {params?.error && (
                <div className="shopmate-alert-signed" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{params.error}</span>
                </div>
              )}

              <form action={signup} className="shopmate-form-signed">
                <div className="shopmate-field-signed">
                  <label htmlFor="full_name" className="shopmate-label-signed">
                    Full name
                  </label>
                  <div className="shopmate-input-wrap-signed">
                    <span className="shopmate-input-icon-signed" aria-hidden="true">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      className="shopmate-input-signed"
                    />
                  </div>
                </div>

                <div className="shopmate-field-signed">
                  <label htmlFor="email" className="shopmate-label-signed">
                    Email address
                  </label>
                  <div className="shopmate-input-wrap-signed">
                    <span className="shopmate-input-icon-signed" aria-hidden="true">
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
                      className="shopmate-input-signed"
                    />
                  </div>
                </div>

                <SignupPasswordField />

                <SignupSubmitButton />

                <p className="shopmate-terms-signed">
                  By creating an account, you agree to our Terms of Service
                  and Privacy Policy.
                </p>
              </form>

              <div className="shopmate-divider-signed">
                <span>Already a member?</span>
              </div>

              <p className="shopmate-switch-signed">
                Already have an account? <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}