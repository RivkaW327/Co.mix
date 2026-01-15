/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#1A1A1A',
        'primary-blue': '#2563EB',
        'primary-red': '#DC2626',
        'primary-green': '#00AA4D',
        'primary-yellow': '#FEAB2A',
        'success': {
          DEFAULT: '#22C55E', // This is the green-500 color from Tailwind's default palette
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'comic': ['Bangers', 'cursive']
      }
    },
  },
  plugins: [],
}