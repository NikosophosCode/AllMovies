import { useEffect, useState } from 'react'
import MovieGrid from '@/components/movies/MovieGrid'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { Movie } from '@/types'
import { movieService } from '@/services'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Parallax from '@/components/common/Parallax'
import logo from '@/assets/icons/logo.png'
import logoDark from '@/assets/icons/logo-dark.png'

const Home = () => {
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [upcoming, trending] = await Promise.all([
          movieService.getUpcoming(),
          movieService.getTrending()
        ])
        setComingSoonMovies(upcoming.results.slice(0, 8))
        setTrendingMovies(trending.results.slice(0, 8))
      } catch (err) {
        setError('Error loading movies')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Hero Parallax optimizado */}
      <Parallax
        speed={0.25}
        className="py-12 md:py-20"
        background={
          <div className="absolute inset-0 overflow-hidden">
            {/* Blur shapes optimizados - Menos intensos */}
            <div 
              className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-25" 
              style={{ 
                background: 'radial-gradient(closest-side, #ef4444, transparent)',
                filter: 'blur(60px)'
              }} 
            />
            <div 
              className="absolute top-0 -right-24 w-96 h-96 rounded-full opacity-20" 
              style={{ 
                background: 'radial-gradient(closest-side, #6366f1, transparent)',
                filter: 'blur(60px)'
              }} 
            />
          </div>
        }
      >
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl glass-morphism rounded-2xl p-8 md:p-12">
            <span className="inline-block text-red-600 font-semibold tracking-wider uppercase text-xs mb-3">Discover</span>
            <h1 className="animate-fade-in">
              {/* Light logo */}
              <img src={logo} alt="AllMovies" className="h-auto w-48 logo-light" />
        
              {/* Dark logo */}
              <img src={logoDark} alt="AllMovies" className="h-auto w-48 logo-dark" />
            </h1>
            <p className="mt-4 text-lg animate-slide-in-up" style={{ color: 'var(--fg-muted)' }}>
              Explore coming soon and trending titles with a clean, fast experience.
            </p>
          </div>
        </div>
      </Parallax>
      {/* Coming Soon Section */}
      <section className="py-8 sm:py-12 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: 'var(--fg)' }}>Coming soon</h2>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="p-2 sm:p-3 rounded-full blur-button transition-all duration-200 hover:scale-105">
              <ChevronLeft size={20} style={{ color: 'var(--fg)' }} />
            </button>
            <button className="p-2 sm:p-3 rounded-full blur-button transition-all duration-200 hover:scale-105">
              <ChevronRight size={20} style={{ color: 'var(--fg)' }} />
            </button>
          </div>
        </div>
        <MovieGrid movies={comingSoonMovies} />
      </section>

      {/* Trending Movies Section */}
      <section className="py-8 sm:py-12 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: 'var(--fg)' }}>Trending Movies</h2>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button className="p-2 sm:p-3 rounded-full blur-button transition-all duration-200 hover:scale-105">
              <ChevronLeft size={20} style={{ color: 'var(--fg)' }} />
            </button>
            <button className="p-2 sm:p-3 rounded-full blur-button transition-all duration-200 hover:scale-105">
              <ChevronRight size={20} style={{ color: 'var(--fg)' }} />
            </button>
          </div>
        </div>
        <MovieGrid movies={trendingMovies} />
      </section>
    </div>
  )
}

export default Home
