import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import MovieCarousel from '@/components/movies/MovieCarousel'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { movieService, seriesService } from '@/services'
import type { Movie, Series, PaginatedResponse } from '@/types'

export default function Trending() {
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day')
  const [trendingMovies, setTrendingMovies] = useState<PaginatedResponse<Movie> | null>(null)
  const [trendingSeries, setTrendingSeries] = useState<PaginatedResponse<Series> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      try {
        const [movies, series] = await Promise.all([
          movieService.getTrending(timeWindow),
          seriesService.getTrending(timeWindow),
        ])
        setTrendingMovies(movies)
        setTrendingSeries(series)
      } catch (error) {
        console.error('Error fetching trending:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [timeWindow])

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="m-12">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp size={32} style={{ color: 'var(--accent)' }} />
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--fg)' }}>En Tendencia</h1>
        </div>
        <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
          Descubre qué está siendo tendencia en este momento
        </p>
      </div>

      {/* Selector de período */}
      <div className="flex gap-4 mb-8">
        {(['day', 'week'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setTimeWindow(period)}
            className="px-6 py-2 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: timeWindow === period ? 'var(--accent)' : 'var(--surface-muted)',
              color: timeWindow === period ? 'white' : 'var(--fg)'
            }}
          >
            {period === 'day' ? 'Hoy' : 'Esta Semana'}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {trendingMovies?.results && (
            <MovieCarousel
              title="Películas en Tendencia"
              movies={trendingMovies.results}
              mediaType="movie"
            />
          )}

          {trendingSeries?.results && (
            <MovieCarousel
              title="Series en Tendencia"
              movies={trendingSeries.results}
              mediaType="tv"
            />
          )}
        </>
      )}
    </div>
  )
}

