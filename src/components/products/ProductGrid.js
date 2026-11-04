import Link from "next/link";
import { PackageSearch, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

function pageHref(current, page) {
  const params = new URLSearchParams();
  ["q", "category", "min", "max", "instock"].forEach((key) => {
    if (current[key]) params.set(key, current[key]);
  });
  if (current.sort && current.sort !== "newest") params.set("sort", current.sort);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

function pageList(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push("gap-" + p);
    result.push(p);
  });
  return result;
}

export default function ProductGrid({ products, total, page, pageSize, current }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (products.length === 0) {
    return (
      <div className="shopmate-empty-shopad">
        <span>
          <PackageSearch size={32} />
        </span>
        <h3>No products found</h3>
        <p>Try a different search, or remove some filters to see more products.</p>
        <Link href="/products" className="shopmate-btn-primary-shdad">
          Clear all filters
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="shopmate-grid-shopad">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="shopmate-pager-shopad" aria-label="Pagination">
          {page > 1 ? (
            <Link href={pageHref(current, page - 1)} className="nav-shopad" aria-label="Previous page">
              <ChevronLeft size={17} />
            </Link>
          ) : (
            <span className="nav-shopad disabled-shopad">
              <ChevronLeft size={17} />
            </span>
          )}

          {pageList(page, totalPages).map((item) =>
            typeof item === "string" ? (
              <span key={item} className="gap-shopad">
                ...
              </span>
            ) : (
              <Link
                key={item}
                href={pageHref(current, item)}
                className={item === page ? "active-shopad" : ""}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </Link>
            )
          )}

          {page < totalPages ? (
            <Link href={pageHref(current, page + 1)} className="nav-shopad" aria-label="Next page">
              <ChevronRight size={17} />
            </Link>
          ) : (
            <span className="nav-shopad disabled-shopad">
              <ChevronRight size={17} />
            </span>
          )}
        </nav>
      )}
    </>
  );
}