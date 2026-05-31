"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FadeIn, HeroMotion } from "@/components/Animated";
import MenuExplorer from "@/components/MenuExplorer";
import { useEditableContent } from "@/components/useEditableContent";
import { digitsOnly, safeExternalUrl } from "@/lib/safeUrl";

function ZomatoBadge({ href, compact = false }) {
  return (
    <a
      href={safeExternalUrl(href)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-[#e23744] font-semibold text-white shadow-[0_18px_38px_rgba(226,55,68,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#cb202d] ${compact ? "px-4 py-2 text-xs" : "px-5 py-3 text-sm"}`}
      aria-label="Yak & Yeti's available on Zomato"
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-base font-black tracking-[-0.08em] text-[#e23744]">
        z
      </span>
      <span>Available on Zomato</span>
    </a>
  );
}

function LinkPill({ href, children, tone = "light" }) {
  const safeHref = safeExternalUrl(href);
  const styles =
    tone === "dark"
      ? "bg-cedar text-white hover:bg-ember"
      : tone === "outline"
        ? "border border-cedar/12 bg-white/70 text-cedar hover:border-ember hover:text-ember"
        : "bg-white text-cedar hover:bg-clay";

  return (
    <a
      href={safeHref}
      target={safeHref.startsWith("http") ? "_blank" : undefined}
      rel={safeHref.startsWith("http") ? "noreferrer" : undefined}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition duration-300 hover:-translate-y-0.5 ${styles}`}
    >
      {children}
    </a>
  );
}

export function Hero() {
  const { business, hero } = useEditableContent();
  const whatsappUrl = `https://wa.me/${digitsOnly(business.whatsapp)}?text=${encodeURIComponent("Namaste Yak & Yeti's, I would like to order from the menu.")}`;

  return (
    <section className="relative isolate overflow-hidden bg-[#f5f1ea]">
      <div className="absolute inset-x-0 top-0 h-[72%] bg-[linear-gradient(180deg,#ffffff_0%,#f5f1ea_100%)]" />
      <div className="absolute inset-x-0 top-0 h-[64%] overflow-hidden">
        <Image
          src="/nepal-culture-collage.jpg"
          alt="Nepalese mountains, people, temples, and prayer wheels"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/64 via-white/74 to-[#f5f1ea]" />
      </div>

      <div className="relative mx-auto min-h-[calc(100vh-76px)] max-w-7xl px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <HeroMotion className="mx-auto max-w-5xl text-center">
          <p className="mx-auto mb-5 inline-flex rounded-full border border-cedar/10 bg-white/74 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-ember shadow-sm backdrop-blur">
            {hero.eyebrow}
          </p>
          <h1 className="text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.055em] text-[#15120f] sm:text-7xl lg:text-8xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-cedar/70 sm:text-xl">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkPill href="#menu" tone="dark">View Menu</LinkPill>
            <ZomatoBadge href={business.zomato} />
            <LinkPill href={safeExternalUrl(business.maps)} tone="outline">Google Maps</LinkPill>
          </div>
        </HeroMotion>

        <HeroMotion className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-3">
          <div className="grid min-h-80 grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-[2rem] border border-black/5 bg-white p-2 shadow-[0_36px_90px_rgba(33,25,18,0.16)]">
            {hero.foodImages.slice(0, 4).map(({ src, alt }) => (
              <div key={src} className="relative overflow-hidden rounded-[1.45rem]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  priority
                  sizes="(min-width: 768px) 16vw, 45vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex min-h-80 flex-col justify-end rounded-[2rem] bg-[#15120f] p-7 text-white shadow-[0_24px_70px_rgba(0,0,0,0.2)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-turmeric">{hero.signatureLabel}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{hero.signatureTitle}</h2>
            <p className="mt-4 text-sm leading-6 text-white/68">{hero.signatureDescription}</p>
          </div>
          <div className="relative min-h-80 overflow-hidden rounded-[2rem] border border-black/5 bg-cedar shadow-[0_24px_70px_rgba(61,42,31,0.18)]">
            <Image
              src="/nepal-culture-collage.jpg"
              alt="Nepal cultural imagery"
              fill
              sizes="(min-width: 768px) 33vw, 90vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cedar/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-sm font-semibold leading-6 text-white">{hero.cultureCaption}</p>
          </div>
        </HeroMotion>
      </div>
    </section>
  );
}

export function MenuSection() {
  const { business, menu, menuText } = useEditableContent();

  return (
    <section id="menu" className="bg-[#f5f1ea] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember">{menuText.eyebrow}</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[#15120f] sm:text-6xl">{menuText.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-cedar/66">
            {menuText.description}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-cedar/10 bg-white px-4 py-2 text-sm font-semibold text-cedar shadow-sm"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Veg</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cedar/10 bg-white px-4 py-2 text-sm font-semibold text-cedar shadow-sm"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Non-Veg</span>
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
  const [googleReviews, setGoogleReviews] = useState([]);
  const [reviewMeta, setReviewMeta] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    fetch("/api/google-reviews")
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;
        setGoogleReviews(data.reviews || []);
        setReviewMeta({ rating: data.rating, total: data.total, placeUrl: data.placeUrl });
        setReviewMessage(data.message || "");
      })
      .catch(() => {
        if (isMounted) setReviewMessage("Unable to load Google reviews right now.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="reviews" className="relative overflow-hidden bg-white py-20">
      <div className="absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,#f5f1ea_0%,#ffffff_100%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-ember">Reviews</p>
            <h2 className="mt-3 text-5xl font-semibold tracking-[-0.05em] text-[#15120f] sm:text-6xl">Real words from Google.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-cedar/64">
              {reviewMeta?.rating ? `Rated ${reviewMeta.rating} on Google from ${reviewMeta.total || "guest"} reviews.` : "Read the latest guest feedback directly from Google."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <LinkPill href={business.reviewLink} tone="dark">Review on Google</LinkPill>
            <LinkPill href={business.maps} tone="outline">Open Maps</LinkPill>
          </div>
        </FadeIn>

        {googleReviews.length > 0 ? (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr_1fr]">
            {googleReviews.slice(0, 3).map((review, index) => (
              <FadeIn
                key={`${review.name}-${index}`}
                delay={index * 0.08}
                className={`rounded-[2rem] border border-black/5 p-7 shadow-[0_24px_70px_rgba(42,30,21,0.09)] ${index === 1 ? "bg-[#15120f] text-white lg:-mt-6" : "bg-[#f8f3eb] text-cedar"}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <p className={`text-sm font-semibold ${index === 1 ? "text-turmeric" : "text-ember"}`}>{review.rating} ★★★★★</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${index === 1 ? "bg-white/10 text-white/70" : "bg-white text-cedar/60"}`}>Google</span>
                </div>
                <p className={`mt-8 text-2xl font-semibold leading-9 tracking-[-0.035em] ${index === 1 ? "text-white" : "text-[#18120f]"}`}>&ldquo;{review.text}&rdquo;</p>
                <p className={`mt-8 text-sm font-semibold ${index === 1 ? "text-white/68" : "text-cedar/62"}`}>{review.name}{review.relativeTime ? ` • ${review.relativeTime}` : ""}</p>
              </FadeIn>
            ))}
          </div>
        ) : (
          <FadeIn className="mt-12 rounded-[2rem] border border-black/5 bg-[#f8f3eb] p-7 text-cedar shadow-[0_24px_70px_rgba(42,30,21,0.09)]">
            <p className="text-lg font-semibold text-[#15120f]">Google reviews are ready to connect.</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-cedar/64">
              {reviewMessage || "Set GOOGLE_MAPS_API_KEY and GOOGLE_PLACE_ID in Vercel to show live Google reviews here."}
            </p>
            <a href={safeExternalUrl(business.reviewLink)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-[#15120f] px-5 py-3 text-sm font-semibold text-white">
              Open Google reviews
            </a>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

export function ReviewQrSection() {
  const { business } = useEditableContent();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=14&data=${encodeURIComponent(business.reviewLink)}`;

  return (
    <section id="review-qr" className="bg-white pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="grid overflow-hidden rounded-[2.25rem] border border-black/5 bg-[#15120f] text-white shadow-[0_36px_100px_rgba(0,0,0,0.2)] lg:grid-cols-[1fr_0.82fr]">
          <div className="p-8 sm:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-turmeric">Google Reviews</p>
            <h2 className="mt-3 max-w-2xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">Scan. Review. Help others discover the momo.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/64">Designed for table tents and counters: the QR code links guests directly to the Google review path.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkPill href={business.reviewLink}>Open Review Link</LinkPill>
              <ZomatoBadge href={business.zomato} />
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#f5f1ea] p-8">
            <a href={safeExternalUrl(business.reviewLink)} target="_blank" rel="noreferrer" className="rounded-[2rem] border border-black/5 bg-white p-5 shadow-[0_20px_60px_rgba(42,30,21,0.12)]">
              <Image src={qrUrl} alt="QR code for Yak & Yeti's Google reviews" width={280} height={280} unoptimized className="h-60 w-60 sm:h-72 sm:w-72" />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
