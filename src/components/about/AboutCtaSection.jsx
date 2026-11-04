"use client";

import { useState } from "react";
import { Send, Globe, Share2, MessageCircle, Sparkles } from "lucide-react";

export default function AboutCtaSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="shopmate-section-abcta">
      <div className="shopmate-bg-pattern-abcta" />
      <span className="shopmate-blob-abcta blob-left-abcta" />
      <span className="shopmate-blob-abcta blob-right-abcta" />

      <div className="container position-relative">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8 col-12">
            <div className="shopmate-card-abcta">
              <span className="shopmate-badge-abcta">
                <Sparkles size={14} /> STAY CONNECTED
              </span>

              <h2 className="shopmate-title-abcta">
                Be part of the <span> Clothing Outfits  Outfits  community</span>
              </h2>

              <p className="shopmate-subtitle-abcta">
                Subscribe to our newsletter for exclusive insider deals, new arrival alerts, and special promotional offers delivered straight to your inbox.
              </p>

              {/* Newsletter Form */}
              <div className="shopmate-form-wrap-abcta">
                {subscribed ? (
                  <div className="shopmate-success-msg-abcta">
                    ✨ Thank you for subscribing! Welcome to the Clothing Outfits family.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="shopmate-form-abcta">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="shopmate-input-abcta"
                    />
                    <button type="submit" className="shopmate-btn-abcta">
                      <span>Subscribe</span> <Send size={16} />
                    </button>
                  </form>
                )}
              </div>

              {/* Social Channels Row */}
              <div className="shopmate-socials-wrap-abcta">
                <span className="shopmate-socials-label-abcta">Follow our official channels:</span>
                <div className="shopmate-social-links-abcta">
                  <a href="#" className="shopmate-social-btn-abcta" title="Official Website">
                    <Globe size={18} /> <span>Website</span>
                  </a>
                  <a href="#" className="shopmate-social-btn-abcta" title="Community Hub">
                    <Share2 size={18} /> <span>Community</span>
                  </a>
                  <a href="#" className="shopmate-social-btn-abcta" title="24/7 Chat">
                    <MessageCircle size={18} /> <span>Support Chat</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}