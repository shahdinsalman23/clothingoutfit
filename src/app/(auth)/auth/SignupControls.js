"use client";

import { useState } from "react";
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

export function SignupPasswordField() {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const score = getStrength(value);

  return (
    <div className="shopmate-field-signed">
      <label htmlFor="password" className="shopmate-label-signed">
        Password
      </label>

      <div className="shopmate-input-wrap-signed">
        <span className="shopmate-input-icon-signed" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>

        <input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          placeholder="Minimum 8 characters"
          minLength={8}
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="shopmate-input-signed has-toggle-signed"
        />

        <button
          type="button"
          className="shopmate-toggle-signed"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <path d="M1 1l22 22" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <div className={`shopmate-meter-signed level-${score}-signed`} aria-live="polite">
        <div className="shopmate-meter-bars-signed">
          <span className="shopmate-meter-bar-signed" />
          <span className="shopmate-meter-bar-signed" />
          <span className="shopmate-meter-bar-signed" />
          <span className="shopmate-meter-bar-signed" />
        </div>
        <small className="shopmate-meter-text-signed">
          {score === 0
            ? "Use 8+ characters with letters, numbers and symbols."
            : `Password strength: ${STRENGTH_LABELS[score]}`}
        </small>
      </div>
    </div>
  );
}

export function SignupSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shopmate-submit-signed"
    >
      {pending ? (
        <>
          <span className="shopmate-spinner-signed" aria-hidden="true" />
          Creating account...
        </>
      ) : (
        <>
          Create Account
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </>
      )}
    </button>
  );
}