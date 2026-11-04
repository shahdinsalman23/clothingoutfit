import { MapPin, Navigation, Sparkles, Building2, CheckCircle2 } from "lucide-react";

export default function LocationMapSection() {
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57912.42877395638!2d67.0322123!3d24.8719404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33eef339031ef%3A0xc3f83d98a0f5850e!2sShahrah-e-Faisal%2C%20Karachi%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s";

  return (
    <section className="shopmate-section-locmap">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-locmap">
            <Sparkles size={14} /> VISIT OUR FULFILLMENT HUB
          </span>
          <h2 className="shopmate-heading-locmap">Locate us in Karachi</h2>
          <p className="shopmate-subtitle-locmap">
            Our central headquarters and primary logistics hub are strategically located in the heart of Karachi for nationwide distribution.
          </p>
        </div>

        {/* Map Showcase Box */}
        <div className="shopmate-map-wrapper-locmap">
          {/* Embedded Google Map */}
          <iframe
            title="ShopMate Karachi Head Office Location"
            src={mapEmbedUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="shopmate-iframe-locmap"
          />

          {/* Floating Dark Glassmorphism Overlay Card */}
          <div className="shopmate-overlay-card-locmap">
            <div className="shopmate-card-head-locmap">
              <span className="shopmate-status-badge-locmap">
                <CheckCircle2 size={13} /> Open for Appointments
              </span>
              <Building2 size={20} className="shopmate-icon-locmap" />
            </div>

            <h3 className="shopmate-card-title-locmap"> Clothing Outfits  Head Office</h3>

            <div className="shopmate-card-detail-locmap">
              <MapPin size={18} className="shopmate-pin-icon-locmap" />
              <p>Office #404, Main Shahrah-e-Faisal, Karachi, Pakistan</p>
            </div>

            <a
              href="https://maps.google.com/?q=Shahrah-e-Faisal,Karachi"
              target="_blank"
              rel="noreferrer"
              className="shopmate-direction-btn-locmap"
            >
              <span>Get Directions</span>
              <Navigation size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}