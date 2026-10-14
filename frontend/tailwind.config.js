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
        copper: '#17745A',        // Primary Accent: Botanical Emerald
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
        terracotta: '#17745A',   // Botanical Emerald brand accent (no brown)
        antiqueBrass: '#D9A441', // Golden Ochre secondary accent
        aubergine: '#192D2A',    // Deep Forest editorial section
        sandstone: '#DDD5C8',    // Sandstone border
        apricot: '#F1E8D8',      // Warm Oat highlight
        
        // 4-Surface Hierarchy Dark Mode Tokens
        deepForest: '#0B1714',     // Main page background / canvas (Level 1)
        forestSection: '#10221B',  // Alternate section backgrounds (Level 2)
        marketSurface: '#172C24',  // Product cards and content panels (Level 3)
        raisedSurface: '#20392F',  // Hover cards, dropdowns, active panels (Level 4)
        subtleBorder: '#30483C',   // Card borders and separators
        freshMint: '#55D6A0',      // Primary CTA, selected states, links
        mintDarkText: '#0B1714',   // Contrast text on Fresh Mint
        warmIvory: '#F3F0E6',      // Headings and important text
        sageText: '#B6C7BD',       // Descriptions and secondary text
        harvestGold: '#E6BC70',    // Small premium highlights and offers

        // Brand tonal scale anchored to botanical emerald and deep forest
        brand: {
          50: '#F0F9F5',
          100: '#E0F2EB',
          200: '#C2E5D7',
          300: '#94CEBB',
          400: '#4EA68B',
          500: '#17745A', // Botanical Emerald
          600: '#135E49',
          700: '#0F4838',
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
