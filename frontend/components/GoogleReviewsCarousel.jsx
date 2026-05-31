"use client";

import { useEffect, useMemo, useState } from "react";
import { safeExternalUrl } from "@/lib/safeUrl";

function loadGoogleMaps(apiKey) {
  if (typeof window === "undefined") return Promise.reject(new Error("Browser only"));
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google);

  const existing = document.querySelector("script[data-google-maps='true']");
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function fetchClientPlacesReviews() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return null;

  const google = await loadGoogleMaps(apiKey);
  const { Place } = await google.maps.importLibrary("places");
  const place = new Place({ id: placeId });
  await place.fetchFields({
    fields: ["displayName", "rating", "userRatingCount", "reviews", "googleMapsURI"]
  });

  return {
    rating: place.rating,
    total: place.userRatingCount,
    placeUrl: place.googleMapsURI,
    reviews: (place.reviews || [])
      .map((review) => ({
        name: review.authorAttribution?.displayName || "Google reviewer",
        rating: String(review.rating || ""),
        text: review.text || "",
        relativeTime: review.relativePublishTimeDescription || "",
        url: review.authorAttribution?.uri || place.googleMapsURI || ""
      }))
      .filter((review) => review.text)
  };
}

export default function GoogleReviewsCarousel({ reviewLink }) {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState(null);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState(0);
  const safeReviewLink = safeExternalUrl(meta?.placeUrl || reviewLink);

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      try {
        const response = await fetch("/api/google-reviews");
        const data = await response.json();
        if (data.reviews?.length) {
          if (!isMounted) return;
          setReviews(data.reviews);
          setMeta({ rating: data.rating, total: data.total, placeUrl: data.placeUrl });
          return;
        }

        const clientData = await fetchClientPlacesReviews();
        if (!isMounted) return;
        if (clientData?.reviews?.length) {
          setReviews(clientData.reviews);
          setMeta({ rating: clientData.rating, total: clientData.total, placeUrl: clientData.placeUrl });
          return;
        }

        setMessage(data.message || "Google reviews could not be loaded yet.");
      } catch (error) {
        if (isMounted) setMessage(error?.message || "Google reviews could not be loaded yet.");
      }
    }

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const visibleReview = reviews[active] || reviews[0];
  const stars = useMemo(() => "★★★★★".slice(0, Math.round(Number(visibleReview?.rating || 0))), [visibleReview]);

  if (!reviews.length) {
    return (
      <div className="mt-12 rounded-[2rem] border border-black/5 bg-[#15120f] p-7 text-white shadow-[0_24px_70px_rgba(42,30,21,0.16)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-turmeric">Google reviews</p>
        <p className="mt-4 text-3xl font-semibold tracking-[-0.045em]">See what guests are saying.</p>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
          Google reviews are currently available through Google Maps while the live review feed is being connected.
        </p>
        <a href={safeExternalUrl(reviewLink)} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#15120f]">
          Open Google reviews
        </a>
      </div>
    );
  }

  return (
    <div className="mt-12 overflow-hidden rounded-[2.25rem] border border-black/5 bg-[#15120f] shadow-[0_30px_90px_rgba(0,0,0,0.16)]">
      <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
        <div className="bg-[#f8f3eb] p-7 text-[#15120f] sm:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ember">Google rating</p>
          <p className="mt-5 text-6xl font-semibold tracking-[-0.06em]">{meta?.rating || visibleReview.rating}</p>
          <p className="mt-2 text-sm font-semibold text-cedar/60">{meta?.total ? `${meta.total} Google reviews` : "Google reviews"}</p>
          <a href={safeReviewLink} target="_blank" rel="noreferrer" className="mt-8 inline-flex rounded-full bg-[#15120f] px-5 py-3 text-sm font-semibold text-white">
            View on Google
          </a>
        </div>

        <div className="relative p-7 text-white sm:p-9">
          <div className="min-h-72">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-turmeric">{stars || "★★★★★"}</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Google</span>
            </div>
            <p className="mt-8 text-3xl font-semibold leading-tight tracking-[-0.045em]">&ldquo;{visibleReview.text}&rdquo;</p>
            <p className="mt-8 text-sm font-semibold text-white/62">{visibleReview.name}{visibleReview.relativeTime ? ` • ${visibleReview.relativeTime}` : ""}</p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {reviews.map((review, index) => (
                <button
                  key={`${review.name}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`h-2.5 rounded-full transition-all ${index === active ? "w-8 bg-turmeric" : "w-2.5 bg-white/24"}`}
                  aria-label={`Show review ${index + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setActive((active - 1 + reviews.length) % reviews.length)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-lg font-semibold text-white transition hover:bg-white/20" aria-label="Previous review">
                ‹
              </button>
              <button type="button" onClick={() => setActive((active + 1) % reviews.length)} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-lg font-semibold text-white transition hover:bg-white/20" aria-label="Next review">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
