import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FadeIn } from "@/components/Animated";
import { business } from "@/data/site";
import { digitsOnly, safeExternalUrl } from "@/lib/safeUrl";

export const metadata = {
  title: "Contact",
  description: "Contact Yak & Yeti's for WhatsApp orders, Instagram, Google Maps directions, and cafe details."
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${digitsOnly(business.whatsapp)}?text=${encodeURIComponent("Namaste Yak & Yeti's, I would like cafe details and menu help.")}`;

  return (
    <>
      <Header />
      <main className="bg-[#f5f1ea]">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-16 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember">Contact</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.055em] text-[#15120f] sm:text-7xl">Find us fast.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-cedar/66">Maps, Zomato, WhatsApp, Instagram, and Google reviews stay easy to reach from every screen.</p>
        </section>

        <FadeIn className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <section className="rounded-[2rem] bg-[#15120f] p-8 text-white shadow-[0_32px_90px_rgba(0,0,0,0.18)] sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-turmeric">Yak & Yeti&apos;s</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Come for coffee. Stay for momos.</h2>
            <p className="mt-5 text-white/64">{business.hours}</p>
            <div className="mt-8 space-y-4 text-sm">
              <a href={`tel:${business.phone}`} className="block rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">
                <span className="block text-white/46">Phone</span>
                <span className="mt-1 block font-bold">{business.phone}</span>
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer" className="block rounded-2xl bg-ember p-4 font-bold text-white transition hover:bg-turmeric hover:text-cedar">
                Order or ask on WhatsApp
              </a>
              <a href={safeExternalUrl(business.instagram)} target="_blank" rel="noreferrer" className="block rounded-2xl bg-white/8 p-4 transition hover:bg-white/12">
                <span className="block text-white/46">Instagram</span>
                <span className="mt-1 block font-bold">@yakkandyetii</span>
              </a>
              <a href={safeExternalUrl(business.zomato)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-[#e23744] p-4 font-bold text-white transition hover:bg-[#cb202d]">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white font-black tracking-[-0.08em] text-[#e23744]">z</span>
                Available on Zomato
              </a>
            </div>
          </section>

          <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_24px_70px_rgba(42,30,21,0.1)]">
            <div className="p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember">Google Map</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[#15120f]">Directions in one tap.</h2>
              <p className="mt-3 text-sm leading-6 text-cedar/68">Use Google Maps for the most accurate directions and live location details.</p>
            </div>
            <div className="aspect-[4/3] border-y border-cedar/10 bg-clay">
              <iframe
                title="Yak & Yeti's Google map"
                src="https://www.google.com/maps?q=Yak%20%26%20Yeti%27s&output=embed"
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-3 p-6 sm:flex-row sm:p-8">
              <a href={safeExternalUrl(business.maps)} target="_blank" rel="noreferrer" className="rounded-full bg-cedar px-5 py-3 text-center text-sm font-bold text-linen transition hover:bg-ember">
                Open Google Maps
              </a>
              <a href={safeExternalUrl(business.reviewLink)} target="_blank" rel="noreferrer" className="rounded-full border border-cedar/20 px-5 py-3 text-center text-sm font-bold text-cedar transition hover:border-ember hover:text-ember">
                Leave a Google Review
              </a>
            </div>
          </section>
        </FadeIn>
      </main>
      <Footer />
    </>
  );
}
