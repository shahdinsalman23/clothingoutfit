import Link from "next/link";
import { MailCheck } from "lucide-react";

export const metadata = { title: "Verify your email | ShopMate" };

export default function VerifyEmailPage() {
  return (
    <main
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 440,
          width: "100%",
          padding: "40px 28px",
          textAlign: "center",
          border: "1px solid var(--border)",
          borderRadius: 22,
          background: "#fff",
          boxShadow: "0 18px 40px -24px rgba(15,23,42,0.3)",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,var(--gold-soft),var(--gold-soft))",
            color: "var(--gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MailCheck size={32} />
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "var(--bg)" }}>
          Check your email
        </h1>
        <p style={{ margin: "12px 0 24px", color: "var(--muted)", lineHeight: 1.7, fontSize: 15 }}>
          We have sent a confirmation link to your inbox. Click it to activate your account,
          then log in.
        </p>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: 12,
            background: "var(--gold)",
            color: "#fff",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Go to login
        </Link>
      </div>
    </main>
  );
}