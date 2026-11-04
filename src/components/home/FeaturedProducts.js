"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShoppingBag } from "lucide-react";

const SOFT = [0.16, 1, 0.3, 1];

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 56 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: SOFT } },
};

export default function FeaturedProducts({ products = [] }) {
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <section className="prodx">
      <div className="container">
        {/* ---------- Header ---------- */}
        <motion.div
          className="prodx__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: SOFT }}
        >
          <div>
            <span className="prodx__kicker">Handpicked for you</span>
            <h2 className="prodx__title">Featured collection</h2>
          </div>
          <Link href="/products" className="prodx__all">
            <span>View all products</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* ---------- Grid ---------- */}
        <motion.div
          className="prodx__grid"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {products.map((product) => {
            const soldOut = product.stock <= 0;
            const lowStock = product.stock > 0 && product.stock <= 5;
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

                    {(soldOut || lowStock) && (
                      <span className={`prodx__badge${soldOut ? " is-out" : ""}`}>
                        {soldOut ? "Sold out" : `Only ${product.stock} left`}
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
      </div>
    </section>
  );
}