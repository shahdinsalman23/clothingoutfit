import ContactFaqSection from "@/components/contact/ContactFaqSection";
import ContactHeroSection from "@/components/contact/ContactHeroSection";
import ContactMainSection from "@/components/contact/ContactMainSection";
import LocationMapSection from "@/components/contact/LocationMapSection";
import QuickHelpSection from "@/components/contact/QuickHelpSection";

export const metadata = {
  title: "Contact Us | ShopMate",
  description: "Get in touch with ShopMate. We are available 24/7 to assist you.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactMainSection />
      <QuickHelpSection />
      <ContactFaqSection/>
      <LocationMapSection/>
    </>
  );
}