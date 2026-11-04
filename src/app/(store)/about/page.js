import AboutCtaSection from "@/components/about/AboutCtaSection";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import AboutStatsSection from "@/components/about/AboutStatsSection";
import CoreValuesSection from "@/components/about/CoreValuesSection";
import MeetTeamSection from "@/components/about/MeetTeamSection";
import OurStorySection from "@/components/about/OurStorySection";
import WhyChooseUsSection from "@/components/about/WhyChooseUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export const metadata = {
  title: "About Us | ShopMate",
  description: "Learn more about Clothing Outfits - Redefining Modern Shopping in Pakistan.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <OurStorySection/>
      <CoreValuesSection />
      <AboutStatsSection/>
      <WhyChooseUsSection/>
      <MeetTeamSection/>
      <TestimonialsSection/>
      <AboutCtaSection/>
    </>
  );
}