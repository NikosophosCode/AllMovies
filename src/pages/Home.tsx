import { useEffect, useState } from 'react'
import MovieCarousel from '@/components/movies/MovieCarousel'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import SearchBar from '@/components/search/SearchBar'
import type { Movie } from '@/types'
import { movieService } from '@/services'
import Parallax from '@/components/common/Parallax'
import { usePrefetch, useMetaTags } from '@/hooks'
// import logo from '@/assets/icons/logo.webp'
// import logoDark from '@/assets/icons/logo-dark.webp'

const Home = () => {
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { prefetchPopularMovies, prefetchUpcoming } = usePrefetch()

  // SEO Meta Tags
  useMetaTags({
    title: 'AllMovies - Descubre Películas y Series',
    description: 'Explora las últimas películas, series de tendencia y próximos estrenos. Tu destino para todo el entretenimiento cinematográfico.',
    url: window.location.href,
    type: 'website',
    keywords: ['películas', 'series', 'cine', 'streaming', 'estrenos', 'trending'],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [upcoming, trending] = await Promise.all([
          movieService.getUpcoming(),
          movieService.getTrending()
        ])
        setComingSoonMovies(upcoming.results.slice(0, 12))
        setTrendingMovies(trending.results.slice(0, 12))

        // Prefetch de datos adicionales para mejorar la navegación
        prefetchPopularMovies()
        prefetchUpcoming()
      } catch (err) {
        setError('Error loading movies')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [prefetchPopularMovies, prefetchUpcoming])

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <div className="text-center py-12" style={{ color: 'var(--error-fg)' }}>{error}</div>

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
          <div className=" glass-morphism rounded-2xl p-4 md:p-10">
            <span className="inline-block text-red-600 font-semibold tracking-wider uppercase text-xs mb-3">Discover</span>
            <p className=" text-lg animate-slide-in-up" style={{ color: 'var(--fg-muted)' }}>
              Explore coming soon and trending titles with a clean, fast experience.
            </p>
          </div>
        </div>
      </Parallax>

      {/* Search Bar Section */}
      <section className=" max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SearchBar placeholder="Busca películas, series, personas..." />
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-8 sm:py-12 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: 'var(--fg)' }}>Coming soon</h2>
        </div>
        <MovieCarousel movies={comingSoonMovies} mediaType="movie" title="" />
      </section>

      {/* Trending Movies Section */}
      <section className="py-8 sm:py-12 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold" style={{ color: 'var(--fg)' }}>Trending Movies</h2>
        </div>
        <MovieCarousel movies={trendingMovies} mediaType="movie" title="" />
      </section>
    </div>
  )
}

export default Home
