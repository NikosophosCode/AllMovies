/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Ensure dark: variants use an explicit class on the root element
  // In Tailwind v3/v4, valid options are 'media' or 'class',
  // or ['class', '<selector>'] to scope to a custom selector.
  // We scope to the html.dark selector to match our ThemeProvider logic.
  darkMode: ['class', 'html.dark'],
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
