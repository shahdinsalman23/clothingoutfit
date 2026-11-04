import { Users, Truck, ShieldCheck, Headphones } from "lucide-react";

export default function AboutStatsSection() {
  const stats = [
    {
      id: 1,
      icon: Users,
      value: "50,000+",
      label: "Happy Customers",
      sublabel: "Across all major cities in Pakistan",
    },
    {
      id: 2,
      icon: Truck,
      value: "99.8%",
      label: "On-Time Delivery Rate",
      sublabel: "Seamless nationwide logistics network",
    },
    {
      id: 3,
      icon: ShieldCheck,
      value: "100%",
      label: "Authentic Products",
      sublabel: "Quality checked before every dispatch",
    },
    {
      id: 4,
      icon: Headphones,
      value: "24/7",
      label: "Dedicated Support",
      sublabel: "Real humans ready to assist you anytime",
    },
  ];

  return (
    <section className="shopmate-section-abstat">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-abstat">OUR PROVEN IMPACT</span>
          <h2 className="shopmate-heading-abstat">Milestones that define our commitment</h2>
          <p className="shopmate-subtitle-abstat">
            Numbers speak louder than words. Here is how we continue to set new benchmarks in Pakistani e-commerce.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="row g-4 shopmate-row-abstat">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="col-lg-3 col-md-6 col-12">
                <div className="shopmate-card-abstat">
                  <div className="shopmate-icon-wrap-abstat">
                    <IconComponent size={24} />
                  </div>
                  <strong className="shopmate-value-abstat">{stat.value}</strong>
                  <h3 className="shopmate-label-abstat">{stat.label}</h3>
                  <p className="shopmate-sublabel-abstat">{stat.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}