"use client";

import Image from "next/image";
import Link from "next/link";
import { useEditableContent } from "@/components/useEditableContent";
import { digitsOnly, safeExternalUrl } from "@/lib/safeUrl";

export default function Header() {
  const { business } = useEditableContent();
  const whatsappUrl = `https://wa.me/${digitsOnly(business.whatsapp)}?text=${encodeURIComponent("Namaste Yak & Yeti's, I would like to place an order.")}`;
  const navItems = [
    { label: "Menu", href: "/#menu" },
    { label: "Zomato", href: safeExternalUrl(business.zomato) },
    { label: "Maps", href: safeExternalUrl(business.maps) },
    { label: "Reviews", href: "/#reviews" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/78 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Yak & Yeti's home">
          <Image
            src="/yak-yeti-logo.jpg"
            alt="Yak & Yeti's logo"
            width={58}
            height={58}
            priority
            className="h-11 w-11 rounded-full bg-white object-cover ring-1 ring-black/5"
          />
          <div>
            <p className="text-base font-semibold leading-none tracking-[-0.03em] text-[#15120f]">Yak & Yeti&apos;s</p>
            <p className="mt-1 hidden text-xs font-medium text-cedar/52 sm:block">Himalayan Comfort Food</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-cedar/68 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="transition hover:text-ember"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={safeExternalUrl(business.zomato)}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#e23744] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#cb202d] sm:inline-flex"
            aria-label="Available on Zomato"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white font-black tracking-[-0.08em] text-[#e23744]">z</span>
            Zomato
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#15120f] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-ember"
          >
            Order
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-2 md:hidden">
        {[
          { label: "Menu", href: "/#menu" },
          { label: "Contact", href: "/contact" },
          { label: "Maps", href: safeExternalUrl(business.maps) }
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            className="shrink-0 rounded-full bg-[#f5f1ea] px-4 py-2 text-xs font-semibold text-cedar"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
