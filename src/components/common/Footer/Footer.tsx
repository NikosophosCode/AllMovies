import { Heart } from 'lucide-react'
import logo from '@/assets/icons/logo.webp'
import logoDark from '@/assets/icons/logo-dark.webp'

const Footer = () => {
  return (
    <footer className="frosted border-t mt-16 transition-all duration-200" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Sección 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Light logo */}
              <img src={logo} alt="AllMovies" className="h-auto w-40 logo-light" />

              {/* Dark logo */}
              <img src={logoDark} alt="AllMovies" className="h-auto w-40 logo-dark" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              Explore the best movies and TV series of the moment with updated information from TheMovieDB.
            </p>
          </div>

          {/* Sección 2 */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--fg)' }}>Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-sm transition-colors duration-200 hover:text-red-500 inline-block" style={{ color: 'var(--fg-muted)' }}>
                  Home
                </a>
              </li>
              <li>
                <a href="/movies" className="text-sm transition-colors duration-200 hover:text-red-500 inline-block" style={{ color: 'var(--fg-muted)' }}>
                  Movies
                </a>
              </li>
              <li>
                <a href="/tv-shows" className="text-sm transition-colors duration-200 hover:text-red-500 inline-block" style={{ color: 'var(--fg-muted)' }}>
                  TV Shows
                </a>
              </li>
              <li>
                <a href="/new-popular" className="text-sm transition-colors duration-200 hover:text-red-500 inline-block" style={{ color: 'var(--fg-muted)' }}>
                  New & Popular
                </a>
              </li>
            </ul>
          </div>

          {/* Sección 3 */}
          <div>
            <h4 className="font-semibold mb-4" style={{ color: 'var(--fg)' }}>Information</h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              This application uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
              © {new Date().getFullYear()} AllMovies. All rights reserved.
            </p>
            <p className="text-sm flex items-center gap-2" style={{ color: 'var(--fg-muted)' }}>
              Made with <Heart size={16} className="text-red-500" fill="currentColor" /> by NikosophosCode
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
