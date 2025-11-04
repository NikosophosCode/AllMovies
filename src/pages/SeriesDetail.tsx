import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, Share2, Calendar, Star, Play, Tv } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Series, Video } from '@/types'
import { seriesService } from '@/services'
import { useMovies } from '@/hooks'
import { getImageUrl, formatDate, formatRating } from '@/utils/formatters'

export default function SeriesDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTrailer, setSelectedTrailer] = useState<Video | null>(null)
  const { isFavorite, addFavorite, removeFavorite } = useMovies()

  const seriesId = Number(id)
  const favorited = isFavorite('tv', seriesId)

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true)
        const data = await seriesService.getDetails(seriesId)
        setSeries(data)

        // Buscar trailer
        const trailer = data.videos?.results?.find(
          (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
        )
        if (trailer) setSelectedTrailer(trailer)
      } catch (err) {
        setError('Error al cargar los detalles de la serie')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (seriesId) fetchSeries()
  }, [seriesId])

  const handleFavorite = () => {
    if (favorited) {
      removeFavorite('tv', seriesId)
    } else {
      addFavorite('tv', seriesId)
    }
  }

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />
  if (!series) return <ErrorMessage message="Serie no encontrada" />

  const backdropUrl = getImageUrl(series.backdrop_path, 'backdrop', 'large')
  const posterUrl = getImageUrl(series.poster_path, 'poster', 'large')

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
              alt={series.name}
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
          <h1 className="text-4xl font-bold mb-2">{series.name}</h1>
          {series.tagline && (
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 italic">
              "{series.tagline}"
            </p>
          )}

          {/* Información rápida */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-primary-500 text-white px-3 py-1 rounded-lg">
                <Star size={18} fill="currentColor" />
                <span className="font-bold">{formatRating(series.vote_average)}</span>
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {series.vote_count} votos
              </span>
            </div>

            {/* Fecha */}
            {series.first_air_date && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar size={18} />
                <span>{formatDate(series.first_air_date)}</span>
              </div>
            )}

            {/* Temporadas */}
            {series.number_of_seasons && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Tv size={18} />
                <span>
                  {series.number_of_seasons} {series.number_of_seasons === 1 ? 'temporada' : 'temporadas'}
                  {series.number_of_episodes && ` • ${series.number_of_episodes} episodios`}
                </span>
              </div>
            )}
          </div>

          {/* Estado */}
          {series.status && (
            <div className="mb-8">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  series.status === 'Returning Series'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : series.status === 'Ended'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}
              >
                {series.status === 'Returning Series'
                  ? 'En producción'
                  : series.status === 'Ended'
                  ? 'Finalizada'
                  : series.status}
              </span>
            </div>
          )}

          {/* Géneros */}
          {series.genres && series.genres.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Géneros</h3>
              <div className="flex flex-wrap gap-2">
                {series.genres.map((genre) => (
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
              {series.overview}
            </p>
          </div>

          {/* Temporadas */}
          {series.seasons && series.seasons.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Temporadas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {series.seasons
                  .filter((season) => season.season_number > 0)
                  .map((season) => (
                    <button
                      key={season.id}
                      onClick={() => navigate(`/series/${seriesId}/season/${season.season_number}`)}
                      className="glass-card rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 text-left"
                    >
                      <img
                        src={getImageUrl(season.poster_path, 'poster', 'small')}
                        alt={season.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <p className="font-semibold text-sm">{season.name}</p>
                        {season.air_date && (
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {new Date(season.air_date).getFullYear()}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Reparto */}
          {series.credits?.cast && series.credits.cast.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Reparto Principal</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {series.credits.cast.slice(0, 8).map((actor) => (
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
