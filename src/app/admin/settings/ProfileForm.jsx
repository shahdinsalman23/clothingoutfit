"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Save, Lock } from "lucide-react";
import { updateProfile } from "@/app/actions/settings";

export default function ProfileForm({ defaultName, defaultPhone, email }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

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
          <label className="shopmate-label-setad" htmlFor="full_name">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className="shopmate-input-setad"
            defaultValue={state?.values?.full_name ?? defaultName}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="shopmate-label-setad" htmlFor="phone">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="shopmate-input-setad"
            defaultValue={state?.values?.phone ?? defaultPhone}
            placeholder="+92 300 1234567"
            autoComplete="tel"
          />
        </div>

        <div className="col-12">
          <label className="shopmate-label-setad" htmlFor="email">
            Email Address
          </label>
          <div className="shopmate-input-wrap-setad">
            <input
              id="email"
              type="email"
              className="shopmate-input-setad shopmate-input-locked-setad"
              value={email}
              readOnly
              disabled
            />
            <Lock size={15} className="shopmate-input-lock-icon-setad" />
          </div>
          <span className="shopmate-help-text-setad">
            Your email is linked to your login and cannot be changed here.
          </span>
        </div>
      </div>

      <div className="shopmate-form-footer-setad">
        <button type="submit" className="shopmate-primary-btn-setad" disabled={isPending}>
          {isPending ? (
            <Loader2 size={17} className="shopmate-spin-setad" />
          ) : (
            <Save size={17} />
          )}
          <span>{isPending ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
    </form>
  );
}