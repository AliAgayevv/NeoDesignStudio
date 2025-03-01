import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark_gray: "#646060",
        soft_white: "#F3F1F1",
        deep_brown: "#463A28",
        light_gray: "#E7E7E6",
        off_white: "#F6F4F4",
      },
    },
  },
  plugins: [],
} satisfies Config;
