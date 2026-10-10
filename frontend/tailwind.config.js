/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Luxury Art Direction Palette
        porcelain: '#F7F4EE',    // 65% Main background
        ivory: '#FFFCF7',        // Secondary surface / cards
        espresso: '#27221F',     // 20% Primary typography & deep surfaces
        warmStone: '#776F68',    // Secondary typography
        terracotta: '#B65337',   // 10% Primary brand accent
        antiqueBrass: '#B58B4C', // 5% Secondary accent
        aubergine: '#35272F',    // Deep editorial hero / footer
        sandstone: '#E6DED3',    // Subtle borders
        apricot: '#EED6C3',      // Muted highlight
        
        // Brand tonal scale anchored to terracotta and warm neutrals
        brand: {
          50: '#FFFCF7',
          100: '#F7F4EE',
          200: '#EED6C3',
          300: '#E6DED3',
          400: '#D4A373',
          500: '#B65337', // primary terracotta
          600: '#9C432A',
          700: '#7E3420',
          800: '#35272F', // editorial aubergine
          900: '#27221F', // espresso ink
          950: '#181412',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Didot', 'Bodoni MT', 'Georgia', 'serif'],
        sans: ['Manrope', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(39, 34, 31, 0.04), 0 1px 2px -1px rgba(39, 34, 31, 0.03)',
        card: '0 4px 16px -2px rgba(39, 34, 31, 0.06), 0 2px 6px -2px rgba(39, 34, 31, 0.03)',
        floating: '0 16px 36px -8px rgba(39, 34, 31, 0.12), 0 4px 12px -2px rgba(39, 34, 31, 0.06)',
      },
      borderRadius: {
        'luxury': '14px',
        'luxury-lg': '20px',
      },
    },
  },
  plugins: [],
}
