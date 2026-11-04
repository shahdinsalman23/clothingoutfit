import { ShieldCheck, Target, HeartHandshake, Sparkles } from "lucide-react";

export default function OurStorySection() {
  return (
    <section className="shopmate-section-storymain">
      <div className="container position-relative">
        <div className="row align-items-center shopmate-row-storymain">
          {/* Left Column: Visual Image & Floating Badges */}
          <div className="col-lg-6 col-12">
            <div className="shopmate-visual-wrap-storymain">
              <div className="shopmate-img-box-storymain">
                {/* Modern placeholder / high-quality brand image */}
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000"
                  alt="ShopMate Team & Operations"
                  className="shopmate-img-storymain"
                />
                <div className="shopmate-img-overlay-storymain" />
              </div>

              {/* Floating Stat Badge 1 */}
              <div className="shopmate-float-card-storymain float-top-storymain">
                <div className="shopmate-float-icon-storymain">
                  <Sparkles size={20} />
                </div>
                <div>
                  <strong>Built in 2024</strong>
                  <small>For Modern Pakistan</small>
                </div>
              </div>

              {/* Floating Stat Badge 2 */}
              <div className="shopmate-float-card-storymain float-bottom-storymain">
                <div className="shopmate-float-icon-storymain icon-alt-storymain">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <strong>50,000+</strong>
                  <small>Happy Customers</small>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="col-lg-6 col-12">
            <div className="shopmate-content-storymain">
              <span className="shopmate-eyebrow-storymain">OUR BRAND JOURNEY</span>
              
              <h2 className="shopmate-title-storymain">
                Born out of a desire for <span>trust & perfection</span>
              </h2>

              <p className="shopmate-paragraph-storymain">
                Online shopping in Pakistan often came with uncertainty—unreliable product quality, delayed deliveries, and complicated return processes. We started <strong> Clothing Outfits </strong> with a singular mission: to restore complete faith in online retail.
              </p>

              <p className="shopmate-paragraph-storymain">
                We set out to create a marketplace where every single item is hand-curated, quality-checked, and delivered with total transparency. From hassle-free Cash on Delivery to 24/7 support, we engineered every step to put you first.
              </p>

              {/* Mission & Vision Cards */}
              <div className="shopmate-pills-grid-storymain">
                <div className="shopmate-pill-card-storymain">
                  <div className="shopmate-pill-header-storymain">
                    <Target size={18} />
                    <strong>Our Mission</strong>
                  </div>
                  <p>
                    To provide high-quality lifestyle products at honest prices, delivered quickly to every doorstep in Pakistan.
                  </p>
                </div>

                <div className="shopmate-pill-card-storymain">
                  <div className="shopmate-pill-header-storymain">
                    <ShieldCheck size={18} />
                    <strong>Our Vision</strong>
                  </div>
                  <p>
                    To become Pakistan’s most customer-centric e-commerce brand known for uncompromising trust and service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}