import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.4rem",
    },
    extend: {
      backgroundImage: {
        "hero-light-gradient":
          "linear-gradient(to top, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2), transparent)",
        "hero-cover":
          "linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(0, 0, 70, 0.1)), url('/assets/images/footer-hero.svg')",
        "auth-cover":
          "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1)), url('/assets/images/authbg.jpg'),",
        "listing-cover":
          "linear-gradient(to right, rgba(255, 255, 255, .6), rgba(243, 244, 246, .6)), url('/assets/images/auth-noise.svg'),",
      },
      boxShadow: {
        bottom:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      fontFamily: {
        sans: ["var(--font-open-sans)", ...fontFamily.sans],
        inter: ['Inter', 'sans-serif', ...fontFamily.sans],
        quattrocento: ['var(--font-quattrocento)'],
      },
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        brand: "rgb(var(--color-brand) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        customyellow: "rgb(var(--color-customyellow) / <alpha-value>)",
        card: {
          DEFAULT: "rgb(var(--card) / <alpha-value>)",
          foreground: "rgb(var(--card-foreground) / <alpha-value>)",
          alt: "rgb(var(--card-alt) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "rgb(var(--popover) / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        placeholder: "rgb(var(--input-placeholder) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        sidebar: {
          DEFAULT: "rgb(var(--sidebar-background) / <alpha-value>)",
          foreground: "rgb(var(--sidebar-foreground) / <alpha-value>)",
          primary: "rgb(var(--sidebar-primary) / <alpha-value>)",
          "primary-foreground": "rgb(var(--sidebar-primary-foreground) / <alpha-value>)",
          accent: "rgb(var(--sidebar-accent) / <alpha-value>)",
          "accent-foreground": "rgb(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "rgb(var(--sidebar-border) / <alpha-value>)",
          ring: "rgb(var(--sidebar-ring) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      clipPath: {
        "bottom-curve": "ellipse(100% 100% at 50% 0%)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Add custom utilities for clip-path
    function ({ addUtilities }: any) {
      addUtilities({
        ".clip-bottom-curve": {
          clipPath: "ellipse(100% 100% at 50% 0%)",
        },
      });
    },
    require("tailwindcss-textshadow"),
    // require("@tailwindcss/forms")
  ],
};
export default config;
