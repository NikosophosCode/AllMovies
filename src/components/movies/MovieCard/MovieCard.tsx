import { Heart, Star } from 'lucide-react'
import type { Movie } from '@/types'
import { getImageUrl, formatRating } from '@/utils/formatters'
import { useMovies } from '@/hooks'
import { Link } from 'react-router-dom'

interface MovieCardProps {
  movie: Movie
  onClick?: () => void
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const { isFavorite, addFavorite, removeFavorite } = useMovies()
  const favorited = isFavorite('movie', movie.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      removeFavorite('movie', movie.id)
    } else {
      addFavorite('movie', movie.id)
    }
  }

  return (
    <Link to={`/movies/${movie.id}`}>
      <div
        className="group cursor-pointer rounded-xl overflow-hidden glass-card transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
        onClick={onClick}
      >
        {/* Imagen del poster */}
        <div className="relative w-full rounded-xl aspect-2/3 overflow-hidden" style={{ backgroundColor: 'var(--surface-muted)' }}>
          <img
            src={getImageUrl(movie.poster_path, 'poster', 'medium')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {/* Overlay optimizado - Menos saturado */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2.5 blur-button rounded-full hover:scale-110 transition-all duration-200"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={18}
                className={favorited ? 'fill-red-500 text-red-500' : 'text-white'}
              />
            </button>
          </div>
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 glass-morphism px-3 py-2 rounded-lg">
            <Star size={14} className="fill-yellow-500 text-yellow-500 shrink-0" />
            <span className="text-white text-xs font-semibold">{formatRating(movie.vote_average)}</span>
            <span className="text-xs opacity-70" style={{ color: 'var(--fg-muted)' }}>• {movie.vote_count}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--fg)' }}>{movie.title}</h3>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--fg-muted)' }}>
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
