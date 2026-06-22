import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'bloomy-purple': '#8B5CF6',
        'bloomy-pink': '#EC4899',
        'bloomy-blue': '#3B82F6',
        'dark-bg': '#000000',
        'dark-surface': '#0A0A0A',
        'dark-card': '#111111',
        'dark-border': '#1A1A1A',
        'dark-text': '#FFFFFF',
        'dark-text-secondary': '#A0A0A0',
      },
    },
  },
  plugins: [],
};

export default config;
