import Link from "next/link";
import { PackageSearch, RefreshCw, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export default function QuickHelpSection() {
  const helpCards = [
    {
      id: 1,
      icon: PackageSearch,
      title: "Track Your Order",
      subtext: "Check the real-time status and delivery updates of your package instantly.",
      btnText: "Track Order",
      href: "/account/orders",
      badge: "Real-Time Tracking",
      isExternal: false,
    },
    {
      id: 2,
      icon: RefreshCw,
      title: "Returns & Refunds",
      subtext: "Read our hassle-free 7-day exchange and transparent return policy.",
      btnText: "Policy Details",
      href: "/privacy-policy",
      badge: "Hassle-Free 7 Days",
      isExternal: false,
    },
    {
      id: 3,
      icon: MessageSquare,
      title: "Live WhatsApp Chat",
      subtext: "Need an instant response? Chat directly with our support agent on WhatsApp.",
      btnText: "Start Chat",
      href: "https://wa.me/923001234567",
      badge: "Instant Response",
      isExternal: true,
    },
  ];

  return (
    <section className="shopmate-section-qhelp">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-qhelp">
            <Sparkles size={14} /> SELF SUPPORT CHANNELS
          </span>
          <h2 className="shopmate-heading-qhelp">Need quick solutions without waiting?</h2>
          <p className="shopmate-subtitle-qhelp">
            Explore our instant self-service options below to resolve common queries in seconds.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="row g-4 shopmate-row-qhelp">
          {helpCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.id} className="col-lg-4 col-md-6 col-12">
                <div className="shopmate-card-qhelp">
                  <div className="shopmate-card-head-qhelp">
                    <div className="shopmate-icon-box-qhelp">
                      <IconComponent size={24} />
                    </div>
                    <span className="shopmate-badge-qhelp">{card.badge}</span>
                  </div>

                  <h3 className="shopmate-title-qhelp">{card.title}</h3>
                  <p className="shopmate-desc-qhelp">{card.subtext}</p>

                  <div className="shopmate-action-wrap-qhelp">
                    {card.isExternal ? (
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noreferrer"
                        className="shopmate-btn-qhelp"
                      >
                        <span>{card.btnText}</span>
                        <ArrowRight size={16} />
                      </a>
                    ) : (
                      <Link href={card.href} className="shopmate-btn-qhelp">
                        <span>{card.btnText}</span>
                        <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}