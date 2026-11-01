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
        // Athletesis SaaS Design System (Linear / Stripe / Vercel standard)
        navy: {
          main: '#0B1020',
          dark: '#070A14',
          light: '#11182E',
        },
        surface: {
          DEFAULT: '#151C35',
          elevated: '#1A2342',
          subtle: '#0F162B',
        },
        accent: {
          indigo: '#6675E8',
          indigoHover: '#5463D6',
          gold: '#E8B75A',
          goldHover: '#DBA644',
          cyan: '#55BDEB',
        },
        text: {
          primary: '#F3F5FA',
          secondary: '#9AA6BD',
          muted: '#6B7A99',
        },
        border: {
          subtle: '#28334D',
          hover: '#3D4D73',
          focus: '#6675E8',
        },
        // Backwards compatibility mappings for existing utility usages:
        brand: {
          400: '#55BDEB',
          500: '#6675E8',
          600: '#5463D6',
        },
        dark: {
          700: '#28334D',
          800: '#1A2342',
          900: '#151C35',
          950: '#0B1020',
        }
      },
    },
  },
  plugins: [],
};
