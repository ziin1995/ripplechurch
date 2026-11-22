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
        // 대성당의 밤: 어두운 회랑 + 양피지 글자 + 금빛 납선
        background: "#090a14",
        foreground: "#f2e8d2",
        accent: "#e2bb62",
        muted: "#a9a3b9",
        ink: "#16110a",
        // 패널(스테인드글라스 뒤 어두운 석조)
        glass: "rgba(22, 22, 44, 0.62)",
        "glass-deep": "rgba(12, 12, 28, 0.78)",
        lead: "rgba(226, 187, 98, 0.16)",
        "lead-strong": "rgba(226, 187, 98, 0.32)",
        // 유리 색
        ruby: "#c4243f",
        cobalt: "#2c5fd9",
        azure: "#3aa0e8",
        emerald: "#1c9c6c",
        amber: "#eaa53a",
        violet: "#7c3fbf",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
        display: ["Cinzel", "Gowun Batang", "Noto Serif JP", "serif"],
        serif: ["Gowun Batang", "Noto Serif JP", "serif"],
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        ripple: "ripple 3s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
