/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        okhovat: {
          50:  '#f0f7f6',
          100: '#d9ebe8',
          200: '#b3d6d1',
          300: '#80b8b0',
          400: '#4d9a90',
          500: '#0F5C55', // primary green-navy
          600: '#0c4a44',
          700: '#0a3b36',
          800: '#082e2a',
          900: '#06231f',
          950: '#031512',
        },
        cream: {
          50:  '#fdfbf7',
          100: '#faf6ee',
          200: '#f5eedd',
          300: '#eee3c8',
        },
        gold: {
          400: '#e6b84d',
          500: '#d4a017',
          600: '#b8860b',
        },
      },
      fontFamily: {
        vazir: ['Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px -2px rgb(0 0 0 / 0.08)',
      },
    },
  },
  plugins: [],
}
