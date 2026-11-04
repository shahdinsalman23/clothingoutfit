"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

function getStrength(value) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function ResetPasswordFields() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmRef = useRef(null);

  const score = getStrength(password);
  const hasConfirm = confirm.length > 0;
  const matches = hasConfirm && password === confirm;
  const mismatch = hasConfirm && password !== confirm;

  // Mismatch par browser form submit nahi hone dega
  useEffect(() => {
    if (!confirmRef.current) return;
    confirmRef.current.setCustomValidity(
      mismatch ? "Passwords do not match" : ""
    );
  }, [mismatch, password, confirm]);

  return (
    <>
      {/* New password */}
      <div className="shopmate-field-reset">
        <label htmlFor="password" className="shopmate-label-reset">
          New password
        </label>

        <div className="shopmate-input-wrap-reset">
          <span className="shopmate-input-icon-reset" aria-hidden="true">
            <LockIcon />
          </span>

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shopmate-input-reset has-toggle-reset"
          />

          <button
            type="button"
            className="shopmate-toggle-reset"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        <div className={`shopmate-meter-reset level-${score}-reset`} aria-live="polite">
          <div className="shopmate-meter-bars-reset">
            <span className="shopmate-meter-bar-reset" />
            <span className="shopmate-meter-bar-reset" />
            <span className="shopmate-meter-bar-reset" />
            <span className="shopmate-meter-bar-reset" />
          </div>
          <small className="shopmate-meter-text-reset">
            {score === 0
              ? "Use 8+ characters with letters, numbers and symbols."
              : `Password strength: ${STRENGTH_LABELS[score]}`}
          </small>
        </div>
      </div>

      {/* Confirm password */}
      <div className="shopmate-field-reset">
        <label htmlFor="confirm_password" className="shopmate-label-reset">
          Confirm new password
        </label>

        <div className="shopmate-input-wrap-reset">
          <span className="shopmate-input-icon-reset" aria-hidden="true">
            <LockIcon />
          </span>

          <input
            ref={confirmRef}
            id="confirm_password"
            name="confirm_password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            minLength={8}
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={`shopmate-input-reset has-toggle-reset ${
              mismatch ? "invalid-reset" : matches ? "valid-reset" : ""
            }`}
          />

          <button
            type="button"
            className="shopmate-toggle-reset"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>

        {hasConfirm && (
          <small
            className={`shopmate-match-reset ${matches ? "ok-reset" : "bad-reset"}`}
            aria-live="polite"
          >
            {matches ? "Passwords match" : "Passwords do not match yet"}
          </small>
        )}
      </div>
    </>
  );
}

export function ResetSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shopmate-submit-reset"
    >
      {pending ? (
        <>
          <span className="shopmate-spinner-reset" aria-hidden="true" />
          Updating password...
        </>
      ) : (
        <>
          Update Password
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </>
      )}
    </button>
  );
}