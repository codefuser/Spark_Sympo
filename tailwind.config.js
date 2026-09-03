/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#07090E",
        foreground: "#F1F5F9",
        card: {
          DEFAULT: "#0D111A",
          foreground: "#F8FAFC",
          hover: "#131A27",
        },
        popover: {
          DEFAULT: "#0D111A",
          foreground: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#00F0FF",
          foreground: "#05070A",
          dark: "#00B8C4",
        },
        cyan: {
          DEFAULT: "#0072FF",
          glow: "#00D2FF",
        },
        secondary: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
        muted: {
          DEFAULT: "#161E2E",
          foreground: "#94A3B8",
        },
        accent: {
          DEFAULT: "#00F0FF",
          foreground: "#05070A",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "rgba(0, 240, 255, 0.15)",
        input: "rgba(0, 240, 255, 0.1)",
        ring: "#00F0FF",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 240, 255, 0.25)",
        "glow-lg": "0 0 35px rgba(0, 240, 255, 0.35)",
        "cyan-glow": "0 0 25px rgba(0, 114, 255, 0.3)",
      },
      backgroundImage: {
        'circuit-pattern': "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05) 0%, transparent 60%)",
        'grid-pattern': "linear-gradient(to right, rgba(0, 240, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.05) 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' },
        }
      }
    },
  },
  plugins: [],
};
