import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1f3a",
        muted: "#627084",
        line: "#e6ebf2",
        paper: "#f4f6f9",
        panel: "#ffffff",
        aptus: "#0057e6",
        "aptus-dark": "#0041b8",
        "aptus-soft": "#ebf2ff",
        accent: "#3db5ff",
        warm: "#f07a2e",
        ok: "#1f7a45",
        bad: "#c0392b",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 39, 68, 0.04), 0 8px 24px rgba(15, 39, 68, 0.05)",
        lift: "0 4px 18px rgba(15, 39, 68, 0.08)",
      },
      borderRadius: {
        panel: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
