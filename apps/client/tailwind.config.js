/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./_components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      libre: ["var(--font-libre)"],
    },
    screens: {
      mobile: { min: "0px", max: "600px" },
      tablet: { min: "601px", max: "1023px" },
      desktop: { min: "1024px" },
    },

    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
