const greenBasketGreen = {
  50: '#f5faef',
  100: '#e8f4dc',
  200: '#d2e9bc',
  300: '#b5d993',
  400: '#91c565',
  500: '#70b32f',
  600: '#579928',
  700: '#3f7925',
  800: '#2d6024',
  900: '#145c35',
  950: '#0b3520',
};

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
        brand: greenBasketGreen,
      },
    },
  },
  plugins: [],
}

