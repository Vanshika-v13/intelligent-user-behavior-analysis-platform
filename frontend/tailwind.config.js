/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#8b5cf6",
        accent: "#f59e0b",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        muted: "#64748b",
        background: "#f8fafc",
        surface: "#ffffff",
        border: "#e2e8f0",
        
        "warm-white": "#FAF9F7",
        "light-gray": "#F0EFED",
        "border-gray": "#DED9D3",
        "primary-text": "#131417",
        "secondary-text": "#5B5B5B",
        footer: "#121212",
      },
      borderRadius: {
        soft: "0.5rem",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Satoshi', 'General Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
