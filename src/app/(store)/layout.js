import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Percent, Truck, Banknote, Sparkles } from "lucide-react";

export default function StoreLayout({ children }) {
  return (
    <div className="shopmate-shell-shdad">
      {/* Next-Level Marquee Announcement Bar */}
      <div className="shopmate-announcement-shdad">
        <div className="shopmate-marquee-container-shdad">
          <div className="shopmate-marquee-track-shdad">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Percent size={14} /> Flat 20% OFF on all new collection Use code: SHOPMATE20
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Truck size={14} /> Free Shipping across Pakistan on orders above Rs. 2,999
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Banknote size={14} /> Cash on Delivery available nationwide
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} /> Shop Pakistan's trendiest styles today
            </span>
            {/* Duplicate for seamless infinite loop */}
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Percent size={14} /> Flat 20% OFF on all new collections Use code: SHOPMATE20
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Truck size={14} /> Free Shipping across Pakistan on orders above Rs. 2,999
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Banknote size={14} /> Cash on Delivery available nationwide
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} /> Shop Pakistan's trendiest styles today
            </span>
          </div>
        </div>
      </div>

      <Header />
      <main className="shopmate-main-shdad">{children}</main>
      <Footer />
    </div>
  );
}