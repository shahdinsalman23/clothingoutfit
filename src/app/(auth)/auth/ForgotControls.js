"use client";

import { useFormStatus } from "react-dom";

export function ForgotSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="shopmate-submit-forgot"
    >
      {pending ? (
        <>
          <span className="shopmate-spinner-forgot" aria-hidden="true" />
          Sending link...
        </>
      ) : (
        <>
          Send Reset Link
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </>
      )}
    </button>
  );
}