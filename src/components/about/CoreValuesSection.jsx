import { Target, Lightbulb, HeartHandshake, Zap } from "lucide-react";

export default function CoreValuesSection() {
  const values = [
    {
      id: 1,
      icon: Target,
      title: "Our Mission",
      description:
        "Delivering high-quality, handpicked products at accessible prices across every city in Pakistan.",
      badge: "Purpose Driven",
    },
    {
      id: 2,
      icon: Lightbulb,
      title: "Modern Innovation",
      description:
        "Creating a frictionless, fast, and seamless digital shopping experience tailored for the modern consumer.",
      badge: "Tech Powered",
    },
    {
      id: 3,
      icon: HeartHandshake,
      title: "Customer First",
      description:
        "Dedicated to 100% satisfaction with hassle-free returns, genuine care, and 24/7 responsive support.",
      badge: "Core Promise",
    },
    {
      id: 4,
      icon: Zap,
      title: "Speed & Reliability",
      description:
        "Fast nationwide delivery powered by secure checkout options including Cash on Delivery.",
      badge: "Guaranteed",
    },
  ];

  return (
    <section className="shopmate-section-valmain">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-valmain">THE PILLARS OF SHOPMATE</span>
          <h2 className="shopmate-heading-valmain">Driven by values that matter</h2>
          <p className="shopmate-subtitle-valmain">
            Hamari har service aur product ke peeche yeh 4 bunyadi usool hain jo Clothing Outfits ko sabse alag banate hain.
          </p>
        </div>

        {/* Values Grid */}
        <div className="row g-4 shopmate-row-valmain">
          {values.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.id} className="col-lg-3 col-md-6 col-12">
                <div className="shopmate-card-valmain">
                  <span className="shopmate-badge-valmain">{item.badge}</span>
                  <div className="shopmate-icon-box-valmain">
                    <IconComponent size={26} />
                  </div>
                  <h3 className="shopmate-title-valmain">{item.title}</h3>
                  <p className="shopmate-desc-valmain">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}