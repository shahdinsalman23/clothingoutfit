import { Globe, Share2, Mail, Sparkles } from "lucide-react";

export default function MeetTeamSection() {
  const teamMembers = [
    {
      id: 1,
      name: "Muhammad Ali",
      role: "Founder & CEO",
      bio: "Passionate about building scalable e-commerce infrastructure and delivering unmatched shopping experiences.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
      website: "#",
      share: "#",
      email: "ali@shopmate.pk",
    },
    {
      id: 2,
      name: "Ayesha Ahmed",
      role: "Head of Product & Operations",
      bio: "Oversees product curation, strict quality assurance, and end-to-end warehouse logistics across Pakistan.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      website: "#",
      share: "#",
      email: "ayesha@shopmate.pk",
    },
    {
      id: 3,
      name: "Hamza Malik",
      role: "Lead Tech Architect",
      bio: "Drives platform innovation, ensuring lightning-fast search performance and secure checkout systems.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
      website: "#",
      share: "#",
      email: "hamza@shopmate.pk",
    },
    {
      id: 4,
      name: "Zainab Fatima",
      role: "Customer Happiness Lead",
      bio: "Ensures every customer query is handled with genuine care and swift 24/7 resolution.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
      website: "#",
      share: "#",
      email: "zainab@shopmate.pk",
    },
  ];

  return (
    <section className="shopmate-section-teammain">
      <div className="container position-relative">
        {/* Section Header */}
        <div className="text-center mb-5">
          <span className="shopmate-eyebrow-teammain">
            <Sparkles size={14} /> THE PEOPLE BEHIND SHOPMATE
          </span>
          <h2 className="shopmate-heading-teammain">Meet our leadership team</h2>
          <p className="shopmate-subtitle-teammain">
            A dedicated group of passionate individuals working round-the-clock to build Pakistan's most trusted online shopping destination.
          </p>
        </div>

        {/* Team Grid */}
        <div className="row g-4 shopmate-row-teammain">
          {teamMembers.map((member) => (
            <div key={member.id} className="col-lg-3 col-md-6 col-12">
              <div className="shopmate-card-teammain">
                <div className="shopmate-image-wrap-teammain">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="shopmate-img-teammain"
                  />
                  <div className="shopmate-overlay-teammain">
                    <div className="shopmate-socials-teammain">
                      <a href={member.website} aria-label="Website" target="_blank" rel="noreferrer">
                        <Globe size={18} />
                      </a>
                      <a href={member.share} aria-label="Share" target="_blank" rel="noreferrer">
                        <Share2 size={18} />
                      </a>
                      <a href={`mailto:${member.email}`} aria-label="Email">
                        <Mail size={18} />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shopmate-content-teammain">
                  <span className="shopmate-badge-teammain">{member.role}</span>
                  <h3 className="shopmate-name-teammain">{member.name}</h3>
                  <p className="shopmate-bio-teammain">{member.bio}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}