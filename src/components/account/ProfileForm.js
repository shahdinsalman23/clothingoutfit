"use client";

import { useActionState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Save, Lock } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";

export default function ProfileForm({ defaultName, defaultPhone, email }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

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
          <label htmlFor="pf_full_name">Full name</label>
          <input
            id="pf_full_name"
            name="full_name"
            type="text"
            defaultValue={state?.values?.full_name ?? defaultName}
            placeholder="Enter your full name"
            autoComplete="name"
            required
          />
        </div>

        <div className="shopmate-field-prfad">
          <label htmlFor="pf_phone">Phone number</label>
          <input
            id="pf_phone"
            name="phone"
            type="tel"
            defaultValue={state?.values?.phone ?? defaultPhone}
            placeholder="0300 1234567"
            autoComplete="tel"
          />
        </div>

        <div className="shopmate-field-prfad wide-prfad">
          <label htmlFor="pf_email">Email address</label>
          <div className="shopmate-lock-prfad">
            <input id="pf_email" type="email" value={email} readOnly disabled />
            <Lock size={15} />
          </div>
          <small>Your email is linked to your login and cannot be changed here.</small>
        </div>
      </div>

      <div className="shopmate-footer-prfad">
        <button type="submit" className="shopmate-btn-prfad" disabled={isPending}>
          {isPending ? <Loader2 size={17} className="spin-prfad" /> : <Save size={17} />}
          {isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}