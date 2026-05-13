import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://yakandyetis.example"),
  title: {
    default: "Yak & Yeti's | Himalayan Comfort Food Cafe",
    template: "%s | Yak & Yeti's"
  },
  description:
    "Premium modern Nepalese cafe serving Himalayan coffee, fresh momos, thukpa, thalis, and warm comfort food. Order on WhatsApp or visit Yak & Yeti's.",
  keywords: [
    "Yak and Yeti's",
    "Nepalese cafe",
    "momos",
    "Himalayan coffee",
    "Nepali food",
    "Thukpa",
    "WhatsApp order",
    "Zomato cafe"
  ],
  openGraph: {
    title: "Yak & Yeti's | Himalayan Comfort Food",
    description: "Coffee, momos, and Nepalese comfort food with a premium modern cafe feel.",
    images: ["/yak-yeti-logo.jpg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
