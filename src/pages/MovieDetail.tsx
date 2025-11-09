import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Clock, Calendar, Star, Play, List } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import Rating from '@/components/common/Rating'
import Recommendations from '@/components/common/Recommendations'
import TrailerModal from '@/components/movies/TrailerModal'
import { AddToListModal, OptimizedImage } from '@/components/common'
import { ReviewsSection } from '@/components/reviews'
import type { Movie, Video } from '@/types'
import { movieService, authService, reviewsService } from '@/services'
import { useMovies, useAuth, useMetaTags } from '@/hooks'
import { getImageUrl, formatDate, formatRating, formatRuntime } from '@/utils/formatters'
import { shareContent, getMovieShareData } from '@/utils/share'

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrailer, setSelectedTrailer] = useState<Video | null>(null)
  const [showTrailerModal, setShowTrailerModal] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [showAddToListModal, setShowAddToListModal] = useState(false)
  const { isFavorite, addFavorite, removeFavorite } = useMovies()
  const { isAuthenticated, sessionId } = useAuth()

  const movieId = Number(id)
  const favorited = isFavorite('movie', movieId)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const data = await movieService.getDetails(movieId)
        setMovie(data)

        // Buscar trailer
        const trailer = data.videos?.results?.find(
          (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
        )
        if (trailer) setSelectedTrailer(trailer)

        // Cargar rating del usuario si está autenticado
        if (isAuthenticated && sessionId) {
          try {
            const accountStates = await authService.getMovieAccountStates(movieId, sessionId)
            if (accountStates.rated && typeof accountStates.rated.value === 'number') {
              setUserRating(accountStates.rated.value)
            }
          } catch (err) {
            console.error('Error al cargar rating del usuario:', err)
          }
        }
      } catch (err) {
        setError('Error al cargar los detalles de la película')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (movieId) fetchMovie()
  }, [movieId, isAuthenticated, sessionId])

  // SEO Meta Tags
  useMetaTags({
    title: movie?.title || 'Película',
    description: movie?.overview || 'Descubre esta película en AllMovies',
    image: movie ? getImageUrl(movie.poster_path, 'poster', 'large') : undefined,
    url: window.location.href,
    type: 'movie',
    keywords: movie?.genres?.map(g => g.name) || [],
    publishedTime: movie?.release_date,
  })

  const handleFavorite = () => {
    if (favorited) {
      removeFavorite('movie', movieId)
    } else {
      addFavorite('movie', movieId)
    }
  }

  const handleRating = async (rating: number) => {
    if (!isAuthenticated || !sessionId) return
    
    try {
      await authService.rateMovie(movieId, sessionId, rating)
      setUserRating(rating)
    } catch (err) {
      console.error('Error al valorar película:', err)
    }
  }

  const handleShare = async () => {
    if (!movie) return
    
    const shareData = getMovieShareData(movieId, movie.title)
    const result = await shareContent(shareData)
    
    if (result.success) {
      // Opcional: mostrar un toast o feedback visual
      console.log(`Compartido exitosamente vía ${result.method}`)
    } else {
      console.error('Error al compartir:', result.error)
      alert(result.error || 'No se pudo compartir')
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />
  if (!movie) return <ErrorMessage message="Película no encontrada" />

  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'large')

  return (
    <div className="animate-fade-in">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 m-6 transition-colors"
        style={{ color: 'var(--accent)' }}
      >
        <ArrowLeft size={20} />
        Volver atrás
      </button>

      {/* Backdrop */}
      <div
        className="relative w-full h-96 rounded-lg overflow-hidden mb-8 bg-cover bg-center"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-black/40" />

        {/* Contenido flotante */}
        <div className="absolute inset-0 flex items-center justify-center">
          {selectedTrailer && (
            <button 
              onClick={() => setShowTrailerModal(true)}
              className="rounded-full p-4 transition-all duration-200 hover:scale-110 text-white"
              style={{ backgroundColor: 'var(--accent)' }}
              aria-label="Play trailer"
            >
              <Play size={32} fill="currentColor" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Poster y acciones */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <OptimizedImage
              path={movie.poster_path}
              alt={movie.title}
              type="poster"
              size="large"
              aspectRatio="poster"
              className="w-full rounded-lg shadow-lg mb-4"
            />

            <div className="space-y-3">
              <button
                onClick={handleFavorite}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: favorited ? 'var(--accent)' : 'var(--surface-muted)',
                  color: favorited ? 'white' : 'var(--fg)'
                }}
              >
                <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
                {favorited ? 'Favorito' : 'Añadir'}
              </button>

              <button 
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors"
                style={{
                  backgroundColor: 'var(--surface-muted)',
                  color: 'var(--fg)'
                }}
              >
                <Share2 size={20} />
                Compartir
              </button>

              {/* Botón Añadir a Lista */}
              {isAuthenticated && (
                <button 
                  onClick={() => setShowAddToListModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors"
                  style={{
                    backgroundColor: 'var(--surface-muted)',
                    color: 'var(--fg)'
                  }}
                >
                  <List size={20} />
                  Añadir a lista
                </button>
              )}

              {/* Rating Component */}
              {isAuthenticated && (
                <div className="pt-3">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--fg)' }}>
                    Tu Valoración
                  </p>
                  <Rating
                    initialRating={userRating}
                    onRate={handleRating}
                    size="medium"
                    maxRating={10}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--fg)' }}>{movie.title}</h1>
          {movie.tagline && (
            <p className="text-lg mb-6 italic" style={{ color: 'var(--fg-muted)' }}>
              "{movie.tagline}"
            </p>
          )}

          {/* Información rápida */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-1 text-white px-3 py-1 rounded-lg"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{formatRating(movie.vote_average)}</span>
              </div>
              <span className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                {movie.vote_count} votos
              </span>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-2" style={{ color: 'var(--fg-muted)' }}>
              <Calendar size={18} />
              <span>{formatDate(movie.release_date)}</span>
            </div>

            {/* Runtime */}
            {movie.runtime && (
              <div className="flex items-center gap-2" style={{ color: 'var(--fg-muted)' }}>
                <Clock size={18} />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}
          </div>

          {/* Géneros */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3" style={{ color: 'var(--fg)' }}>Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-2 rounded-full text-sm transition-colors cursor-pointer"
                    style={{
                      backgroundColor: 'var(--surface-muted)',
                      color: 'var(--fg)'
                    }}
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sinopsis */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--fg)' }}>Sinopsis</h3>
            <p className="leading-relaxed text-justify" style={{ color: 'var(--fg-muted)' }}>
              {movie.overview}
            </p>
          </div>

          {/* Presupuesto y recaudación */}
          {(movie.budget || movie.revenue) && (
            <div 
              className="grid grid-cols-2 gap-4 mb-8 p-4 rounded-lg"
              style={{ backgroundColor: 'var(--surface-muted)' }}
            >
              {movie.budget && movie.budget > 0 && (
                <div>
                  <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Presupuesto</p>
                  <p className="font-bold" style={{ color: 'var(--fg)' }}>${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div>
                  <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Recaudación</p>
                  <p className="font-bold" style={{ color: 'var(--fg)' }}>${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>
          )}

          {/* Reparto */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--fg)' }}>Reparto Principal</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movie.credits.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <OptimizedImage
                      path={actor.profile_path}
                      alt={actor.name}
                      type="profile"
                      size="small"
                      aspectRatio="poster"
                      className="w-full h-40 rounded-lg mb-2"
                    />
                    <p className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>{actor.name}</p>
                    <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones */}
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--fg)' }}>Películas Similares</h3>
            <Recommendations
              mediaId={Number(id)}
              mediaType="movie"
              service={movieService}
            />
          </div>

          {/* Reseñas */}
          <ReviewsSection
            mediaId={movieId}
            mediaType="movie"
            fetchReviews={reviewsService.getMovieReviews}
          />
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        video={selectedTrailer}
        isOpen={showTrailerModal}
        onClose={() => setShowTrailerModal(false)}
      />

      {/* Add to List Modal */}
      <AddToListModal
        isOpen={showAddToListModal}
        onClose={() => setShowAddToListModal(false)}
        mediaId={movieId}
        mediaType="movie"
        mediaTitle={movie.title}
      />
    </div>
  )
}
