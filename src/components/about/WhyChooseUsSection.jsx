import { Sparkles, CheckCircle2, Tag, Zap } from "lucide-react";

export default function WhyChooseUsSection() {
  const features = [
    {
      id: 1,
      icon: Sparkles,
      title: "Curated Quality Standard",
      description:
        "Every single item in our catalog is handpicked and rigorously quality-tested before dispatch to guarantee premium standards.",
      badge: "Handpicked Items",
    },
    {
      id: 2,
      icon: Tag,
      title: "Transparent & Honest Pricing",
      description:
        "What you see is what you pay. We maintain complete pricing clarity with zero hidden charges or surprise checkout fees.",
      badge: "No Hidden Costs",
    },
    {
      id: 3,
      icon: Zap,
      title: "Lightning-Fast Tech Platform",
      description:
        "Engineered with modern Next.js technology to give you ultra-fast page loads, effortless browsing, and instant search results.",
      badge: "Modern Stack",
    },
  ];

  return (
    <section className="shopmate-section-whyus">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-whyus">THE Clothing Outfits ADVANTAGE</span>
          <h2 className="shopmate-heading-whyus">Why Clothing Outfits stands out</h2>
          <p className="shopmate-subtitle-whyus">
            We combine high-grade product standards with cut-edge technology to offer an unparalleled online shopping journey in Pakistan.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="row g-4 shopmate-row-whyus justify-content-center">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="col-lg-4 col-md-6 col-12">
                <div className="shopmate-card-whyus">
                  <div className="shopmate-card-top-whyus">
                    <div className="shopmate-icon-box-whyus">
                      <IconComponent size={24} />
                    </div>
                    <span className="shopmate-badge-whyus">{feature.badge}</span>
                  </div>

                  <h3 className="shopmate-title-whyus">{feature.title}</h3>
                  <p className="shopmate-desc-whyus">{feature.description}</p>

                  <div className="shopmate-check-note-whyus">
                    <CheckCircle2 size={16} /> Verified Quality Guarantee
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