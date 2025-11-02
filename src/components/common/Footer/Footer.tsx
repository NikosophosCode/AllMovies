import { Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-(--surface-muted) border-t border-(--border) mt-16 transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Sección 1 */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-600">IMOVIE</h3>
            <p className="text-(--fg-muted) text-sm leading-relaxed">
              Explore the best movies and TV series of the moment with updated information from TheMovieDB.
            </p>
          </div>

          {/* Sección 2 */}
          <div>
            <h4 className="font-semibold mb-4 text-(--fg)">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-(--fg-muted) text-sm hover:text-red-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/movies" className="text-(--fg-muted) text-sm hover:text-red-500 transition-colors">
                  Movies
                </a>
              </li>
              <li>
                <a href="/tv-shows" className="text-(--fg-muted) text-sm hover:text-red-500 transition-colors">
                  TV Shows
                </a>
              </li>
              <li>
                <a href="/new-popular" className="text-(--fg-muted) text-sm hover:text-red-500 transition-colors">
                  New & Popular
                </a>
              </li>
            </ul>
          </div>

          {/* Sección 3 */}
          <div>
            <h4 className="font-semibold mb-4 text-(--fg)">Information</h4>
            <p className="text-(--fg-muted) text-sm leading-relaxed">
              This application uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-(--fg-muted)">
              © {new Date().getFullYear()} IMOVIE. All rights reserved.
            </p>
            <p className="text-sm text-(--fg-muted) flex items-center gap-2">
              Made with <Heart size={16} className="text-red-500" fill="currentColor" /> by NikosophosCode
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
