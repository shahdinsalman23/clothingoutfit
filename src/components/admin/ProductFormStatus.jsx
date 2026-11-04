"use client";

import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Save, Loader2, Zap } from "lucide-react";

export function SaveButton({
  label = "Save Product",
  pendingLabel = "Saving...",
  className = "product-submit-btn-prodform",
  icon: Icon = Save,
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? (
        <Loader2 size={17} className="spin-savead" aria-hidden="true" />
      ) : (
        <Icon size={17} aria-hidden="true" />
      )}
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}

export function SavingOverlay({
  title = "Saving your product",
  text = "Uploading image and saving details. Please do not close this page.",
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!pending) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [pending]);

  if (!pending) return null;

  return (
    <div className="overlay-savead" role="alert" aria-live="assertive" aria-busy="true">
      <div className="card-savead">
        <div className="stage-savead">
          <span className="halo-savead" />
          <span className="ring-savead outer-savead" />
          <span className="ring-savead inner-savead" />
          <div className="logo-savead">
            <Zap size={26} fill="currentColor" />
          </div>
        </div>

        <h3>
          {title}
          <span className="dots-savead">
            <i />
            <i />
            <i />
          </span>
        </h3>
        <p>{text}</p>

        <div className="bar-savead">
          <span />
        </div>
      </div>
    </div>
  );
}