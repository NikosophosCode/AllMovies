import tailwind from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

// Configure Tailwind v4 via the PostCSS plugin to use selector strategy for dark mode
export default {
  plugins: [
    tailwind(),
    autoprefixer(),
  ],
}
