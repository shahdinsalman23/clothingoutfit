"use client";

import { useState, useEffect, useActionState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { updatePassword } from "@/app/actions/profile";

const LEVELS = [
  { label: "Too short", cls: "l0-prfad" },
  { label: "Weak", cls: "l1-prfad" },
  { label: "Fair", cls: "l2-prfad" },
  { label: "Good", cls: "l3-prfad" },
  { label: "Strong", cls: "l4-prfad" },
];

function getStrength(value) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return { score, ...LEVELS[value ? score : 0] };
}

export default function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setNext("");
      setConfirm("");
    }
  }, [state]);

  const strength = getStrength(next);
  const mismatch = confirm.length > 0 && confirm !== next;

  return (
    <form action={formAction} noValidate>
      {state?.message && (
        <div className={`shopmate-notice-prfad ${state.success ? "ok-prfad" : "bad-prfad"}`} role={state.success ? "status" : "alert"}>
          {state.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{state.message}</span>
        </div>
      )}

      <div className="shopmate-fields-prfad">
        <div className="shopmate-field-prfad">
          <label htmlFor="pf_new">New password</label>
          <div className="shopmate-eye-wrap-prfad">
            <input
              id="pf_new"
              name="new_password"
              type={showNext ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowNext(!showNext)} aria-label={showNext ? "Hide password" : "Show password"}>
              {showNext ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {next && (
            <div className="shopmate-strength-prfad">
              <div>
                {[1, 2, 3, 4].map((bar) => (
                  <span key={bar} className={bar <= strength.score ? `on-prfad ${strength.cls}` : ""} />
                ))}
              </div>
              <small className={strength.cls}>{strength.label}</small>
            </div>
          )}
        </div>

        <div className={`shopmate-field-prfad ${mismatch ? "invalid-prfad" : ""}`}>
          <label htmlFor="pf_confirm">Confirm password</label>
          <div className="shopmate-eye-wrap-prfad">
            <input
              id="pf_confirm"
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? "Hide password" : "Show password"}>
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {mismatch && <small className="err-prfad">Passwords do not match.</small>}
        </div>
      </div>

      <div className="shopmate-footer-prfad">
        <button type="submit" className="shopmate-btn-prfad" disabled={isPending || !next || mismatch}>
          {isPending ? <Loader2 size={17} className="spin-prfad" /> : <ShieldCheck size={17} />}
          {isPending ? "Updating..." : "Update password"}
        </button>
      </div>
    </form>
  );
}