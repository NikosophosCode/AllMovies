import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // Class-based dark mode - applies when html element has 'dark' class
  darkMode: 'class',
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
} satisfies Config
