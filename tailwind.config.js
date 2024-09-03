/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/src/assets/card.jpg')",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          overflowY: 'scroll',
          'scrollbar-width': 'none', /* For Firefox */
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none', /* For Chrome, Safari, and Opera */
        },
      });
    },
    nextui(),
  ],
}

