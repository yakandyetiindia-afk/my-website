import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Hero, MenuSection, ReviewsSection, ReviewQrSection } from "@/components/HomeSections";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MenuSection />
        <ReviewsSection />
        <ReviewQrSection />
      </main>
      <Footer />
    </>
  );
}
