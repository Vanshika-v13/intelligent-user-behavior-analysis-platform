/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F97230",
        secondary: "#FF8A4C",
        background: "#FEFEFE",
        "warm-white": "#FAF9F7",
        "light-gray": "#F0EFED",
        "border-gray": "#DED9D3",
        "primary-text": "#131417",
        "secondary-text": "#5B5B5B",
        footer: "#121212",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Satoshi', 'General Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
