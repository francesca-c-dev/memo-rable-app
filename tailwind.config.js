const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          // Add more custom colors if needed
        }
      },
      dark: {
        colors: {
          background: "#000000",
          // Add more custom colors if needed
        }
      }
    }
  })]
}