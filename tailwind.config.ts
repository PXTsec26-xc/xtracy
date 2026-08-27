import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0284c7",
          cyan: "#38bdf8",
          electric: "#0369a1",
          deepBlue: "#0c192c",
          violet: "#4f46e5",
          purple: "#6366f1",
          teal: "#0d9488",
        },
        darkBg: {
          DEFAULT: "#060a10",
          card: "#09101d",
          secondary: "#0d1626",
          panel: "#101b2e",
        },
        status: {
          safe: "#10b981",
          caution: "#f59e0b",
          orange: "#f97316",
          critical: "#ef4444",
        },
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(9, 16, 29, 0.78) 0%, rgba(13, 22, 38, 0.55) 100%)",
        "glass-gradient-subtle":
          "linear-gradient(135deg, rgba(16, 27, 46, 0.6) 0%, rgba(9, 16, 29, 0.4) 100%)",
        "cyber-radial":
          "radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.1) 0%, rgba(2, 132, 199, 0.05) 50%, transparent 80%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        glowBlue: "0 0 20px -3px rgba(56, 189, 248, 0.3)",
        glowTeal: "0 0 20px -3px rgba(13, 148, 136, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
