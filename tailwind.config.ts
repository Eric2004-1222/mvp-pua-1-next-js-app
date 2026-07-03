import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff7f8",
          100: "#ffecef",
          200: "#ffd9df",
          300: "#ffb6c3",
          400: "#ff8da1",
          500: "#f95f80",
          600: "#df3d67",
        },
        mint: {
          50: "#f3fbf8",
          100: "#def5ec",
          200: "#bfeadb",
          500: "#4fb691",
        },
        ink: "#2f2a32",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(119, 72, 86, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
