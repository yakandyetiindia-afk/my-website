"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { InstagramIcon, WhatsAppIcon } from "@/components/BrandIcons";
import { useEditableContent } from "@/components/useEditableContent";
import { digitsOnly, safeExternalUrl } from "@/lib/safeUrl";

export default function ContactPage() {
  const { business } = useEditableContent();
  const whatsappUrl = `https://wa.me/${digitsOnly(business.whatsapp)}?text=${encodeURIComponent("Namaste Yak & Yeti's, I would like to order from the menu.")}`;

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#15120f]">
      <Header />
      <section className="relative isolate overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_4%,rgba(217,154,56,0.24),transparent_30rem),radial-gradient(circle_at_84%_16%,rgba(63,114,109,0.14),transparent_34rem)]" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-ember">Contact</p>
            <h1 className="mt-4 text-balance text-6xl font-extrabold leading-[0.9] tracking-[-0.06em] sm:text-8xl">
              Find Yak & Yeti&apos;s fast.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-medium leading-8 text-cedar/64">
              Order on WhatsApp, open Google Maps, follow Instagram, or jump to Zomato.
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="rounded-[2.5rem] border border-black/5 bg-white/82 p-8 shadow-[0_28px_80px_rgba(50,30,17,0.11)] backdrop-blur sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-ember">Social</p>
              <div className="mt-6 grid gap-3">
                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[1.5rem] border border-black/5 bg-[#f7f2ea] p-4 text-lg font-extrabold transition hover:-translate-y-0.5 hover:bg-white">
                  <WhatsAppIcon className="h-7 w-7 text-[#25D366]" />
                  <span>{business.phone}</span>
                </a>
                <a href={safeExternalUrl(business.instagram)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[1.5rem] border border-black/5 bg-[#f7f2ea] p-4 text-lg font-extrabold transition hover:-translate-y-0.5 hover:bg-white">
                  <InstagramIcon className="h-7 w-7 text-[#C13584]" />
                  <span>Instagram</span>
                </a>
                <a href={safeExternalUrl(business.zomato)} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-[1.5rem] bg-[#e23744] p-4 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#cb202d]">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white font-black tracking-[-0.08em] text-[#e23744]">z</span>
                  <span>Available on Zomato</span>
                </a>
              </div>
              <div className="mt-8 rounded-[1.5rem] bg-[#15120f] p-5 text-white">
                <p className="text-sm font-bold text-white/54">Hours</p>
                <p className="mt-2 text-xl font-extrabold tracking-[-0.03em]">{business.hours}</p>
              </div>
            </div>

            <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] border border-black/5 bg-[#efe3d2] shadow-[0_28px_80px_rgba(50,30,17,0.11)]">
              <div className="absolute inset-0 bg-[repeating-linear-gradient(42deg,#efe5d8_0_26px,#dfcfbe_27px_28px),linear-gradient(135deg,#faf8f4,#e9dac8)]" />
              <div className="absolute left-[45%] top-[46%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e23744] shadow-[0_0_0_14px_rgba(226,55,68,0.12)]" />
              <div className="absolute left-[45%] top-[46%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e23744]/25 [animation:yy-pulse-ring_2.4s_ease-out_infinite]" />
              <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] bg-white/90 p-6 shadow-[0_18px_44px_rgba(43,25,13,0.12)] backdrop-blur">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-ember">Google Maps</p>
                <h2 className="mt-3 text-4xl font-extrabold tracking-[-0.05em]">Open directions.</h2>
                <p className="mt-3 text-base font-medium leading-7 text-cedar/62">{business.address}</p>
                <a href={safeExternalUrl(business.maps)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[#15120f] px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-cedar">
                  Open Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
