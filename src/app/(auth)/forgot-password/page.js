import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";
import { ForgotSubmitButton } from "../auth/ForgotControls";

export const metadata = {
  title: "Forgot Password | ShopMate",
};

export default async function ForgotPasswordPage({ searchParams }) {
  const params = await searchParams;

  return (
    <section className="shopmate-page-forgot">
      <div className="shopmate-blob-forgot blob-a-forgot" />
      <div className="shopmate-blob-forgot blob-b-forgot" />

      <div className="container">
        <div className="row shopmate-row-forgot">
          {/* Left: brand panel */}
          <div className="col-lg-6 shopmate-side-col-forgot">
            <div className="shopmate-brand-panel-forgot">
              <span className="shopmate-pill-forgot">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Account recovery
              </span>

              <h2 className="shopmate-brand-title-forgot">
                Locked out? We will get you <span>back in</span>
              </h2>

              <p className="shopmate-brand-text-forgot">
                It happens to everyone. Follow three quick steps and you will
                be back to shopping in minutes.
              </p>

              <ol className="shopmate-steps-forgot">
                <li>
                  <span className="shopmate-step-num-forgot">1</span>
                  <div>
                    <strong>Enter your email</strong>
                    <small>Use the address you registered with.</small>
                  </div>
                </li>
                <li>
                  <span className="shopmate-step-num-forgot">2</span>
                  <div>
                    <strong>Check your inbox</strong>
                    <small>Open the reset link we send you. Check spam too.</small>
                  </div>
                </li>
                <li>
                  <span className="shopmate-step-num-forgot">3</span>
                  <div>
                    <strong>Set a new password</strong>
                    <small>Choose something strong and you are done.</small>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Right: form card */}
          <div className="col-12 col-md-10 col-lg-6 col-xl-5 shopmate-form-col-forgot">
            <div className="shopmate-card-forgot">
              <div className="shopmate-card-head-forgot">
                <span className="shopmate-card-icon-forgot">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                  </svg>
                </span>
                <h1 className="shopmate-title-forgot">Forgot Password?</h1>
                <p className="shopmate-subtitle-forgot">
                  Enter your registered email address. We will send you a
                  password reset link if the account is eligible.
                </p>
              </div>

              {params?.error && (
                <div className="shopmate-alert-forgot error-forgot" role="alert">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                  <span>{params.error}</span>
                </div>
              )}

              {params?.message === "reset-email-sent" && (
                <div className="shopmate-alert-forgot success-forgot" role="status">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                  <span>
                    If an eligible account exists, a password reset email will
                    be sent. Please check your inbox and spam folder.
                  </span>
                </div>
              )}

              <form action={requestPasswordReset} className="shopmate-form-forgot">
                <div className="shopmate-field-forgot">
                  <label htmlFor="email" className="shopmate-label-forgot">
                    Email address
                  </label>
                  <div className="shopmate-input-wrap-forgot">
                    <span className="shopmate-input-icon-forgot" aria-hidden="true">
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
                      className="shopmate-input-forgot"
                    />
                  </div>
                </div>

                <ForgotSubmitButton />
              </form>

              <div className="shopmate-divider-forgot">
                <span>Remembered it?</span>
              </div>

              <p className="shopmate-switch-forgot">
                Remember your password? <Link href="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}