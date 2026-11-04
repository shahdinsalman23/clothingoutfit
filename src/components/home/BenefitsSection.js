import { Truck, ShieldCheck, Headphones, BadgeCheck } from "lucide-react";

const BENEFITS = [
  { icon: Truck, title: "Fast delivery", text: "Orders are packed and shipped quickly." },
  { icon: ShieldCheck, title: "Secure checkout", text: "Your details stay protected." },
  { icon: BadgeCheck, title: "Quality checked", text: "Every product is reviewed before listing." },
  { icon: Headphones, title: "Friendly support", text: "We are here whenever you need help." },
];

export default function BenefitsSection() {
  return (
    <section className="shopmate-section-homad">
      <div className="shopmate-wrap-homad">
        <div className="shopmate-benefits-homad">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="shopmate-benefit-homad">
              <span>
                <Icon size={22} />
              </span>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}