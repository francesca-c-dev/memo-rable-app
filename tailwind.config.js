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
    extend: {
      colors: {
        primary: {
          50: '#fef2ed',
          100: '#fde6db',
          200: '#fbc7b0',
          300: '#f9a068', // Your secondary color
          400: '#f67d3d',
          500: '#f15a11',
          600: '#c44217', // Your primary color
          700: '#a13512',
          800: '#7f2a0e',
          900: '#5c1f0a',
        }
      },
      fontFamily: {
        cursive: ['Playfair Display', 'serif'],
        handwritten: ['"Homemade Apple"', 'serif'], 
        logo: ['"Barriecito"', 'serif'],
        fancy: [ "Ephesis", 'serif']
      }
    },
  },
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#c44217",
          },
          focus: "#f9a068",
        },
      },
      dark: {
        colors: {
          primary: {
            DEFAULT: "#f9a068",
          },
          focus: "#c44217",
        },
      },
    }
  })]
}