"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Headphones, Users } from "lucide-react";

/* ------------------------------------------------------------------
   DATA
   Images: /public/hero/slide-1.jpg, slide-2.jpg, slide-3.jpg
   Size: portrait, around 1200 x 1500, model photos work best.
------------------------------------------------------------------ */
const SLIDES = [
  {
    id: "winter",
    season: "Winter edit 2026",
    lines: ["Wrapped in", "quiet luxury"],
    text: "Hand-embroidered shawls, wool-blend kurtas and warm neutrals made for the cold months.",
    cta: "Shop winter edit",
    href: "/products",
    image: "/heroslider/party1.png",
    piece: "Embroidered wool shawl",
    price: "Rs. 6,499",
  },
  {
    id: "festive",
    season: "Festive formals",
    lines: ["Dressed for", "every celebration"],
    text: "Chiffon and organza sets finished with zari and handwork, ready for the wedding season.",
    cta: "Shop festive formals",
    href: "/products",
    image: "/heroslider/party2.png",
    piece: "Zari organza three-piece",
    price: "Rs. 12,999",
  },
  {
    id: "everyday",
    season: "Everyday wear",
    lines: ["Everyday", "made elegant"],
    text: "Soft cambric co-ords and straight-cut kurtas that go from office to dinner without a change.",
    cta: "Shop everyday wear",
    href: "/products",
    image: "/heroslider/party3.png",
    piece: "Cambric co-ord set",
    price: "Rs. 3,799",
  },
];

const STATS = [
  { icon: Users, value: 50, suffix: "K+", label: "Happy buyers", note: "Shopping with us across Pakistan" },
  { icon: BadgeCheck, value: 100, suffix: "%", label: "Genuine products", note: "Fabric checked before dispatch" },
  { icon: Headphones, text: "24/7", label: "Customer support", note: "Real people on chat and phone" },
];

const EASE = [0.76, 0, 0.24, 1];
const SOFT = [0.16, 1, 0.3, 1];

/* ------------------------------------------------------------------
   Animated number (starts when the card scrolls into view)
------------------------------------------------------------------ */
function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------
   HERO
------------------------------------------------------------------ */
export default function HeroSection({ isLoggedIn }) {
  const [state, setState] = useState({ index: 0, tick: 0 });
  const { index, tick } = state;
  const slide = SLIDES[index];
  const upcoming = SLIDES[(index + 1) % SLIDES.length];

  const go = useCallback((fn) => {
    setState((s) => ({ index: fn(s.index), tick: s.tick + 1 }));
  }, []);
  const next = useCallback(() => go((i) => (i + 1) % SLIDES.length), [go]);
  const prev = useCallback(() => go((i) => (i - 1 + SLIDES.length) % SLIDES.length), [go]);

  /* scroll parallax */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "9%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="herox" ref={heroRef} aria-roledescription="carousel" aria-label="Featured collections">
        <div className="herox__bg" aria-hidden="true" />

        <div className="container herox__inner">
          <div className="herox__grid">
            {/* ---------------- LEFT: COPY ---------------- */}
            <motion.div className="herox__copy" style={{ y: copyY }}>
              <AnimatePresence mode="wait">
                <motion.div key={slide.id} className="herox__slidecopy">
                  <motion.span
                    className="herox__season"
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: SOFT, delay: 0.1 } }}
                    exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  >
                    {slide.season}
                  </motion.span>

                  <h1 className="herox__title" aria-live="polite">
                    {slide.lines.map((line, i) => (
                      <span className="herox__mask" key={line}>
                        <motion.span
                          className="herox__line"
                          initial={{ y: "115%" }}
                          animate={{ y: "0%", transition: { duration: 0.95, ease: EASE, delay: 0.12 + i * 0.1 } }}
                          exit={{ y: "-115%", transition: { duration: 0.5, ease: EASE, delay: i * 0.05 } }}
                        >
                          {line}
                        </motion.span>
                      </span>
                    ))}
                  </h1>

                  <motion.p
                    className="herox__text"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: SOFT, delay: 0.5 } }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  >
                    {slide.text}
                  </motion.p>

                  <motion.div
                    className="herox__cta"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: SOFT, delay: 0.62 } }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  >
                    <Link href={slide.href} className="herox__btn herox__btn--gold">
                      {slide.cta} <ArrowRight size={18} />
                    </Link>
                    {isLoggedIn ? (
                      <Link href="/account/orders" className="herox__btn herox__btn--ghost">
                        Track orders
                      </Link>
                    ) : (
                      <Link href="/signup" className="herox__btn herox__btn--ghost">
                        Join free
                      </Link>
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* controls */}
              <div className="herox__controls">
                <button type="button" className="herox__arrow" onClick={prev} aria-label="Previous slide">
                  <ArrowLeft size={18} />
                </button>
                <button type="button" className="herox__arrow" onClick={next} aria-label="Next slide">
                  <ArrowRight size={18} />
                </button>

                <div className="herox__counter" aria-hidden="true">
                  <span className="herox__num">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={index}
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        0{index + 1}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="herox__total">/ 0{SLIDES.length}</span>
                </div>

                <div className="herox__progress" aria-hidden="true">
                  <span key={tick} className="herox__bar" onAnimationEnd={next} />
                </div>
              </div>
            </motion.div>

            {/* ---------------- RIGHT: IMAGE STAGE ---------------- */}
            <motion.div className="herox__stage" style={{ y: stageY }}>
              <motion.div
                className="herox__arch"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                dragSnapToOrigin
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) next();
                  else if (info.offset.x > 70) prev();
                }}
              >
                <AnimatePresence>
                  <motion.div
                    key={slide.id}
                    className="herox__frame"
                    style={{ zIndex: tick }}
                    initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                    exit={{ opacity: 1, transition: { duration: 1.3 } }}
                    transition={{ duration: 1.25, ease: EASE }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img
                      src={slide.image}
                      alt={slide.piece}
                      draggable={false}
                      initial={{ scale: 1.35 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 2, ease: SOFT }}
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* featured piece tag */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  className="herox__tag"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: SOFT, delay: 1 } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
                >
                  <small>Featured piece</small>
                  <strong>{slide.piece}</strong>
                  <span>{slide.price}</span>
                </motion.div>
              </AnimatePresence>

              {/* next slide preview */}
              <button type="button" className="herox__peek" onClick={next} aria-label={`Next: ${upcoming.season}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={upcoming.image} alt="" draggable={false} onError={(e) => (e.currentTarget.style.display = "none")} />
                <em>Next</em>
              </button>
            </motion.div>
          </div>
        </div>

        {/* ---------------- STAT CARDS (half overlap) ---------------- */}
        <div className="herox__cards">
          <div className="container">
            <div className="herox__cardgrid">
              {STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    className="herox__card"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: SOFT, delay: 1.2 + i * 0.12 }}
                  >
                    <span className="herox__cardicon">
                      <Icon size={22} />
                    </span>
                    <div>
                      <strong className="herox__cardnum">
                        {s.text ? s.text : <Counter to={s.value} suffix={s.suffix} />}
                      </strong>
                      <b className="herox__cardlabel">{s.label}</b>
                      <small>{s.note}</small>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}