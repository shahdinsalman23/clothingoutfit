"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Flame, Gem, ShoppingBag, Sparkles } from "lucide-react";

const SOFT = [0.16, 1, 0.3, 1];

const TABS = [
  { id: "new", label: "New arrivals", icon: Sparkles },
  { id: "bestsellers", label: "Best sellers", icon: Flame },
  { id: "value", label: "Best value", icon: Gem },
];

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: SOFT } },
};

export default function TabbedProductsSection({ products = [] }) {
  const [activeTab, setActiveTab] = useState("new");

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    if (activeTab === "bestsellers") {
      return products.filter((p) => p.is_featured).slice(0, 8);
    }
    if (activeTab === "value") {
      return [...products].sort((a, b) => Number(a.price) - Number(b.price)).slice(0, 8);
    }
    return products.slice(0, 8);
  }, [products, activeTab]);

  return (
    <section className="tabx">
      <div className="container">
        {/* ---------- Header + Tabs ---------- */}
        <motion.div
          className="tabx__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: SOFT }}
        >
          <div>
            <span className="tabx__kicker">Explore the variety</span>
            <h2 className="tabx__title">Curated for you</h2>
          </div>

          <div className="tabx__tabs" role="tablist" aria-label="Product groups">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`tabx__tab${active ? " is-active" : ""}`}
                  onClick={() => setActiveTab(id)}
                >
                  {active && (
                    <motion.span
                      layoutId="tabx-pill"
                      className="tabx__pill"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="tabx__tabtext">
                    <Icon size={16} /> {label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ---------- Grid ---------- */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeTab}
              className="prodx__grid"
              variants={grid}
              initial="hidden"
              whileInView="show"
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {filteredProducts.map((product) => {
                const soldOut = product.stock <= 0;
                const lowStock = product.stock > 0 && product.stock <= 5;
                const showBest = !soldOut && !lowStock && activeTab === "bestsellers";
                const href = `/products/${product.slug}`;

                return (
                  <motion.div key={product.id} variants={item}>
                    <Link href={href} className={`prodx__card${soldOut ? " is-sold" : ""}`}>
                      <div className="prodx__media">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={product.name} loading="lazy" />
                        ) : (
                          <div className="prodx__fallback">
                            <ShoppingBag size={34} />
                          </div>
                        )}

                        {(soldOut || lowStock || showBest) && (
                          <span className={`prodx__badge${soldOut ? " is-out" : ""}`}>
                            {soldOut ? "Sold out" : lowStock ? `Only ${product.stock} left` : "Best seller"}
                          </span>
                        )}

                        <span className="prodx__quick" aria-hidden="true">
                          <span>View product</span>
                          <ArrowUpRight size={17} />
                        </span>
                      </div>

                      <div className="prodx__body">
                        <h3 className="prodx__name">{product.name}</h3>
                        <span className="prodx__price">
                          Rs. {Number(product.price).toLocaleString("en-PK")}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key={`${activeTab}-empty`}
              className="tabx__empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: SOFT } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <span>
                <ShoppingBag size={26} />
              </span>
              <strong>Nothing here yet</strong>
              <p>We are adding new pieces to this group. Browse the full catalog in the meantime.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Bottom link ---------- */}
        <motion.div
          className="tabx__foot"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: SOFT }}
        >
          <Link href="/products" className="tabx__more">
            <span>Explore full catalog</span>
            <ArrowRight size={17} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}