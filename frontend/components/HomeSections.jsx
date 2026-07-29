"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { FadeIn, HeroMotion } from "@/components/Animated";
import GoogleReviewsCarousel from "@/components/GoogleReviewsCarousel";
import MenuExplorer from "@/components/MenuExplorer";
import { WhatsAppIcon, InstagramIcon } from "@/components/BrandIcons";
import { useEditableContent } from "@/components/useEditableContent";
import { digitsOnly, safeExternalUrl } from "@/lib/safeUrl";

const signatureImages = [
  { src: "/food-thakali.JPG", title: "Thakali Thali", text: "Rice, dal, achar, curry, and mountain comfort." },
  { src: "/food-momo.JPG", title: "Momo & Jhol", text: "Soft dumplings with bold Himalayan chutney and gravy." },
  { src: "/nepal-culture-collage.jpg", title: "Nepalese Soul", text: "Culture, craft, temples, textiles, and warm hospitality." }
];

const LAPHING_BANNER_KEY = "yak-yeti-laphing-banner-seen-v1";

function ZomatoBadge({ href, compact = false }) {
  return (
    <a
      href={safeExternalUrl(href)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-[#e23744] font-bold text-white shadow-[0_18px_38px_rgba(226,55,68,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#cb202d] ${compact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm"}`}
      aria-label="Yak & Yeti's available on Zomato"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-base font-black tracking-[-0.08em] text-[#e23744]">
        z
      </span>
      <span>Available on Zomato</span>
    </a>
  );
}

function LinkPill({ href, children, tone = "light", className = "" }) {
  const safeHref = safeExternalUrl(href);
  const styles =
    tone === "dark"
      ? "bg-[#15120f] text-white hover:bg-cedar"
      : tone === "outline"
        ? "border border-cedar/12 bg-white/70 text-cedar hover:border-cedar/24 hover:bg-white"
        : "bg-white text-cedar hover:bg-clay";

  return (
    <a
      href={safeHref}
      target={safeHref.startsWith("http") ? "_blank" : undefined}
      rel={safeHref.startsWith("http") ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold shadow-[0_12px_30px_rgba(43,25,13,0.08)] transition duration-300 hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
    </a>
  );
}

function FloatingDish({ src, alt, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`yy-float absolute overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_76px_rgba(54,31,15,0.16)] ${className}`}
    >
      <Image src={src} alt={alt} fill priority sizes="(min-width: 768px) 22vw, 44vw" className="object-cover saturate-[1.08]" />
    </motion.div>
  );
}

export function LaphingLaunchBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(LAPHING_BANNER_KEY)) return;
      setVisible(true);
      window.localStorage.setItem(LAPHING_BANNER_KEY, "true");
    } catch {
      setVisible(true);
    }

    const timer = window.setTimeout(() => setVisible(false), 10000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-x-0 top-20 z-[60] mx-auto flex w-full max-w-3xl justify-center px-4"
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.96 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="yy-shimmer relative flex w-full items-center gap-4 overflow-hidden rounded-[2rem] border border-white/60 bg-white/82 p-4 pr-12 shadow-[0_24px_70px_rgba(45,27,14,0.18)] backdrop-blur-2xl sm:p-5 sm:pr-14"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-[#15120f]/8 text-lg font-black leading-none text-[#15120f] transition hover:bg-[#15120f] hover:text-white"
          aria-label="Close Laphing announcement"
        >
          x
        </button>
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.65rem] bg-[#f7e2bd] shadow-inner ring-1 ring-[#8d5e2e]/10 sm:h-28 sm:w-28">
          <Image
            src="/laphing-cat.png"
            alt="Happy illustrated cat holding a tray of food"
            fill
            sizes="112px"
            className="yy-cat-head object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-extrabold tracking-[0.08em] text-ember">New At Yak &amp; Yeti&apos;s</p>
          <p className="mt-1 text-2xl font-extrabold leading-tight tracking-[-0.045em] text-[#15120f] sm:text-4xl">
            Laphing Is Available Now
          </p>
          <p className="mt-1 text-sm font-semibold text-cedar/58">Cool, Spicy, Tangy Himalayan Street Comfort.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const { business, hero } = useEditableContent();
  const whatsappUrl = `https://wa.me/${digitsOnly(business.whatsapp)}?text=${encodeURIComponent("Namaste Yak & Yeti's, I would like to order from the menu.")}`;
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -90]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.94]);

  return (
    <section className="relative isolate min-h-[calc(100svh-66px)] overflow-hidden bg-[#f7f2ea]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_3%,rgba(217,154,56,0.28),transparent_30rem),radial-gradient(circle_at_88%_12%,rgba(67,114,109,0.18),transparent_34rem),linear-gradient(180deg,#fff_0%,#f7f2ea_78%)]" />
      <div className="absolute inset-x-0 top-0 h-[52%] overflow-hidden opacity-20">
        <Image src="/nepal-culture-collage.jpg" alt="Nepalese mountains, people, temples, and prayer wheels" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/72 via-white/86 to-[#f7f2ea]" />
      </div>

      <motion.div style={{ y: heroY, scale: heroScale }} className="relative mx-auto grid min-h-[calc(100svh-66px)] max-w-7xl place-items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 mx-auto max-w-7xl">
          <FloatingDish src="/food-thakali.JPG" alt="Thakali thali" delay={0.2} className="-left-10 top-[5%] h-32 w-36 sm:-left-8 sm:h-44 sm:w-52 lg:-left-14 lg:h-52 lg:w-60" />
          <FloatingDish src="/food-momo.JPG" alt="Jhol momo" delay={0.34} className="-right-10 top-[6%] h-36 w-36 rounded-full sm:-right-8 sm:h-52 sm:w-52 lg:-right-16 lg:h-64 lg:w-64" />
          <FloatingDish src="/food-sekuwa.JPG" alt="Chicken sadeko and sekuwa" delay={0.48} className="bottom-[2%] left-0 h-32 w-44 sm:h-40 sm:w-60 lg:-left-8 lg:h-48 lg:w-72" />
          <FloatingDish src="/food-cold-coffee.JPG" alt="Cold coffee" delay={0.62} className="bottom-[3%] right-0 h-32 w-32 sm:h-44 sm:w-44 lg:-right-8 lg:h-52 lg:w-52" />
        </div>

        <HeroMotion className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-cedar/10 bg-white/72 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-ember shadow-sm backdrop-blur">
            {hero.eyebrow}
          </p>
          <h1 className="text-balance text-[clamp(3.3rem,10vw,8.5rem)] font-extrabold leading-[0.88] tracking-[-0.055em] text-[#15120f]">
            {hero.title}
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-balance text-xl font-medium leading-8 text-cedar/68 sm:text-2xl lg:text-3xl lg:leading-10">
            {hero.description}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkPill href="#menu" tone="dark">Explore Menu</LinkPill>
            <ZomatoBadge href={business.zomato} />
            <LinkPill href={business.maps} tone="outline">Google Maps</LinkPill>
          </div>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkPill href={whatsappUrl} tone="outline" className="gap-2">
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              WhatsApp Order
            </LinkPill>
            <LinkPill href="#reviews" tone="outline">See Reviews</LinkPill>
          </div>
        </HeroMotion>
      </motion.div>
    </section>
  );
}

