import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Heart, User, LogIn, LogOut, List } from 'lucide-react'
import ThemeSwitcher from '../ThemeSwitcher'
import { useAuth } from '@/hooks'
import logo from '@/assets/icons/logo.webp'
import logoDark from '@/assets/icons/logo-dark.webp'


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, startAuth, logout } = useAuth()

  // Cerrar menú de usuario al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/movies', label: 'Películas' },
    { href: '/series', label: 'Series' },
    { href: '/trending', label: 'Tendencias' },
    { href: '/my-lists', label: 'Mis Listas', authRequired: true },
    { href: '/search', label: 'Búsqueda' },
  ]

  const isActive = (href: string) => location.pathname === href

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      setShowUserMenu(!showUserMenu)
    } else {
      try {
        await startAuth()
      } catch (error) {
        console.error('Error starting auth:', error)
      }
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  const getAvatarUrl = () => {
    if (!user?.avatar) return null
    if (user.avatar.tmdb?.avatar_path) {
      return `https://image.tmdb.org/t/p/w45${user.avatar.tmdb.avatar_path}`
    }
    if (user.avatar.gravatar?.hash) {
      return `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}?s=45`
    }
    return null
  }

  return (
  <nav className="sticky top-0 z-50 blur-nav shadow-sm transition-all duration-300" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {/* Light logo (shown in light mode) */}
            <img src={logo} alt="AllMovies" className="h-auto w-28 logo-light" />

            {/* Dark logo (shown in dark mode) */}
            <img src={logoDark} alt="AllMovies" className="h-auto w-28 logo-dark" />
          </Link>

          {/* Links de desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.filter(link => !link.authRequired || isAuthenticated).map((link) => (
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
            <Link 
              to="/search"
              className="p-2 rounded-lg transition-all duration-200 blur-button hidden" 
              aria-label="Search"
            >
              <Search size={20} className="text-(--fg-muted)" />
            </Link>
            <Link 
              to="/favorites"
              className="p-2 rounded-lg transition-all duration-200 blur-button"
              aria-label="Favorites"
            >
              <Heart size={20} className="text-(--fg-muted)" />
            </Link>
            <ThemeSwitcher />
            
            {/* User profile / Login button */}
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={handleAuthClick}
                className="p-1 hover:opacity-80 transition-opacity duration-200"
                aria-label={isAuthenticated ? 'User menu' : 'Login'}
              >
                {isAuthenticated && getAvatarUrl() ? (
                  <img 
                    src={getAvatarUrl()!} 
                    alt={user?.username || 'User'} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    {isAuthenticated ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <LogIn size={16} className="text-white" />
                    )}
                  </div>
                )}
              </button>

              {/* User menu dropdown */}
              {showUserMenu && isAuthenticated && (
                <div 
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg overflow-hidden animate-slide-in-down"
                  style={{ 
                    backgroundColor: 'var(--card-bg)', 
                    border: '1px solid var(--border)' 
                  }}
                >
                  <div className="p-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="font-semibold" style={{ color: 'var(--fg)' }}>
                      {user?.name || user?.username}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                      @{user?.username}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/my-lists')
                      setShowUserMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--fg)' }}
                  >
                    <List size={16} />
                    Mis Listas
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 text-left flex items-center gap-2 hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--accent)' }}
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
            
            {/* Botón de menú móvil */}
            <button
              className="md:hidden p-2 rounded-lg transition-all duration-200 blur-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} style={{ color: 'var(--fg-muted)' }} />
              ) : (
                <Menu size={24} style={{ color: 'var(--fg-muted)' }} />
              )}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 px-4 space-y-1 animate-slide-in-down">
            {links.filter(link => !link.authRequired || isAuthenticated).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 px-5 rounded-lg font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'glass-card'
                }`}
                style={isActive(link.href) ? {} : { color: 'var(--fg-muted)' }}
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
