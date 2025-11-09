import { Heart } from 'lucide-react'
import logo from '@/assets/icons/logo.webp'
import logoDark from '@/assets/icons/logo-dark.webp'

const Footer = () => {
  return (
    <footer 
      className="frosted border-t mt-16" 
      style={{ 
        borderColor: 'var(--border)',
        // Altura mínima para prevenir layout shifts
        minHeight: '400px',
      }}
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Sección 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4" style={{ height: '40px' }}>
              {/* Light logo - Dimensiones explícitas */}
              <img 
                src={logo} 
                alt="AllMovies" 
                width="160" 
                height="40"
                className="h-auto w-40 logo-light"
                style={{ objectFit: 'contain' }}
              />

              {/* Dark logo - Dimensiones explícitas */}
              <img 
                src={logoDark} 
                alt="AllMovies" 
                width="160" 
                height="40"
                className="h-auto w-40 logo-dark"
                style={{ objectFit: 'contain' }}
              />
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
                <a 
                  href="/" 
                  className="text-sm hover:text-red-500 inline-block" 
                  style={{ 
                    color: 'var(--fg-muted)',
                    transition: 'color 0.15s ease-in-out',
                  }}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/movies" 
                  className="text-sm hover:text-red-500 inline-block" 
                  style={{ 
                    color: 'var(--fg-muted)',
                    transition: 'color 0.15s ease-in-out',
                  }}
                >
                  Movies
                </a>
              </li>
              <li>
                <a 
                  href="/tv-shows" 
                  className="text-sm hover:text-red-500 inline-block" 
                  style={{ 
                    color: 'var(--fg-muted)',
                    transition: 'color 0.15s ease-in-out',
                  }}
                >
                  TV Shows
                </a>
              </li>
              <li>
                <a 
                  href="/new-popular" 
                  className="text-sm hover:text-red-500 inline-block" 
                  style={{ 
                    color: 'var(--fg-muted)',
                    transition: 'color 0.15s ease-in-out',
                  }}
                >
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
