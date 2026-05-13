/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./data/**/*.{js,jsx,ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ember: "#b9572c",
        turmeric: "#d79a38",
        cardamom: "#6f7f4d",
        cedar: "#3d2a1f",
        clay: "#efe4d2",
        smoke: "#27211d",
        linen: "#fbf6ee"
      },
      boxShadow: {
        soft: "0 24px 70px rgba(61, 42, 31, 0.14)",
        lift: "0 18px 40px rgba(75, 47, 30, 0.18)"
      }
    }
  },
  plugins: []
};
