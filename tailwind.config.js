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
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Clean Pro Azure
          600: '#0284c7', // Primary Accent
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          700: '#1E293B', // Subtle slate border
          800: '#172238', // Elevated surface / hover
          900: '#0E1424', // Card & Panel Surface
          950: '#090D16', // Deep Neutral Canvas
        }
      },
    },
  },
  plugins: [],
}
