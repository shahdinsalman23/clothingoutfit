"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function LoginPasswordField() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="shopmate-field-logged">
      <div className="shopmate-label-row-logged">
        <label htmlFor="password" className="shopmate-label-logged">
          Password
        </label>
        <a href="/forgot-password" className="shopmate-forgot-logged">
          Forgot password?
        </a>
      </div>

      <div className="shopmate-input-wrap-logged">
        <span className="shopmate-input-icon-logged" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>

        <input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          className="shopmate-input-logged has-toggle-logged"
        />

        <button
          type="button"
          className="shopmate-toggle-logged"
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
    </div>
  );
}

export function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shopmate-submit-logged"
    >
      {pending ? (
        <>
          <span className="shopmate-spinner-logged" aria-hidden="true" />
          Signing in...
        </>
      ) : (
        <>
          Login
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </>
      )}
    </button>
  );
}