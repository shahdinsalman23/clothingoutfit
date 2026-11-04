"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight, Loader2, ImageOff, TrendingUp, PackageSearch } from "lucide-react";

function highlight(text, term) {
  const t = term.trim();
  if (!t) return text;
  const safe = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${safe})`, "ig")).map((part, i) =>
    part.toLowerCase() === t.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
}

export default function SearchModal({ open, onClose }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => setMounted(true), []);

  // Open par focus aur scroll lock, close par reset
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(-1);
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Debounced live search
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const term = query.trim();

    const timer = setTimeout(
      async () => {
        setLoading(true);
        setError(false);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
            signal: controller.signal,
          });
          if (!res.ok) throw new Error("search failed");
          const data = await res.json();
          setResults(data.results || []);
          setTotal(data.total || 0);
          setActive(-1);
          setLoading(false);
        } catch (err) {
          if (err.name === "AbortError") return;
          setError(true);
          setResults([]);
          setLoading(false);
        }
      },
      term ? 250 : 0
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  // Active item ko view mein rakho
  useEffect(() => {
    if (active < 0) return;
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!mounted || !open) return null;

  const term = query.trim();

  const go = (href) => {
    router.push(href);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length) setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length) setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) go(`/products/${results[active].slug}`);
      else if (term) go(`/products?q=${encodeURIComponent(term)}`);
    }
  };

  return createPortal(
    <div className="backdrop-srcad" onMouseDown={onClose} role="presentation">
      <div
        className="modal-srcad"
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="head-srcad">
          <h2>Search Our Shop</h2>
          <button type="button" onClick={onClose} aria-label="Close search">
            <X size={20} />
          </button>
        </div>

        <div className="field-srcad">
          <Search size={19} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products by name..."
            aria-label="Search products"
            autoComplete="off"
            spellCheck="false"
          />
          {loading ? (
            <Loader2 size={18} className="spin-srcad" />
          ) : (
            query && (
              <button type="button" className="clear-srcad" onClick={() => setQuery("")} aria-label="Clear">
                <X size={14} />
              </button>
            )
          )}
        </div>

        <div className="body-srcad" ref={listRef}>
          {error ? (
            <div className="state-srcad">
              <span><PackageSearch size={26} /></span>
              <strong>Something went wrong</strong>
              <p>We could not load results. Please try again.</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="state-srcad">
              <span><PackageSearch size={26} /></span>
              <strong>{term ? "No products found" : "Nothing to show yet"}</strong>
              <p>
                {term ? `We could not find anything for "${term}". Try a different word.` : "Start typing to search."}
              </p>
              <Link href="/products" onClick={onClose} className="browse-srcad">
                Browse all products
              </Link>
            </div>
          ) : (
            <>
              <p className="label-srcad">
                {term ? (
                  `Products found (${total})`
                ) : (
                  <>
                    <TrendingUp size={14} /> Trending products
                  </>
                )}
              </p>

              <ul className={loading ? "dim-srcad" : ""}>
                {results.map((product, i) => (
                  <li key={product.id} data-index={i}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      onMouseEnter={() => setActive(i)}
                      className={`item-srcad ${i === active ? "active-srcad" : ""}`}
                    >
                      <span className="thumb-srcad">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={product.name} />
                        ) : (
                          <ImageOff size={18} />
                        )}
                      </span>

                      <span className="info-srcad">
                        <strong>{highlight(product.name, term)}</strong>
                        {product.category && (
                          <small>
                            <b>Category:</b> {product.category}
                          </small>
                        )}
                        <em>Rs. {product.price.toLocaleString("en-PK")}</em>
                      </span>

                      {product.stock <= 0 && <span className="sold-srcad">Sold out</span>}
                      <ArrowRight size={17} className="go-srcad" />
                    </Link>
                  </li>
                ))}
              </ul>

              {term && total > results.length && (
                <Link
                  href={`/products?q=${encodeURIComponent(term)}`}
                  onClick={onClose}
                  className="all-srcad"
                >
                  View all {total} results <ArrowRight size={15} />
                </Link>
              )}
            </>
          )}
        </div>

        <div className="foot-srcad">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>,
    document.body
  );
}