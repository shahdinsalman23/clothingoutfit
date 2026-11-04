"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

export default function ContactFaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How long does delivery take across Pakistan?",
      answer:
        "Standard delivery takes 2 to 4 business days for major cities like Karachi, Lahore, and Islamabad. For other regions, it usually takes 3 to 5 business days. Express shipping options are also available at checkout.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Cash on Delivery (COD) across Pakistan, along with major Debit/Credit cards (Visa & Mastercard), EasyPaisa, JazzCash, and direct Bank Transfers.",
    },
    {
      question: "How can I return or exchange an item?",
      answer:
        "We offer a hassle-free 7-day return and exchange policy. Simply visit our Returns page or reach out to our support team on WhatsApp with your Order ID to initiate a request.",
    },
    {
      question: "Is Cash on Delivery (COD) available?",
      answer:
        "Yes! Cash on Delivery is available for all orders across every city and doorstep location in Pakistan without any extra hidden charges.",
    },
    {
      question: "How can I track my active order status?",
      answer:
        "Once your order is dispatched, you will receive a tracking link via SMS and email. You can also track your order directly from your Clothing Outfits account dashboard.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="shopmate-section-contfaq">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-contfaq">
            <Sparkles size={14} /> GOT QUESTIONS?
          </span>
          <h2 className="shopmate-heading-contfaq">Frequently Asked Questions</h2>
          <p className="shopmate-subtitle-contfaq">
            Find quick answers to common queries about delivery, payment methods, returns, and order tracking.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="row justify-content-center">
          <div className="col-lg-8 col-12">
            <div className="shopmate-accordion-wrap-contfaq">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`shopmate-faq-item-contfaq ${
                      isOpen ? "active-contfaq" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="shopmate-faq-btn-contfaq"
                      aria-expanded={isOpen}
                    >
                      <span className="shopmate-faq-question-contfaq">
                        <HelpCircle size={18} className="shopmate-icon-contfaq" />
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shopmate-chevron-contfaq ${
                          isOpen ? "rotate-contfaq" : ""
                        }`}
                      />
                    </button>

                    {/* Content is always in DOM, height transitioned smoothly via CSS */}
                    <div className="shopmate-faq-collapse-contfaq">
                      <div className="shopmate-faq-body-contfaq">
                        <p>{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}