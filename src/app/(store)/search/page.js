import { redirect } from "next/navigation";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const q = Array.isArray(params?.q) ? params.q[0] : params?.q || "";
  redirect(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
}