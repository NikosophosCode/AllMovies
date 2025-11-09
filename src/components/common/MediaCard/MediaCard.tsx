import { Heart, Star } from 'lucide-react'
import type { Movie, Series } from '@/types'
import { formatRating } from '@/utils/formatters'
import { useMovies, usePrefetch } from '@/hooks'
import { Link } from 'react-router-dom'
import { OptimizedImage } from '@/components/common'

interface MediaCardProps {
  media: Movie | Series
  mediaType?: 'movie' | 'tv'
  onClick?: () => void
  priority?: boolean // Para LCP optimization
}

// Type guards
const isMovie = (media: Movie | Series): media is Movie => {
  return 'title' in media
}

const isSeries = (media: Movie | Series): media is Series => {
  return 'name' in media
}

const MediaCard = ({ media, mediaType, onClick, priority = false }: MediaCardProps) => {
  // Auto-detectar el tipo si no se proporciona
  const detectedType = mediaType || (isMovie(media) ? 'movie' : 'tv')
  
  const { isFavorite, addFavorite, removeFavorite } = useMovies()
  const { prefetchMovie, prefetchSeries } = usePrefetch()
  const favorited = isFavorite(detectedType, media.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      removeFavorite(detectedType, media.id)
    } else {
      addFavorite(detectedType, media.id)
    }
  }

  const handleMouseEnter = () => {
    // Prefetch de detalles al hacer hover
    if (detectedType === 'movie') {
      prefetchMovie(media.id)
    } else {
      prefetchSeries(media.id)
    }
  }

  const title = isMovie(media) ? media.title : media.name
  const releaseDate = isMovie(media) ? media.release_date : media.first_air_date
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'
  const linkTo = detectedType === 'movie' ? `/movies/${media.id}` : `/series/${media.id}`

  return (
    <Link to={linkTo} onMouseEnter={handleMouseEnter}>
      <div
        className="group cursor-pointer rounded-xl overflow-hidden glass-card transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-lg"
        onClick={onClick}
      >
        {/* Imagen del poster */}
        <div className="relative w-full rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--surface-muted)' }}>
          <OptimizedImage
            path={media.poster_path}
            alt={title}
            type="poster"
            size="medium"
            aspectRatio="poster"
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            className="transition-transform duration-300 group-hover:scale-105"
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
          <div 
            className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-2 rounded-lg backdrop-blur-sm"
            style={{ 
              backgroundColor: 'var(--rating-bg)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Star size={14} className="fill-yellow-500 text-yellow-500 shrink-0" />
            <span className="text-xs font-semibold" style={{ color: 'var(--rating-fg)' }}>
              {formatRating(media.vote_average)}
            </span>
            {media.vote_count > 0 && (
              <span className="text-xs" style={{ color: 'var(--rating-muted)' }}>
                • {media.vote_count}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-semibold text-sm line-clamp-1" style={{ color: 'var(--fg)' }}>{title}</h3>
          <div className="flex items-center justify-between text-xs" style={{ color: 'var(--fg-muted)' }}>
            <span>{year}</span>
            {isSeries(media) && media.number_of_seasons && (
              <span>{media.number_of_seasons} {media.number_of_seasons === 1 ? 'temp.' : 'temps.'}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MediaCard
