import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        cyan: {
          racing: "#20F7FF"
        },
        orange: {
          racing: "#FF8A1F"
        },
        violet: {
          racing: "#A855F7"
        },
        emerald: {
          racing: "#32FF9D"
        }
      },
      boxShadow: {
        glow: "0 0 42px rgba(32, 247, 255, 0.18)",
        "orange-glow": "0 0 38px rgba(255, 138, 31, 0.2)"
      },
      backgroundImage: {
        "racing-grid":
          "linear-gradient(rgba(32,247,255,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(32,247,255,0.08) 1px, transparent 1px)",
        "track-radial":
          "radial-gradient(circle at 20% 20%, rgba(32,247,255,0.28), transparent 28%), radial-gradient(circle at 80% 0%, rgba(168,85,247,0.22), transparent 28%), radial-gradient(circle at 72% 78%, rgba(255,138,31,0.18), transparent 30%)"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" }
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        }
      },
      animation: {
        "pulse-glow": "pulseGlow 3.2s ease-in-out infinite",
        scanline: "scanline 8s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
