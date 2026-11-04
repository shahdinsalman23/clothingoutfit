"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, Flame } from "lucide-react";

export default function PromoBannerSection() {
  // Demo target date: 7 days from now
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.getTime();
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="shopmate-section-promosale">
      <div className="shopmate-bg-overlay-promosale" />
      <span className="shopmate-blob-promosale blob-left-promosale" />
      <span className="shopmate-blob-promosale blob-right-promosale" />

      <div className="container position-relative">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8 col-12">
            <div className="shopmate-card-promosale">
              <span className="shopmate-badge-promosale">
                <Flame size={15} /> LIMITED TIME OFFER
              </span>

              <h2 className="shopmate-title-promosale">
                FLAT <span>30% OFF</span> ON SEASONAL ESSENTIALS
              </h2>

              <p className="shopmate-subtitle-promosale">
                Upgrade your wardrobe and home with Pakistan's best deals. Offer valid while stocks last!
              </p>

              {/* Countdown Timer */}
              <div className="shopmate-timer-wrap-promosale">
                <div className="shopmate-timer-unit-promosale">
                  <strong>{String(timeLeft.days).padStart(2, "0")}</strong>
                  <span>Days</span>
                </div>
                <span className="shopmate-timer-sep-promosale">:</span>
                <div className="shopmate-timer-unit-promosale">
                  <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                  <span>Hours</span>
                </div>
                <span className="shopmate-timer-sep-promosale">:</span>
                <div className="shopmate-timer-unit-promosale">
                  <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                  <span>Mins</span>
                </div>
                <span className="shopmate-timer-sep-promosale">:</span>
                <div className="shopmate-timer-unit-promosale">
                  <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                  <span>Secs</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="shopmate-cta-wrap-promosale">
                <Link href="/products?sale=true" className="shopmate-btn-promosale">
                  <ShoppingBag size={18} /> Shop Sale Now
                </Link>
                <div className="shopmate-note-promosale">
                  <Sparkles size={14} /> Free delivery across Pakistan on orders above Rs. 2,999
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}