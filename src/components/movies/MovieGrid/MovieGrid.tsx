import type { Movie, Series } from '@/types'
import MediaCard from '@/components/common/MediaCard'

interface MovieGridProps {
  movies: (Movie | Series)[]
  mediaType?: 'movie' | 'tv'
  isLoading?: boolean
  onMovieClick?: (movieId: number) => void
}

const MovieGrid = ({ movies, mediaType = 'movie', isLoading, onMovieClick }: MovieGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="aspect-2/3 rounded-xl animate-pulse"
            style={{ backgroundColor: 'var(--surface-muted)' }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
      {movies.map((movie) => (
        <MediaCard
          key={movie.id}
          media={movie}
          mediaType={mediaType}
          onClick={() => onMovieClick?.(movie.id)}
        />
      ))}
    </div>
  )
}

export default MovieGrid
