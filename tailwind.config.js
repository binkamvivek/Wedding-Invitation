/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F4E9',
        olive: '#68734D',
        forest: '#263C2E',
        gold: '#C5A66A',
        blush: '#D9A9A0',
        beige: '#E9DDC9',
        'sea-blue': '#4F7FA8',
        terracotta: '#C9825B',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Montserrat', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        script: ['"Pinyon Script"', 'cursive'],
      },
      boxShadow: {
        'wax': '0 8px 24px rgba(60, 40, 20, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -2px 4px rgba(0, 0, 0, 0.4)',
        'paper': '0 12px 36px rgba(38, 60, 46, 0.15)',
        'card-dark': '0 20px 40px rgba(10, 20, 15, 0.4)',
      },
    },
  },
  plugins: [],
}

