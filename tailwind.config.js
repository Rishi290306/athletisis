/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbe6',
          100: '#fff3b3',
          400: '#ffdb4d',
          500: '#ffc700', // Solar Gold
          600: '#ff9100', // Fire Amber
          700: '#e67e00',
          900: '#78350f',
        },
        cyanBrand: {
          400: '#38bdf8',
          500: '#00f0ff',
        },
        dark: {
          800: '#1a1813',
          900: '#120f0a',
          950: '#0a0805',
        }
      },
    },
  },
  plugins: [],
}
