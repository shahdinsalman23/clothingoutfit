"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const SOFT = [0.16, 1, 0.3, 1];

const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const card = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: SOFT } },
};

export default function CategoriesSection({ categories }) {
  if (!categories.length) return null;

  return (
    <section className="catx">
      <div className="container">
        {/* ---------- Header ---------- */}
        <motion.div
          className="catx__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: SOFT }}
        >
          <div>
            <span className="catx__kicker">Browse the collection</span>
            <h2 className="catx__title">Shop by category</h2>
            <p className="catx__sub">
              Find your next favourite outfit, from everyday basics to festive statement pieces.
            </p>
          </div>
          <Link href="/categories" className="catx__all">
            <span>View all categories</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* ---------- Grid ---------- */}
        <motion.div
          className="catx__grid"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categories.map((cat) => {
            const img = cat.image || cat.image_url || cat.thumbnail;
            return (
              <motion.div key={cat.id} variants={card}>
                <Link href={`/categories/${cat.slug}`} className="catx__card">
                  <div className="catx__media">
                    {/* fallback: big ghost initial (image na ho to bhi premium lage) */}
                    <span className="catx__ghost" aria-hidden="true">
                      {cat.name?.charAt(0)}
                    </span>
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={cat.name} loading="lazy" onError={(e) => (e.currentTarget.style.display = "none")} />
                    )}
                    <span className="catx__shade" />
                  </div>

                  <span className="catx__arrow" aria-hidden="true">
                    <ArrowUpRight size={20} />
                  </span>

                  <div className="catx__info">
                    <h3>{cat.name}</h3>
                    <p>{cat.description || "Explore the collection"}</p>
                    <span className="catx__cta">
                      Shop now <ArrowRight size={14} />
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