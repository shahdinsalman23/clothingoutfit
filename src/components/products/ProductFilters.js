"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name", label: "Name: A to Z" },
];

function buildUrl(current, patch) {
  const next = { ...current, ...patch };
  const params = new URLSearchParams();
  ["q", "category", "min", "max", "instock"].forEach((key) => {
    if (next[key]) params.set(key, next[key]);
  });
  if (next.sort && next.sort !== "newest") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export function SortSelect({ current }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <label className="shopmate-sort-shopad">
      <span>Sort by</span>
      <select
        value={current.sort}
        onChange={(e) =>
          startTransition(() =>
            router.push(buildUrl(current, { sort: e.target.value }), { scroll: false })
          )
        }
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ProductFilters({ categories, current }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(current.min);
  const [max, setMax] = useState(current.max);

  useEffect(() => {
    setMin(current.min);
    setMax(current.max);
  }, [current.min, current.max]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const activeCount = [current.category, current.min, current.max, current.instock].filter(Boolean).length;

  const apply = (patch) =>
    startTransition(() => router.push(buildUrl(current, patch), { scroll: false }));

  const clearAll = () => {
    apply({ category: "", min: "", max: "", instock: "" });
    setOpen(false);
  };

  const panel = (
    <div className={`shopmate-panel-shopad ${isPending ? "pending-shopad" : ""}`}>
      <div className="shopmate-panel-head-shopad">
        <h3>Filters</h3>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      <div className="shopmate-group-shopad">
        <span>Category</span>
        <button
          type="button"
          className={`shopmate-opt-shopad ${!current.category ? "active-shopad" : ""}`}
          onClick={() => apply({ category: "" })}
        >
          All products {!current.category && <Check size={15} />}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`shopmate-opt-shopad ${current.category === cat.slug ? "active-shopad" : ""}`}
            onClick={() => apply({ category: cat.slug })}
          >
            {cat.name} {current.category === cat.slug && <Check size={15} />}
          </button>
        ))}
      </div>

      <div className="shopmate-group-shopad">
        <span>Price range (Rs.)</span>
        <div className="shopmate-price-shopad">
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            aria-label="Minimum price"
          />
          <i />
          <input
            type="number"
            min="0"
            inputMode="numeric"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            aria-label="Maximum price"
          />
        </div>
        <button
          type="button"
          className="shopmate-apply-shopad"
          onClick={() => apply({ min, max })}
        >
          Apply price
        </button>
      </div>

      <div className="shopmate-group-shopad">
        <span>Availability</span>
        <button
          type="button"
          className="shopmate-switch-row-shopad"
          onClick={() => apply({ instock: current.instock ? "" : "1" })}
          role="switch"
          aria-checked={Boolean(current.instock)}
        >
          In stock only
          <i className={current.instock ? "on-shopad" : ""} />
        </button>
      </div>
    </div>
  );

  return (
    <aside className="shopmate-side-shopad">
      <button type="button" className="shopmate-mobile-btn-shopad" onClick={() => setOpen(true)}>
        <SlidersHorizontal size={17} />
        Filters
        {activeCount > 0 && <em>{activeCount}</em>}
      </button>

      <div className="shopmate-desktop-panel-shopad">{panel}</div>

      <div
        className={`shopmate-sheet-overlay-shopad ${open ? "open-shopad" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div className={`shopmate-sheet-shopad ${open ? "open-shopad" : ""}`}>
        <div className="shopmate-sheet-head-shopad">
          <strong>Filters</strong>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close filters">
            <X size={19} />
          </button>
        </div>
        <div className="shopmate-sheet-body-shopad">{panel}</div>
        <div className="shopmate-sheet-foot-shopad">
          <button type="button" className="shopmate-apply-shopad" onClick={() => setOpen(false)}>
            Show results
          </button>
        </div>
      </div>
    </aside>
  );
}