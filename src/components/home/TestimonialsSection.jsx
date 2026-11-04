import { Star, Quote, CheckCircle2 } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Ahsan Khan",
      location: "Lahore",
      rating: 5,
      review:
        "ShopMate se shopping ka experience boht hi zabardast raha. Products original hain aur delivery time par mili. Highly recommended!",
      role: "Verified Buyer",
    },
    {
      id: 2,
      name: "Fatima Zehra",
      location: "Karachi",
      rating: 5,
      review:
        "Quality bilkul premium hai! Kapray aur fitting exact waisi hi nikli jaisi site par dikhayi gayi thi. Cash on delivery ne kaam boht aasan kar diya.",
      role: "Verified Buyer",
    },
    {
      id: 3,
      name: "Muhammad Bilal",
      location: "Islamabad",
      rating: 5,
      review:
        "Customer support boht cooperative hai. Order tracking seamless thi aur packaging bhi boht safe thi. Ab har shopping yahan se hi hogi!",
      role: "Verified Buyer",
    },
    {
      id: 4,
      name: "Ayesha Malik",
      location: "Faisalabad",
      rating: 5,
      review:
        "Fastest delivery across Pakistan! Mujhe 2 din mein mera parcel mil gaya tha. Prices bhi baqi stores se kafi behtar hain.",
      role: "Verified Buyer",
    },
    {
      id: 5,
      name: "Usman Raza",
      location: "Rawalpindi",
      rating: 5,
      review:
        "Authentic products aur top-notch customer service! Return policy bhi boht hassle-free hai. Clothing Outfits is definitely trusted.",
      role: "Verified Buyer",
    },
  ];

  // Infinite marquee ke liye items ko duplicate kar rahe hain
  const marqueeItems = [...testimonials, ...testimonials];

  return (
    <section className="shopmate-section-testi">
      <span className="shopmate-blob-testi blob-left-testi" />
      <span className="shopmate-blob-testi blob-right-testi" />

      <div className="container text-center mb-5">
        <span className="shopmate-eyebrow-testi">CUSTOMER STORIES</span>
        <h2 className="shopmate-heading-testi">Loved by shoppers across Pakistan</h2>
        <p className="shopmate-subtitle-testi">
          Suno hamare happy customers ki baatein aur jaano kyun Clothing Outfits hai sabki pehli pasand.
        </p>
      </div>

      {/* Infinite Marquee Slider Container */}
      <div className="shopmate-marquee-wrap-testi">
        <div className="shopmate-marquee-track-testi">
          {marqueeItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="shopmate-card-testi">
              <div className="shopmate-card-head-testi">
                <div className="shopmate-stars-testi">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
                  ))}
                </div>
                <Quote size={24} className="shopmate-quote-icon-testi" />
              </div>

              <p className="shopmate-review-text-testi">"{item.review}"</p>

              <div className="shopmate-user-info-testi">
                <div className="shopmate-avatar-testi">
                  {item.name.charAt(0)}
                </div>
                <div className="text-start">
                  <strong className="shopmate-user-name-testi">{item.name}</strong>
                  <div className="shopmate-user-meta-testi">
                    <span>{item.location}</span>
                    <span className="shopmate-badge-verified-testi">
                      <CheckCircle2 size={12} /> {item.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}