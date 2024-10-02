import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "radial-gradient":
          "repeating-radial-gradient(circle at center center, #09090B 0%, #09090B 55px, transparent 58px);",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-logos": {
          to: { transform: "translateX(calc(-50% - 2rem))" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(1rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "hero-in": {
          from: { opacity: "0", transform: "translateY(3rem)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slide: {
          to: { transform: "translateX(calc(-50% - 0.5rem))" },
        },
        shine: {
          from: {
            opacity: "0",
            transform:
              "translate(0%,-100%) scale(0.5) skew(-5deg) translate3d(0, 0, 0)",
          },
          to: {
            opacity: "1",
            transform:
              "translate(150%,-50%) scale(1) skew(-25deg) translate3d(0, 0, 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-logos": "slide-logos 40s linear infinite",
        "fade-in": "fade-in 0.3s ease-in-out forwards",
        "hero-in": "hero-in 0.6s ease forwards",
        slide: "slide 120s linear infinite",
        "slide-reverse": "slide 120s linear infinite reverse",
        shine: "shine 2s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
