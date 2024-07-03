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
    screens: {
      mobile: { min: "0px", max: "600px" },
      tablet: { min: "601px", max: "1023px" },
      desktop: { min: "1024px" },
    },
    fontFamily: {
      sans: ["Pretendard", "-apple-system", "sans-serif"],
    },
    extend: {
      fontFamily: {
        libre: ["var(--font-libre)"],
        serif: ["Noto Serif KR", "serif"],
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          DEFAULT: "#7B0000",
        },
        grayscale: {
          0: "#FFFFFF",
          100: "#F7F7F7",
          200: "#E9E9E9",
          300: "#DADADA",
          400: "#999999",
          500: "#777777",
          600: "#333333",
          700: "#111111",
        },
      },

      animation: {
        fade: "fadeIn .5s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
};
