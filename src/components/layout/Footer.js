"use client";

import Link from "next/link";
import { Zap, Send, Phone, Mail, MapPin, ShieldCheck, Truck, Clock } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="shopmate-footer-footmain">
      {/* Top Value Badges Bar */}
      <div className="shopmate-footer-top-footmain">
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-lg-4 col-md-6 col-12">
              <div className="shopmate-badge-card-footmain">
                <Truck size={24} className="shopmate-badge-icon-footmain" />
                <div>
                  <strong>Nationwide Delivery</strong>
                  <small>Fast shipping across all cities in Pakistan</small>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <div className="shopmate-badge-card-footmain">
                <ShieldCheck size={24} className="shopmate-badge-icon-footmain" />
                <div>
                  <strong>Safe & Secure Checkout</strong>
                  <small>Cash on Delivery & online payments</small>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-12">
              <div className="shopmate-badge-card-footmain">
                <Clock size={24} className="shopmate-badge-icon-footmain" />
                <div>
                  <strong>24/7 Dedicated Support</strong>
                  <small>We are here to assist you anytime</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="shopmate-footer-body-footmain">
        <div className="container">
          <div className="row g-4">
            {/* Brand Info & Newsletter */}
            <div className="col-lg-4 col-12">
              <div className="shopmate-brand-col-footmain">
                {/* Logo */}
                  <Link href="/" className="shopmate-logo-shdad" aria-label="ShopMate home">
                      <img src="/logomini.png" alt="ShopMate" style={{ width: "50px", height: "auto", objectFit: "contain" }} />
                      <span className="shopmate-logo-text-shdad header-logoad">Clothing Outfits</span>
                  </Link>
                <p className="shopmate-brand-desc-footmain">
                  Pakistan's premier destination for quality products. Experience simple shopping, unbeatable prices, and guaranteed customer satisfaction.
                </p>

                <div className="shopmate-newsletter-box-footmain">
                  <strong>Subscribe to our Newsletter</strong>
                  <p>Get exclusive deals and promo codes directly in your inbox.</p>
                  <form onSubmit={(e) => e.preventDefault()} className="shopmate-news-form-footmain">
                    <input type="email" placeholder="Enter your email address" required />
                    <button type="submit" aria-label="Subscribe">
                      <Send size={16} />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Quick Links Column 1 */}
            <div className="col-lg-2 col-md-4 col-6">
              <div className="shopmate-links-col-footmain">
                <h4 className="shopmate-title-footmain">Shop</h4>
                <ul className="shopmate-list-footmain">
                  <li><Link href="/products">All Products</Link></li>
                  <li><Link href="/categories">Categories</Link></li>
                  <li><Link href="/search">Search Products</Link></li>
                  <li><Link href="/cart">My Cart</Link></li>
                </ul>
              </div>
            </div>

            {/* Quick Links Column 2 */}
            <div className="col-lg-2 col-md-4 col-6">
              <div className="shopmate-links-col-footmain">
                <h4 className="shopmate-title-footmain">Company</h4>
                <ul className="shopmate-list-footmain">
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/faq">FAQs</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/terms">Terms of Service</Link></li>
                </ul>
              </div>
            </div>

            {/* Quick Links Column 3 */}
            <div className="col-lg-2 col-md-4 col-6">
              <div className="shopmate-links-col-footmain">
                <h4 className="shopmate-title-footmain">Account</h4>
                <ul className="shopmate-list-footmain">
                  <li><Link href="/account">My Account</Link></li>
                  <li><Link href="/account/orders">Order History</Link></li>
                  <li><Link href="/login">Log In</Link></li>
                  <li><Link href="/signup">Create Account</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="shopmate-links-col-footmain">
                <h4 className="shopmate-title-footmain">Contact</h4>
                <ul className="shopmate-contact-list-footmain">
                  <li>
                    <MapPin size={16} />
                    <span>Karachi, Pakistan</span>
                  </li>
                  <li>
                    <Phone size={16} />
                    <span>+92 300 1234567</span>
                  </li>
                  <li>
                    <Mail size={16} />
                    <span>support@shopmate.pk</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="shopmate-footer-bottom-footmain">
        <div className="container">
          <div className="shopmate-bottom-inner-footmain">
            <span>© {year} ShopMate. All rights reserved. Designed for Pakistan.</span>
            <div className="shopmate-pay-badges-footmain">
              <span>Cash on Delivery</span>
              <span className="shopmate-dot-footmain">•</span>
              <span>Debit / Credit Cards</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}