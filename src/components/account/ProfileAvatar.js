"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Check, X, Trash2, Loader2 } from "lucide-react";
import { uploadAvatar, removeAvatar } from "@/app/actions/profile";

// Center-crop to a square and compress so the upload stays small
async function cropToSquare(file, size = 400) {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
}

export default function ProfileAvatar({ initials, avatarUrl }) {
  const inputRef = useRef(null);
  const [blob, setBlob] = useState(null);
  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isPending, startTransition] = useTransition();

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setBlob(null);
    setPreview("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFeedback({ success: false, message: "Only image files are allowed." });
      return;
    }

    try {
      const cropped = await cropToSquare(file);
      if (preview) URL.revokeObjectURL(preview);
      setBlob(cropped);
      setPreview(URL.createObjectURL(cropped));
      setFeedback(null);
    } catch {
      setFeedback({ success: false, message: "Could not read this image." });
    }
  };

  const handleSave = () => {
    if (!blob) return;
    const formData = new FormData();
    formData.append("avatar", blob, "avatar.jpg");

    startTransition(async () => {
      const result = await uploadAvatar(formData);
      setFeedback(result);
      if (result.success) clearPreview();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      setFeedback(await removeAvatar());
    });
  };

  const shown = preview || avatarUrl;

  return (
    <div className="shopmate-avatar-wrap-prfad">
      <div className="shopmate-avatar-frame-prfad">
        <div className="shopmate-avatar-circle-prfad">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Profile" />
          ) : (
            <span>{initials}</span>
          )}
          {isPending && (
            <div className="shopmate-avatar-loading-prfad">
              <Loader2 size={22} className="spin-prfad" />
            </div>
          )}
        </div>

        {!blob && (
          <button
            type="button"
            className="shopmate-camera-prfad"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            aria-label="Change profile photo"
          >
            <Camera size={15} />
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          hidden
          onChange={handleSelect}
        />
      </div>

      {blob ? (
        <div className="shopmate-avatar-actions-prfad">
          <button type="button" className="save-prfad" onClick={handleSave} disabled={isPending}>
            <Check size={14} /> Save photo
          </button>
          <button type="button" className="cancel-prfad" onClick={clearPreview} disabled={isPending}>
            <X size={14} /> Cancel
          </button>
        </div>
      ) : (
        avatarUrl && (
          <button type="button" className="shopmate-remove-prfad" onClick={handleRemove} disabled={isPending}>
            <Trash2 size={13} /> Remove photo
          </button>
        )
      )}

      {feedback?.message && (
        <span
          className={`shopmate-feedback-prfad ${feedback.success ? "ok-prfad" : "bad-prfad"}`}
          role={feedback.success ? "status" : "alert"}
        >
          {feedback.message}
        </span>
      )}
    </div>
  );
}