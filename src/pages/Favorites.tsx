import { useState, useMemo } from 'react'
import { Heart } from 'lucide-react'
import { useMovies } from '@/hooks'
import MovieGrid from '@/components/movies/MovieGrid'
import type { Movie, Series } from '@/types'
import { movieService, seriesService } from '@/services'
import { useAsync } from '@/hooks/useAsync'

interface FavoritesData {
  movies?: Movie[]
  tv?: Series[]
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
    
    let items: (Movie | Series)[] = []

    if (filter === 'all' || filter === 'movie') {
      items = [...items, ...(allData.movies || [])]
    }

    if (filter === 'all' || filter === 'tv') {
      items = [...items, ...(allData.tv || [])]
    }

    return items
  }, [filter, allData])

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 m-12">
        <Heart size={32} className="text-primary-500" fill="currentColor" />
        <h1 className="text-4xl font-bold">Mis Favoritos</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={64} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-xl text-slate-600 dark:text-slate-400">
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
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === type
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                }`}
              >
                {type === 'all' ? 'Todos' : type === 'movie' ? 'Películas' : 'Series'}
              </button>
            ))}
          </div>

          <MovieGrid movies={filteredFavorites as Movie[]} />
        </>
      )}
    </div>
  )
}


