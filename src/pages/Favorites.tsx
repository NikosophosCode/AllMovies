import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import { useMovies } from '@/hooks'
import MediaCard from '@/components/common/MediaCard'
import type { Movie, Series } from '@/types'
import { movieService, seriesService } from '@/services'
import { useAsync } from '@/hooks/useAsync'

interface FavoritesData {
  movies?: Movie[]
  tv?: Series[]
}

// Tipo para items con información de tipo de media
type FavoriteItem = (Movie | Series) & {
  _mediaType: 'movie' | 'tv'
}

export default function Favorites() {
  const { favorites } = useMovies()
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all')

  const { data: allData } = useAsync<FavoritesData>(async () => {
    const movieIds = favorites.filter((f) => f.mediaType === 'movie').map((f) => f.mediaId)
    const tvIds = favorites.filter((f) => f.mediaType === 'tv').map((f) => f.mediaId)

    const [movieDetails, tvDetails] = await Promise.all([
      Promise.all(movieIds.map((id) => movieService.getDetails(id).catch(() => null))),
      Promise.all(tvIds.map((id) => seriesService.getDetails(id).catch(() => null))),
    ])

    return {
      movies: movieDetails.filter((m): m is Movie => m !== null),
      tv: tvDetails.filter((s): s is Series => s !== null),
    }
  }, !!favorites.length)

  const filteredFavorites = useMemo(() => {
    if (!allData) return []
    
    let items: FavoriteItem[] = []

    if (filter === 'all' || filter === 'movie') {
      const moviesWithType = (allData.movies || []).map(movie => ({
        ...movie,
        _mediaType: 'movie' as const
      }))
      items = [...items, ...moviesWithType]
    }

    if (filter === 'all' || filter === 'tv') {
      const tvWithType = (allData.tv || []).map(series => ({
        ...series,
        _mediaType: 'tv' as const
      }))
      items = [...items, ...tvWithType]
    }

    return items
  }, [filter, allData])

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 m-12">
        <Heart size={32} style={{ color: 'var(--accent)' }} fill="currentColor" />
        <h1 className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>Mis Favoritos</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={64} className="mx-auto mb-4" style={{ color: 'var(--fg-soft)' }} />
          <p className="text-xl" style={{ color: 'var(--fg-muted)' }}>
            Aún no tienes favoritos. ¡Comienza a añadir!
          </p>
        </div>
      ) : (
        <>
          {/* Filtros */}
          <div className="flex gap-2 mb-8">
            {(['all', 'movie', 'tv'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: filter === type ? 'var(--accent)' : 'var(--surface-muted)',
                  color: filter === type ? 'white' : 'var(--fg)'
                }}
              >
                {type === 'all' ? 'Todos' : type === 'movie' ? 'Películas' : 'Series'}
              </button>
            ))}
          </div>

          {/* Grid de favoritos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
            {filteredFavorites.map((item) => (
              <MediaCard
                key={`${item._mediaType}-${item.id}`}
                media={item as Movie | Series}
                mediaType={item._mediaType}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}


