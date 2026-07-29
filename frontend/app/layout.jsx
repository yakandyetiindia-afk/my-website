import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://yakkandyetii.com"),
  title: {
    default: "Yak & Yeti's | Himalayan Comfort Food",
    template: "%s | Yak & Yeti's"
  },
  description:
    "Premium Nepali cafe serving momo, jhol momo, Thakali thali, Chow Chow, Sadeko, coffee, chai, and Himalayan comfort food.",
  keywords: [
    "Yak and Yeti",
    "Nepali cafe",
    "momo",
    "jhol momo",
    "Thakali thali",
    "Himalayan comfort food",
    "Nepali food"
  ],
  openGraph: {
    title: "Yak & Yeti's | Himalayan Comfort Food",
    description: "Momo, Thakali thali, chai, coffee, and Nepali street bites with a premium cafe experience."
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
