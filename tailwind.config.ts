import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22c55e", // Tailwind Green-500
          light: "#dcfce7",   // Green-100
          dark: "#0e5e3b",    // Forest Green
        },
        secondary: {
          DEFAULT: "#f8fafc", // Slate-50
          dark: "#f1f5f9",    // Slate-100
        },
      },
      fontFamily: {
        sans: ["var(--font-jost)", "sans-serif"],
        heading: ["var(--font-lexend)", "sans-serif"],
        lexend: ["var(--font-lexend)", "sans-serif"],
        jost: ["var(--font-jost)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