export function HighlightsSection() {
  return (
    <section className="overflow-hidden bg-[#f7f2ea] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <h2 className="mt-4 text-balance text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] text-[#15120f] sm:text-7xl">
            Authentic Himalayan Taste
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-cedar/64">
            From thali to momo, every dish carries the comfort of Nepal.
          </p>
        </FadeIn>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {signatureImages.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08} className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_26px_70px_rgba(48,28,14,0.11)] sm:min-h-[430px]">
              <Image src={item.src} alt={item.title} fill sizes="(min-width: 1024px) 31vw, 92vw" className="object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
                <h3 className="text-4xl font-extrabold leading-none tracking-[-0.045em]">{item.title}</h3>
                <p className="mt-3 max-w-sm text-base font-medium leading-7 text-white/78">{item.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MenuSection() {
  const { business, menu, menuText } = useEditableContent();

  return (
    <section id="menu" className="bg-[#f7f2ea] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-ember">{menuText.eyebrow}</p>
          <h2 className="mt-4 text-balance text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] text-[#15120f] sm:text-7xl">
            {menuText.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-medium leading-8 text-cedar/64">{menuText.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cedar/10 bg-white/78 px-4 py-2 text-sm font-bold text-cedar shadow-sm"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Veg</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cedar/10 bg-white/78 px-4 py-2 text-sm font-bold text-cedar shadow-sm"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Non-Veg</span>
            <ZomatoBadge href={business.zomato} compact />
          </div>
        </FadeIn>
        <MenuExplorer menuItems={menu} />
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const { business } = useEditableContent();

  return (
    <section id="reviews" className="relative overflow-hidden bg-[#f7f2ea] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="rounded-[2.5rem] bg-[#111] px-5 py-12 text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)] sm:px-9 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs font-extrabold tracking-[0.08em] text-turmeric">Authentic Taste. Authentic Reviews.</p>
            <h2 className="mt-4 text-balance text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
              Authentic Taste. Authentic Reviews.
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkPill href={business.reviewLink}>Review on Google</LinkPill>
              <LinkPill href={business.maps}>Open Maps</LinkPill>
            </div>
          </div>
          <GoogleReviewsCarousel reviewLink={business.reviewLink} />
        </FadeIn>
      </div>
    </section>
  );
}

export function ReviewQrSection() {
  const { business } = useEditableContent();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=14&data=${encodeURIComponent(business.reviewLink)}`;

  return (
    <section id="review-qr" className="bg-[#f7f2ea] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="grid overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/80 shadow-[0_28px_80px_rgba(50,30,17,0.11)] backdrop-blur lg:grid-cols-[1fr_0.72fr]">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-ember">Google Reviews</p>
            <h2 className="mt-4 max-w-2xl text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] text-[#15120f] sm:text-6xl">
              Scan. Review. Help others discover the momo.
            </h2>
            <p className="mt-5 max-w-xl text-base font-medium leading-7 text-cedar/64">
              A clean QR moment for tables, counters, and quick feedback after a warm meal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkPill href={business.reviewLink} tone="dark">Open Review Link</LinkPill>
              <ZomatoBadge href={business.zomato} />
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#15120f] p-8">
            <a href={safeExternalUrl(business.reviewLink)} target="_blank" rel="noreferrer" className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <Image src={qrUrl} alt="QR code for Yak & Yeti's Google reviews" width={280} height={280} unoptimized className="h-60 w-60 sm:h-72 sm:w-72" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function ContactSection() {
  const { business } = useEditableContent();
  const whatsappUrl = `https://wa.me/${digitsOnly(business.whatsapp)}?text=${encodeURIComponent("Namaste Yak & Yeti's, I would like to order from the menu.")}`;

  return (
    <section id="contact" className="bg-[#f7f2ea] px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <FadeIn className="rounded-[2.5rem] border border-black/5 bg-white/80 p-8 shadow-[0_26px_76px_rgba(48,28,14,0.1)] backdrop-blur sm:p-12">
          <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-ember">Find us fast</p>
          <h2 className="mt-4 text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] text-[#15120f] sm:text-6xl">
            Order, review, or navigate in one touch.
          </h2>
          <p className="mt-5 text-lg font-medium leading-8 text-cedar/64">{business.hours}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkPill href={whatsappUrl} tone="dark" className="gap-2">
              <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
              {business.phone}
            </LinkPill>
            <LinkPill href={business.instagram} tone="outline" className="gap-2">
              <InstagramIcon className="h-5 w-5 text-[#C13584]" />
              Instagram
            </LinkPill>
            <ZomatoBadge href={business.zomato} />
          </div>
        </FadeIn>

        <FadeIn delay={0.08} className="relative min-h-[410px] overflow-hidden rounded-[2.5rem] border border-black/5 bg-[#efe3d2] shadow-[0_26px_76px_rgba(48,28,14,0.1)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(42deg,#efe5d8_0_26px,#dfcfbe_27px_28px),linear-gradient(135deg,#faf8f4,#e9dac8)]" />
          <div className="absolute left-[44%] top-[48%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e23744] shadow-[0_0_0_12px_rgba(226,55,68,0.12)]" />
          <div className="absolute left-[44%] top-[48%] h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e23744]/25 [animation:yy-pulse-ring_2.4s_ease-out_infinite]" />
          <div className="absolute bottom-6 left-6 right-6 rounded-[1.8rem] bg-white/88 p-5 shadow-[0_18px_44px_rgba(43,25,13,0.12)] backdrop-blur">
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-ember">Google Maps</p>
            <p className="mt-2 text-2xl font-extrabold tracking-[-0.045em] text-[#15120f]">{business.address}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <LinkPill href={business.maps} tone="dark">Open Google Maps</LinkPill>
              <LinkPill href="/contact" tone="outline">Contact Page</LinkPill>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
