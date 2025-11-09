import { useState, useEffect } from 'react'
import { Bookmark, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks'
import MediaCard from '@/components/common/MediaCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Movie, Series } from '@/types'
import { authService } from '@/services'

interface WatchlistData {
  movies: Movie[]
  series: Series[]
  loading: boolean
  error: string | null
}

export default function Watchlist() {
  const { isAuthenticated, user, sessionId } = useAuth()
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all')
  const [watchlistData, setWatchlistData] = useState<WatchlistData>({
    movies: [],
    series: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated || !user || !sessionId) {
        setWatchlistData(prev => ({ ...prev, loading: false }))
        return
      }

      try {
        setWatchlistData(prev => ({ ...prev, loading: true, error: null }))

        const [moviesRes, seriesRes] = await Promise.all([
          authService.getWatchlistMovies(user.id, sessionId),
          authService.getWatchlistTVShows(user.id, sessionId),
        ])

        setWatchlistData({
          movies: moviesRes.results || [],
          series: seriesRes.results || [],
          loading: false,
          error: null,
        })
      } catch (err) {
        console.error('Error al cargar watchlist:', err)
        setWatchlistData(prev => ({
          ...prev,
          loading: false,
          error: 'No se pudo cargar tu watchlist',
        }))
      }
    }

    fetchWatchlist()
  }, [isAuthenticated, user, sessionId])

  // Filtrar contenido según selección
  const filteredContent = () => {
    const items: Array<{ data: Movie | Series; type: 'movie' | 'tv' }> = []
    
    if (filter === 'all' || filter === 'movie') {
      watchlistData.movies.forEach(movie => {
        items.push({ data: movie, type: 'movie' })
      })
    }
    
    if (filter === 'all' || filter === 'tv') {
      watchlistData.series.forEach(series => {
        items.push({ data: series, type: 'tv' })
      })
    }

    return items
  }

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-24">
        <AlertCircle size={64} className="mb-4" style={{ color: 'var(--fg-muted)' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Inicia sesión para ver tu watchlist
        </h2>
        <p className="text-center max-w-md" style={{ color: 'var(--fg-muted)' }}>
          Necesitas autenticarte con TMDB para acceder a tu watchlist personalizada.
        </p>
      </div>
    )
  }

  if (watchlistData.loading) {
    return <LoadingSpinner fullScreen />
  }

  if (watchlistData.error) {
    return <ErrorMessage message={watchlistData.error} />
  }

  const totalItems = watchlistData.movies.length + watchlistData.series.length
  const content = filteredContent()

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Bookmark size={32} style={{ color: 'var(--accent)' }} fill="currentColor" />
        <h1 className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>Mi Watchlist</h1>
      </div>

      {totalItems === 0 ? (
        <div className="text-center py-24">
          <Clock size={64} className="mx-auto mb-4" style={{ color: 'var(--fg-muted)', opacity: 0.5 }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
            Tu watchlist está vacía
          </h2>
          <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
            Añade películas y series para verlas más tarde.
          </p>
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: filter === 'all' ? 'var(--accent)' : 'var(--surface-muted)',
                color: filter === 'all' ? 'white' : 'var(--fg)',
              }}
            >
              Todos ({totalItems})
            </button>
            <button
              onClick={() => setFilter('movie')}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: filter === 'movie' ? 'var(--accent)' : 'var(--surface-muted)',
                color: filter === 'movie' ? 'white' : 'var(--fg)',
              }}
            >
              Películas ({watchlistData.movies.length})
            </button>
            <button
              onClick={() => setFilter('tv')}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: filter === 'tv' ? 'var(--accent)' : 'var(--surface-muted)',
                color: filter === 'tv' ? 'white' : 'var(--fg)',
              }}
            >
              Series ({watchlistData.series.length})
            </button>
          </div>

          {/* Grid de contenido */}
          {content.length === 0 ? (
            <div className="text-center py-12">
              <p style={{ color: 'var(--fg-muted)' }}>
                No hay {filter === 'movie' ? 'películas' : 'series'} en tu watchlist.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {content.map((item) => (
                <MediaCard
                  key={`${item.type}-${item.data.id}`}
                  media={item.data}
                  mediaType={item.type}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
