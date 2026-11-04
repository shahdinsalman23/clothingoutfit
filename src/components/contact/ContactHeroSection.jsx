import { Sparkles, MessageSquare, Clock, Headphones } from "lucide-react";

export default function ContactHeroSection() {
  return (
    <section className="shopmate-section-conthero">
      <span className="shopmate-blob-conthero blob-a-conthero" />
      <span className="shopmate-blob-conthero blob-b-conthero" />

      <div className="container text-center position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            <span className="shopmate-eyebrow-conthero">
              <Sparkles size={14} /> WE ARE HERE FOR YOU
            </span>

            <h1 className="shopmate-title-conthero">
              Get in Touch with <span> Clothing Outfits  Outfits </span>
            </h1>

            <p className="shopmate-subtitle-conthero">
              Have a question about an order, product availability, or business partnership? Our dedicated support team is available 24/7 to assist you every step of the way.
            </p>

            {/* Quick Feature Badges */}
            <div className="shopmate-badges-wrap-conthero">
              <div className="shopmate-badge-item-conthero">
                <Clock size={16} /> 24/7 Rapid Support
              </div>
              <div className="shopmate-badge-item-conthero">
                <MessageSquare size={16} /> Instant Resolution
              </div>
              <div className="shopmate-badge-item-conthero">
                <Headphones size={16} /> Friendly Assistance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}