import { redirect } from "next/navigation";

export default async function CategorySlugPage({ params }) {
  const { slug } = await params;
  redirect(`/products?category=${encodeURIComponent(slug)}`);
}