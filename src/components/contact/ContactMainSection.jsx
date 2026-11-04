"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function ContactMainSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    orderId: "",
    subject: "Order Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        orderId: "",
        subject: "Order Inquiry",
        message: "",
      });
    }, 1200);
  };

  return (
    <section className="shopmate-section-contgrid">
      <div className="container position-relative">
        <div className="row g-4 shopmate-row-contgrid">
          {/* Left Column: Information Cards */}
          <div className="col-lg-5 col-12">
            <div className="shopmate-info-wrap-contgrid">
              <div className="shopmate-info-head-contgrid">
                <span className="shopmate-eyebrow-contgrid">
                  <Sparkles size={14} /> DIRECT CHANNELS
                </span>
                <h2 className="shopmate-info-title-contgrid">
                  We are always ready to assist you
                </h2>
                <p className="shopmate-info-desc-contgrid">
                  Reach out to us through any of our official channels or visit our head office. We strive to reply as quickly as possible.
                </p>
              </div>

              <div className="shopmate-cards-list-contgrid">
                {/* Email Card */}
                <div className="shopmate-info-card-contgrid">
                  <div className="shopmate-icon-box-contgrid">
                    <Mail size={22} />
                  </div>
                  <div>
                    <strong>Email Us</strong>
                    <a href="mailto:support@shopmate.pk">support@shopmate.pk</a>
                    <small>Response time: Within 2 hours</small>
                  </div>
                </div>

                {/* Call / WhatsApp Card */}
                <div className="shopmate-info-card-contgrid">
                  <div className="shopmate-icon-box-contgrid icon-green-contgrid">
                    <Phone size={22} />
                  </div>
                  <div>
                    <strong>Call / WhatsApp</strong>
                    <a href="tel:+923001234567">+92 300 1234567</a>
                    <small>Mon–Sat, 9:00 AM – 9:00 PM PKT</small>
                  </div>
                </div>

                {/* Address Card */}
                <div className="shopmate-info-card-contgrid">
                  <div className="shopmate-icon-box-contgrid icon-purple-contgrid">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <strong>Head Office Address</strong>
                    <span>Office #404, Main Shahrah-e-Faisal, Karachi, Pakistan</span>
                    <small>Walk-in visits by appointment</small>
                  </div>
                </div>

                {/* Operating Hours Card */}
                <div className="shopmate-info-card-contgrid">
                  <div className="shopmate-icon-box-contgrid icon-amber-contgrid">
                    <Clock size={22} />
                  </div>
                  <div>
                    <strong>Business Hours</strong>
                    <span>24/7 Online Support & Order Dispatch</span>
                    <small>Customer service active round the clock</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="col-lg-7 col-12">
            <div className="shopmate-form-card-contgrid">
              <div className="shopmate-form-head-contgrid">
                <div className="shopmate-form-badge-contgrid">
                  <MessageSquare size={16} /> Fast Inquiry
                </div>
                <h3>Send us a direct message</h3>
                <p>Fill out the form below and our team will get back to you promptly.</p>
              </div>

              {submitted ? (
                <div className="shopmate-success-card-contgrid">
                  <CheckCircle2 size={48} className="shopmate-success-icon-contgrid" />
                  <h4>Message Sent Successfully!</h4>
                  <p>
                    Thank you for reaching out to ShopMate. Our support representative will review your query and respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="shopmate-btn-reset-contgrid"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="shopmate-form-body-contgrid">
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-md-6 col-12">
                      <div className="shopmate-field-contgrid">
                        <label htmlFor="fullName">Full Name *</label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Shahdin Salman"
                          required
                          className="shopmate-input-contgrid"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="col-md-6 col-12">
                      <div className="shopmate-field-contgrid">
                        <label htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          required
                          className="shopmate-input-contgrid"
                        />
                      </div>
                    </div>

                    {/* Phone / WhatsApp */}
                    <div className="col-md-6 col-12">
                      <div className="shopmate-field-contgrid">
                        <label htmlFor="phone">Phone / WhatsApp *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+92 300 0000000"
                          required
                          className="shopmate-input-contgrid"
                        />
                      </div>
                    </div>

                    {/* Order ID (Optional) */}
                    <div className="col-md-6 col-12">
                      <div className="shopmate-field-contgrid">
                        <label htmlFor="orderId">Order ID (Optional)</label>
                        <input
                          type="text"
                          id="orderId"
                          name="orderId"
                          value={formData.orderId}
                          onChange={handleChange}
                          placeholder="e.g. #ORD-89421"
                          className="shopmate-input-contgrid"
                        />
                      </div>
                    </div>

                    {/* Subject Dropdown */}
                    <div className="col-12">
                      <div className="shopmate-field-contgrid">
                        <label htmlFor="subject">Inquiry Subject *</label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="shopmate-select-contgrid"
                        >
                          <option value="Order Inquiry">Order Inquiry & Tracking</option>
                          <option value="Returns & Exchange">Returns & Exchange</option>
                          <option value="Product Feedback">Product Query & Feedback</option>
                          <option value="Partnership">Business & Bulk Orders</option>
                          <option value="General Query">General Question</option>
                        </select>
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="col-12">
                      <div className="shopmate-field-contgrid">
                        <label htmlFor="message">Your Message *</label>
                        <textarea
                          id="message"
                          name="message"
                          rows={4}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Type your message or details about your request here..."
                          required
                          className="shopmate-textarea-contgrid"
                        />
                      </div>
                    </div>

                    {/* Submit CTA Button */}
                    <div className="col-12 mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="shopmate-submit-btn-contgrid"
                      >
                        {loading ? (
                          <span className="shopmate-spinner-contgrid" />
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send size={17} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}