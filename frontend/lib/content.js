import { business, menu, reviews } from "@/data/site";

export const CONTENT_STORAGE_KEY = "yak-yeti-site-content-v1";

export const defaultContent = {
  business,
  menu,
  reviews,
  hero: {
    eyebrow: "Himalayan comfort food • Nepali cafe",
    title: "Warm Nepali comfort. Beautifully simple.",
    description:
      "Yak & Yeti's brings momo, Thakali bowls, chai, coffee, and Himalayan street bites into a clean, cosy cafe experience made for easy ordering.",
    signatureLabel: "Signature dishes",
    signatureTitle: "Thakali Thali, Momo, Jhol Momo, Chow Chow, Sadeko.",
    signatureDescription: "Himalayan comfort dishes served with warm cafe hospitality.",
    cultureCaption: "Mountains, temples, craft, textiles, and warm Nepali hospitality.",
    foodImages: [
      { src: "/food-thakali.JPG", alt: "Thakali thali" },
      { src: "/food-momo.JPG", alt: "Momo with chutney" },
      { src: "/food-sekuwa.JPG", alt: "Chicken sekuwa" },
      { src: "/food-cold-coffee.JPG", alt: "Cold coffee" }
    ]
  },
  menuText: {
    eyebrow: "Menu",
    title: "Choose your Himalayan comfort.",
    description:
      "Explore Thakali Thali, Momo, Jhol Momo, Chow Chow, Sadeko, wraps, grilled bites, beverages, and gym bowls."
  }
};

export function mergeContent(content) {
  return {
    ...defaultContent,
    ...content,
    business: { ...defaultContent.business, ...(content?.business || {}) },
    hero: { ...defaultContent.hero, ...(content?.hero || {}) },
    menuText: { ...defaultContent.menuText, ...(content?.menuText || {}) },
    menu: Array.isArray(content?.menu) ? content.menu : defaultContent.menu,
    reviews: Array.isArray(content?.reviews) ? content.reviews : defaultContent.reviews
  };
}
