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
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/58">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Yak & Yeti's home">
          <Image
            src="/yak-yeti-logo.jpg"
            alt="Yak & Yeti's logo"
            width={58}
            height={58}
            priority
            className="h-10 w-10 rounded-full bg-white object-cover shadow-sm ring-1 ring-black/5 sm:h-11 sm:w-11"
          />
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-none tracking-[-0.03em] text-[#15120f]">Yak & Yeti&apos;s</p>
            <p className="mt-1 hidden text-xs font-medium text-cedar/52 sm:block">Himalayan Comfort Food</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-cedar/66 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="transition hover:text-[#15120f]"
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
            className="hidden items-center gap-2 rounded-full bg-[#e23744] px-3 py-2 text-xs font-bold text-white shadow-[0_10px_24px_rgba(226,55,68,0.18)] transition hover:-translate-y-0.5 hover:bg-[#cb202d] md:inline-flex"
            aria-label="Available on Zomato"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white font-black tracking-[-0.08em] text-[#e23744]">z</span>
            Zomato
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#15120f] px-4 py-2.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.14)] transition hover:-translate-y-0.5 hover:bg-cedar"
          >
            Order
          </a>
        </div>
      </div>
      <div className="yy-no-scrollbar mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            target={item.href.startsWith("http") ? "_blank" : undefined}
            rel={item.href.startsWith("http") ? "noreferrer" : undefined}
            className="shrink-0 rounded-full border border-black/5 bg-[#f5f1ea]/86 px-4 py-2 text-xs font-bold text-cedar shadow-sm"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
