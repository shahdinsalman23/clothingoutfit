import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial" }}>
      <h2>404 - Page Not Found</h2>
      <p>Could not find the requested resource.</p>
      <Link href="/" style={{ color: "blue", textDecoration: "underline" }}>
        Return Home
      </Link>
    </div>
  );
}