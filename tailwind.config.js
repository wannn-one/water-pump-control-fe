/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx,vue}",
    "./node_modules/preline/preline.js",
  ],
  theme: {
    extend: {
      colors: {
        main: "#9487E8",
        background: "#F7F7F7",
        card: "#FFFFFF",
        secondary: "#363636",
        ongreen: "#09AD91",
        offred: "#F55454",
        water: "#5c5cff",
      },
      textColor: { white: "#F8F8FC", black: "#050505" },
      fontFamily: {
        sans: ["Fredoka", "sans-serif"],
      },
      borderColor: { main: "#9487E8" },
    },
  },
  plugins: [require("preline/plugin")],
};
