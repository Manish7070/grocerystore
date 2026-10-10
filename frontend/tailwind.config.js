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
        // Master Art Direction Tokens
        forest: '#192D2A',        // Primary Dark: Deep Forest Ink
        charcoal: '#292724',      // Secondary Dark: Charcoal
        oat: '#F1E8D8',           // Warm Background: Warm Oat
        surface: '#FFFFFF',       // Clean Surface: Pure White
        copper: '#C66B42',        // Primary Accent: Burnt Copper
        ochre: '#D9A441',         // Golden Accent: Golden Ochre
        mutedStone: '#625F59',    // Muted Text
        sandstoneBorder: '#DDD5C8', // Structural Border
        successGreen: '#17745A',  // Semantic Success
        errorRed: '#B93832',      // Semantic Error

        // Cohesive Palette Mappings
        porcelain: '#F1E8D8',    // Warm Oat canvas
        ivory: '#FFFFFF',        // Clean white card surface
        espresso: '#192D2A',     // Deep Forest Ink primary text
        warmStone: '#625F59',    // Muted Stone secondary typography
        terracotta: '#C66B42',   // Burnt Copper brand accent
        antiqueBrass: '#D9A441', // Golden Ochre secondary accent
        aubergine: '#192D2A',    // Deep Forest editorial section
        sandstone: '#DDD5C8',    // Sandstone border
        apricot: '#F1E8D8',      // Warm Oat highlight
        
        // Brand tonal scale anchored to copper and deep forest
        brand: {
          50: '#FDFBF7',
          100: '#F1E8D8', // Warm Oat
          200: '#E6D7BD',
          300: '#DDD5C8', // Sandstone Border
          400: '#D9A441', // Golden Ochre
          500: '#C66B42', // Burnt Copper
          600: '#B05932',
          700: '#8F4524',
          800: '#292724', // Charcoal
          900: '#192D2A', // Deep Forest Ink
          950: '#0E1C1A',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Didot', 'Bodoni MT', 'Georgia', 'serif'],
        sans: ['Manrope', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(25, 45, 42, 0.04), 0 1px 2px -1px rgba(25, 45, 42, 0.03)',
        card: '0 4px 16px -2px rgba(25, 45, 42, 0.06), 0 2px 6px -2px rgba(25, 45, 42, 0.03)',
        floating: '0 16px 36px -8px rgba(25, 45, 42, 0.12), 0 4px 12px -2px rgba(25, 45, 42, 0.06)',
      },
      borderRadius: {
        'luxury': '12px',
        'luxury-lg': '18px',
      },
    },
  },
  plugins: [],
}
