import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Clock, Calendar, Star, Play } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Movie, Video } from '@/types'
import { movieService } from '@/services'
import { useMovies } from '@/hooks'
import { getImageUrl, formatDate, formatRating, formatRuntime } from '@/utils/formatters'

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrailer, setSelectedTrailer] = useState<Video | null>(null)
  const { isFavorite, addFavorite, removeFavorite } = useMovies()

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
      } catch (err) {
        setError('Error al cargar los detalles de la película')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (movieId) fetchMovie()
  }, [movieId])

  const handleFavorite = () => {
    if (favorited) {
      removeFavorite('movie', movieId)
    } else {
      addFavorite('movie', movieId)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />
  if (!movie) return <ErrorMessage message="Película no encontrada" />

  const backdropUrl = getImageUrl(movie.backdrop_path, 'backdrop', 'large')
  const posterUrl = getImageUrl(movie.poster_path, 'poster', 'large')

  return (
    <div className="animate-fade-in">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 m-6 text-primary-500 hover:text-primary-600 transition-colors"
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
            <button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 transition-colors">
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
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg mb-4"
            />

            <div className="space-y-3">
              <button
                onClick={handleFavorite}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  favorited
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200'
                }`}
              >
                <Heart size={20} fill={favorited ? 'currentColor' : 'none'} />
                {favorited ? 'Favorito' : 'Añadir'}
              </button>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                <Share2 size={20} />
                Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="md:col-span-3">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          {movie.tagline && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 italic">
              "{movie.tagline}"
            </p>
          )}

          {/* Información rápida */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary-500 text-white px-3 py-1 rounded-lg">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{formatRating(movie.vote_average)}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {movie.vote_count} votos
              </span>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Calendar size={18} />
              <span>{formatDate(movie.release_date)}</span>
            </div>

            {/* Runtime */}
            {movie.runtime && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock size={18} />
                <span>{formatRuntime(movie.runtime)}</span>
              </div>
            )}
          </div>

          {/* Géneros */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full text-sm hover:bg-primary-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sinopsis */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-3">Sinopsis</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              {movie.overview}
            </p>
          </div>

          {/* Presupuesto y recaudación */}
          {(movie.budget || movie.revenue) && (
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
              {movie.budget && movie.budget > 0 && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Presupuesto</p>
                  <p className="font-bold">${(movie.budget / 1000000).toFixed(1)}M</p>
                </div>
              )}
              {movie.revenue && movie.revenue > 0 && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Recaudación</p>
                  <p className="font-bold">${(movie.revenue / 1000000).toFixed(1)}M</p>
                </div>
              )}
            </div>
          )}

          {/* Reparto */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Reparto Principal</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {movie.credits.cast.slice(0, 8).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={getImageUrl(actor.profile_path, 'poster', 'small')}
                      alt={actor.name}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <p className="font-semibold text-sm">{actor.name}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
