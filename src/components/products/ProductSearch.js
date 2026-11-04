"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export default function ProductSearch({ defaultValue = "", basePath = "/products" }) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const firstRun = useRef(true);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Typing rukne ke 450ms baad URL update hota hai
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const trimmed = value.trim();
      if (trimmed) params.set("q", trimmed);
      else params.delete("q");
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath, { scroll: false });
    }, 450);
    return () => clearTimeout(timer);
  }, [value, basePath, router]);

  return (
    <div className="shopmate-searchbox-shopad" role="search">
      <Search size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products by name..."
        aria-label="Search products"
      />
      {value && (
        <button type="button" onClick={() => setValue("")} aria-label="Clear search">
          <X size={15} />
        </button>
      )}
    </div>
  );
}