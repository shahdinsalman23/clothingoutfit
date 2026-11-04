"use client";

import { useState, useEffect, useActionState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { updatePassword } from "@/app/actions/settings";

function getStrength(value) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  const levels = [
    { label: "Too short", className: "level-0-setad" },
    { label: "Weak", className: "level-1-setad" },
    { label: "Fair", className: "level-2-setad" },
    { label: "Good", className: "level-3-setad" },
    { label: "Strong", className: "level-4-setad" },
  ];

  return { score, ...levels[value ? score : 0] };
}

export default function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Clear fields after a successful change
  useEffect(() => {
    if (state?.success) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [state]);

  const strength = getStrength(newPassword);
  const mismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;

  return (
    <form action={formAction} noValidate>
      {state?.message && (
        <div
          className={`shopmate-inv-notice-setad mb-4 ${
            state.success ? "shopmate-inv-success-notice-setad" : "shopmate-inv-error-notice-setad"
          }`}
          role={state.success ? "status" : "alert"}
        >
          {state.success ? (
            <CheckCircle2 size={18} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={18} className="flex-shrink-0" />
          )}
          <span>{state.message}</span>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="shopmate-label-setad" htmlFor="new_password">
            New Password
          </label>
          <div className="shopmate-input-wrap-setad">
            <input
              id="new_password"
              name="new_password"
              type={showNew ? "text" : "password"}
              className="shopmate-input-setad shopmate-input-has-icon-setad"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="shopmate-eye-btn-setad"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {newPassword && (
            <div className="shopmate-strength-setad">
              <div className="shopmate-strength-bars-setad">
                {[1, 2, 3, 4].map((bar) => (
                  <span
                    key={bar}
                    className={bar <= strength.score ? `active-setad ${strength.className}` : ""}
                  />
                ))}
              </div>
              <small className={strength.className}>{strength.label}</small>
            </div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <label className="shopmate-label-setad" htmlFor="confirm_password">
            Confirm Password
          </label>
          <div className="shopmate-input-wrap-setad">
            <input
              id="confirm_password"
              name="confirm_password"
              type={showConfirm ? "text" : "password"}
              className={`shopmate-input-setad shopmate-input-has-icon-setad ${
                mismatch ? "shopmate-input-error-setad" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="shopmate-eye-btn-setad"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {mismatch && (
            <span className="shopmate-help-text-setad shopmate-help-error-setad">
              Passwords do not match.
            </span>
          )}
        </div>
      </div>

      <div className="shopmate-form-footer-setad">
        <button
          type="submit"
          className="shopmate-primary-btn-setad"
          disabled={isPending || !newPassword || mismatch}
        >
          {isPending ? (
            <Loader2 size={17} className="shopmate-spin-setad" />
          ) : (
            <ShieldCheck size={17} />
          )}
          <span>{isPending ? "Updating..." : "Update Password"}</span>
        </button>
      </div>
    </form>
  );
}