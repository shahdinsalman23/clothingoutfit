import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductSearch from "./ProductSearch";

export default function ShopHeroSection({ total, q, categoryName }) {
  const title = q ? `Results for "${q}"` : categoryName || "Shop all products";

  return (
    <section className="shopmate-hero-shopad">
      <span className="shopmate-hero-blob-homad blob-a-homad" />
      <span className="shopmate-hero-blob-homad blob-b-homad" />

      <div className="shopmate-wrap-homad shopmate-hero-inner-shopad">
        <nav className="shopmate-crumbs-shopad" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <span>Shop</span>
          {categoryName && (
            <>
              <ChevronRight size={14} />
              <span>{categoryName}</span>
            </>
          )}
        </nav>

        <h1>{title}</h1>
        <p>
          {total} {total === 1 ? "product" : "products"} available right now.
        </p>

        <ProductSearch defaultValue={q} basePath="/products" />
      </div>
    </section>
  );
}