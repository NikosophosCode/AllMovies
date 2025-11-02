import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, Heart, User } from 'lucide-react'
import ThemeSwitcher from '../ThemeSwitcher'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/tv-shows', label: 'TV Shows' },
    { href: '/movies', label: 'Movies' },
    { href: '/new-popular', label: 'New & Popular' },
    { href: '/my-list', label: 'My list' },
  ]

  const isActive = (href: string) => location.pathname === href

  return (
  <nav className="sticky top-0 z-50 bg-(--surface) backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-600">IMOVIE</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Streaming</span>
          </Link>

          {/* Links de desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors relative py-5 ${
                  isActive(link.href)
                    ? 'text-(--fg)'
                    : 'text-(--fg-muted) hover:text-(--link-hover)'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-t"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Controles de la derecha */}
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-lg transition-colors bg-transparent hover:bg-(--card-hover-bg)" 
              aria-label="Search"
            >
              <Search size={20} className="text-(--fg-muted)" />
            </button>
            <button 
              className="p-2 rounded-lg transition-colors bg-transparent hover:bg-(--card-hover-bg)"
              aria-label="Favorites"
            >
              <Heart size={20} className="text-(--fg-muted)" />
            </button>
            <ThemeSwitcher />
            <button 
              className="p-1 hover:opacity-80 transition-opacity"
              aria-label="User profile"
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-float">
                <User size={16} className="text-white" />
              </div>
            </button>
            
            {/* Botón de menú móvil */}
            <button
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className="text-slate-600 dark:text-slate-300" />
              ) : (
                <Menu size={24} className="text-slate-600 dark:text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 px-4 space-y-1 animate-slide-in-down">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-5 rounded-lg font-medium transition-colors ${
                  isActive(link.href)
                    ? 'bg-red-600 text-white'
                    : 'text-(--fg-muted) hover:bg-(--card-hover-bg) hover:text-(--link-hover)'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
