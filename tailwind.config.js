/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0c0d14',
          surface: '#141622',
          elevated: '#1d2030',
        },
        gold: {
          DEFAULT: '#d4af37',
          muted: '#a68829',
          light: '#f3d97d',
        },
        ethereal: {
          DEFAULT: '#8b5cf6',
          muted: '#6d28d9',
        },
      },
      aspectRatio: {
        tarot: '4 / 7',
      },
    },
  },
  plugins: [],
};
