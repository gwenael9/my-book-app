const PrimeUI = require('tailwindcss-primeui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#FFB6C1"
      }
    },
  },
  plugins: [
    PrimeUI
  ],
}
