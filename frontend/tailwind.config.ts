import type { Config } from "tailwindcss";

/**
 * Airbnb-inspired design tokens.
 * Rausch (#FF385C) is Airbnb's signature brand pink/red; Hof (#222222) the
 * near-black text colour; Babu (#00A599) the teal used for "is this unique".
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rausch: "#FF385C",
        arches: "#FC642D",
        babu: "#00A599",
        hof: "#222222",
        foggy: "#717171",
        mist: "#F7F7F7",
        line: "#DDDDDD",
      },
      fontFamily: {
        sans: [
          "Circular",
          "var(--font-poppins)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 6px 16px rgba(0,0,0,0.12)",
        search: "0 1px 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
        pop: "0 6px 20px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
