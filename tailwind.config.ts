import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        handwriting: ['var(--font-handwriting)', 'cursive'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        blackboard: {
          dark: "#0D2818",
          DEFAULT: "#0D2818",
          medium: "#1B5E20",
        },
        chalk: {
          white: "#FFFFFF",
          yellow: "#FFF9C4",
          green: "#C5E1A5",
          pink: "#F8BBD0",
        },
        paper: {
          cream: "#F5F5DC",
          light: "#E8F5E9",
          DEFAULT: "#F5F5DC",
        },
        lightgreen: {
          DEFAULT: "#B8E6D1",
          light: "#C5EBD9",
        },
        primary: {
          blue: "#2563EB",
          DEFAULT: "#2563EB",
        },
        accent: {
          yellow: "#FBBF24",
          green: "#10B981",
          purple: "#8B5CF6",
          orange: "#F97316",
          red: "#EF4444",
        },
      },
      borderRadius: {
        'card': '8px',
        'button': '6px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;

