import { useEffect, useState } from 'react'
import MovieCarousel from '@/components/movies/MovieCarousel'
import { HeroSlider } from '@/components/movies/HeroSlider'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import SearchBar from '@/components/search/SearchBar'
import type { Movie } from '@/types'
import { movieService } from '@/services'
import { usePrefetch, useMetaTags } from '@/hooks'

const Home = () => {
  const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [heroMovies, setHeroMovies] = useState<Movie[]>([])
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
        const [upcoming, trending, popular, nowPlaying, topRated] = await Promise.all([
          movieService.getUpcoming(),
          movieService.getTrending(),
          movieService.getPopular(),
          movieService.getNowPlaying(),
          movieService.getTopRated()
        ])
        setComingSoonMovies(upcoming.results.slice(0, 12))
        setTrendingMovies(trending.results.slice(0, 20)) // Aumentado de 12 a 20
        
        // Obtener películas más variadas para el hero slider
        // Combinamos trending, popular, nowPlaying y topRated para mayor variedad
        const allHeroMovies = [
          ...trending.results,
          ...popular.results,
          ...nowPlaying.results,
          ...topRated.results
        ]
          .filter((movie, index, self) => 
            // Eliminar duplicados por ID
            index === self.findIndex(m => m.id === movie.id)
          )
          .filter(movie => 
            // Filtrar películas con buenas imágenes y rating
            movie.backdrop_path && 
            movie.vote_average >= 6.5 && // Bajado de 7 a 6.5 para más variedad
            movie.overview &&
            movie.popularity > 50 // Añadido filtro de popularidad
          )
          // Ordenar por una combinación de rating y popularidad para variedad
          .sort((a, b) => {
            const scoreA = (a.vote_average * 0.6) + (Math.log10(a.popularity) * 0.4)
            const scoreB = (b.vote_average * 0.6) + (Math.log10(b.popularity) * 0.4)
            return scoreB - scoreA
          })
          .slice(0, 10) // Tomar 10 en lugar de 6 para más rotación
        
        // Obtener detalles completos para las películas del hero
        const heroDetailsPromises = allHeroMovies.map(movie => 
          movieService.getDetails(movie.id)
        )
        const heroDetails = await Promise.all(heroDetailsPromises)
        setHeroMovies(heroDetails)

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
      {/* Hero Slider - Featured Movies */}
      {heroMovies.length > 0 && (
        <HeroSlider movies={heroMovies} autoPlayInterval={5000} />
      )}

      {/* Search Bar Section */}
      <section className="py-8 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
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
        <MovieCarousel movies={comingSoonMovies} mediaType="movie" title="" prioritizeFirst={true} />
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
