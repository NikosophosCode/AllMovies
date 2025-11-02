/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Tailwind v4: use selector strategy and scope to html.dark
  darkMode: 'selector',
  darkModeSelector: 'html.dark',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#ffe0e0',
          500: '#d32f2f',
          600: '#b71c1c',
          700: '#9c0c0c',
        },
      },
    },
  },
  plugins: [],
}
