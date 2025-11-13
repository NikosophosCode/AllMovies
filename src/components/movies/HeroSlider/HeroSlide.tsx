import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Star, Play, Heart } from 'lucide-react'
import type { Movie } from '@/types'
import { useMovies } from '@/hooks'
import OptimizedImage from '@/components/common/OptimizedImage'

interface HeroSlideProps {
  movie: Movie
  isActive: boolean
  priority?: boolean
}

const HeroSlide = memo(({ movie, isActive, priority = false }: HeroSlideProps) => {
  const { addFavorite, isFavorite } = useMovies()
  const favorite = isFavorite('movie', movie.id)

  const handleAddFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!favorite) {
      addFavorite('movie', movie.id)
    }
  }

  const rating = movie.vote_average.toFixed(1)
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : ''

  return (
    <div
      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
        isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
      }`}
      style={{ willChange: isActive ? 'opacity, transform' : 'auto' }}
    >
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-1200 ease-out ${
            isActive ? 'scale-100' : 'scale-110'
          }`}
        >
          <OptimizedImage
            path={movie.backdrop_path || movie.poster_path}
            alt={movie.title}
            type="backdrop"
            size="original"
            className="w-full h-full"
            priority={priority}
            fetchPriority={priority ? 'high' : 'auto'}
            placeholder={!priority}
            aspectRatio="auto"
          />
        </div>

        {/* Gradient Overlay - From transparent to solid black */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
        
        {/* Additional side gradients for better text readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-black/30" />
      </div>

      {/* Content Container */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
          <div className="max-w-3xl">
            {/* Movie Title with Animation */}
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 transition-all duration-700 delay-100 ${
                isActive
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
                lineHeight: '1.1',
              }}
            >
              {movie.title}
            </h1>

            {/* Movie Meta Info */}
            <div
              className={`flex items-center gap-4 mb-4 sm:mb-6 transition-all duration-700 delay-200 ${
                isActive
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Rating Badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/90 backdrop-blur-sm">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
                <span className="text-sm sm:text-base font-bold text-white">
                  {rating}
                </span>
              </div>

              {/* Year */}
              {year && (
                <span className="text-base sm:text-lg font-semibold text-white/90">
                  {year}
                </span>
              )}

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Movie Overview */}
            <p
              className={`text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 line-clamp-3 leading-relaxed transition-all duration-700 delay-300 ${
                isActive
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
            >
              {movie.overview || 'No hay descripción disponible.'}
            </p>

            {/* Action Buttons */}
            <div
              className={`flex flex-wrap items-center gap-3 sm:gap-4 transition-all duration-700 delay-400 ${
                isActive
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Watch Now Button */}
              <Link
                to={`/movies/${movie.id}`}
                className="group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                <span className="text-sm sm:text-base">Ver detalles</span>
              </Link>

              {/* Add to Favorites Button */}
              <button
                onClick={handleAddFavorite}
                disabled={favorite}
                className={`group flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl ${
                  favorite
                    ? 'bg-white/20 text-white/60 cursor-not-allowed'
                    : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 hover:scale-105'
                }`}
              >
                <Heart
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${
                    favorite ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span className="text-sm sm:text-base">
                  {favorite ? 'En Favoritos' : 'Agregar a Favoritos'}
                </span>
              </button>

              {/* View Details Link */}
              <Link
                to={`/movies/${movie.id}`}
                className="hidden md:flex items-center gap-2 px-6 py-3 text-white/90 font-medium hover:text-white transition-colors duration-300 group"
              >
                <span className="text-sm sm:text-base border-b border-white/50 group-hover:border-white">
                  Más información
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

HeroSlide.displayName = 'HeroSlide'

export default HeroSlide
