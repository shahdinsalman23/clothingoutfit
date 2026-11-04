import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Award, HeartHandshake } from "lucide-react";

export default function AboutHeroSection() {
  return (
    <section className="shopmate-section-abthero">
      <span className="shopmate-blob-abthero blob-a-abthero" />
      <span className="shopmate-blob-abthero blob-b-abthero" />

      <div className="container text-center position-relative">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            <span className="shopmate-eyebrow-abthero">
              <Sparkles size={14} /> OUR STORY & VISION
            </span>

            <h1 className="shopmate-title-abthero">
              Redefining Modern Shopping in <span>Pakistan</span>
            </h1>

            <p className="shopmate-text-abthero">
              At ShopMate, we are driven by quality and built for you. Our mission is to bridge the gap between premium lifestyle products and seamless online convenience across every corner of the country.
            </p>

            <div className="shopmate-cta-wrap-abthero">
              <Link href="/products" className="shopmate-btn-primary-abthero">
                Explore Our Collection <ArrowRight size={17} />
              </Link>
              <Link href="/contact" className="shopmate-btn-ghost-abthero">
                Get In Touch
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="shopmate-highlights-abthero">
              <div className="shopmate-highlight-item-abthero">
                <ShieldCheck size={18} className="shopmate-icon-abthero" />
                <span>100% Authentic Products</span>
              </div>
              <div className="shopmate-highlight-item-abthero">
                <Award size={18} className="shopmate-icon-abthero" />
                <span>Uncompromised Quality</span>
              </div>
              <div className="shopmate-highlight-item-abthero">
                <HeartHandshake size={18} className="shopmate-icon-abthero" />
                <span>Customer First Approach</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}