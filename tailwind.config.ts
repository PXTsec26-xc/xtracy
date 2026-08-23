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
          blue: "#00B4D8",
          cyan: "#00F5D4",
          electric: "#0096C7",
          deepBlue: "#03045E",
          violet: "#7B2CBF",
          purple: "#9D4EDD",
        },
        darkBg: {
          DEFAULT: "#070A12",
          card: "#0C121C",
          secondary: "#111827",
          panel: "#161F30",
        },
        status: {
          safe: "#10B981",
          caution: "#F59E0B",
          orange: "#F97316",
          critical: "#EF4444",
        },
      },
      backgroundImage: {
        "glass-gradient":
          "linear-gradient(135deg, rgba(12, 18, 28, 0.75) 0%, rgba(18, 26, 40, 0.45) 100%)",
        "glass-gradient-light":
          "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(240, 245, 255, 0.65) 100%)",
        "cyber-radial":
          "radial-gradient(circle at 50% 0%, rgba(0, 180, 216, 0.15) 0%, rgba(123, 44, 191, 0.08) 50%, transparent 80%)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        glowBlue: "0 0 25px -5px rgba(0, 180, 216, 0.4)",
        glowViolet: "0 0 25px -5px rgba(123, 44, 191, 0.4)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
