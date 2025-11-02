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
        className="group cursor-pointer rounded-xl overflow-hidden bg-(--card-bg) hover:bg-(--card-hover-bg) transition-all duration-300 transform hover:scale-105 border border-(--border) shadow-sm hover:shadow-lg"
        onClick={onClick}
      >
        {/* Imagen del poster */}
        <div className="relative w-full rounded-xl aspect-2/3 overflow-hidden bg-slate-200 dark:bg-slate-800">
          <img
            src={getImageUrl(movie.poster_path, 'poster', 'medium')}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300"
            loading="lazy"
          />
          {/* Overlay con botón de favoritos */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 p-2.5 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                size={18}
                className={favorited ? 'fill-red-500 text-red-500' : 'text-white'}
              />
            </button>
          </div>
          
          {/* Rating badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 backdrop-blur-sm p-4 rounded-lg">
            <Star size={14} className="fill-yellow-500 text-yellow-500 shrink-0" />
            <span className="text-white text-xs font-semibold">{formatRating(movie.vote_average)}</span>
            <span className="text-slate-300 text-xs">• {movie.vote_count}</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-semibold text-sm text-(--fg) line-clamp-1">{movie.title}</h3>
          <div className="flex items-center justify-between text-xs text-(--fg-muted)">
            <span>{new Date(movie.release_date).getFullYear()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MovieCard
