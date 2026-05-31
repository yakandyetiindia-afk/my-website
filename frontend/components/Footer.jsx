"use client";

import Link from "next/link";
import { useEditableContent } from "@/components/useEditableContent";
import { safeExternalUrl } from "@/lib/safeUrl";
import { InstagramIcon, WhatsAppIcon } from "@/components/BrandIcons";

export default function Footer() {
  const { business } = useEditableContent();

  return (
    <footer className="border-t border-black/5 bg-[#f5f1ea] text-cedar">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-3xl font-semibold tracking-[-0.05em] text-[#15120f]">Yak & Yeti&apos;s</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-cedar/62">{business.tagline}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#15120f]">Visit</p>
          <a className="mt-3 block text-cedar/62 transition hover:text-ember" href={safeExternalUrl(business.maps)} target="_blank" rel="noreferrer">
            Open Google Maps
          </a>
          <Link className="mt-2 block text-cedar/62 transition hover:text-ember" href="/contact">
            Contact page
          </Link>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#15120f]">Social</p>
          <a className="mt-3 flex items-center gap-2 text-cedar/62 transition hover:text-ember" href={`tel:${business.phone}`}>
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
            <span>{business.phone}</span>
          </a>
          <a className="mt-2 flex items-center gap-2 text-cedar/62 transition hover:text-ember" href={safeExternalUrl(business.instagram)} target="_blank" rel="noreferrer">
            <InstagramIcon className="h-5 w-5 text-[#C13584]" />
            <span>Instagram</span>
          </a>
          <a className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#e23744] px-3 py-2 font-bold text-white transition hover:bg-[#cb202d]" href={safeExternalUrl(business.zomato)} target="_blank" rel="noreferrer">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white font-black tracking-[-0.08em] text-[#e23744]">z</span>
            Available on Zomato
          </a>
        </div>
      </div>
    </footer>
  );
}
