import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  ContactSection,
  Hero,
  HighlightsSection,
  LaphingLaunchBanner,
  MenuSection,
  ReviewQrSection,
  ReviewsSection
} from "@/components/HomeSections";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linen text-smoke">
      <LaphingLaunchBanner />
      <Header />
      <Hero />
      <HighlightsSection />
      <MenuSection />
      <ReviewsSection />
      <ReviewQrSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
