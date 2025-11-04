import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Star, Play } from 'lucide-react'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Season } from '@/types'
import { seriesService } from '@/services'
import { getImageUrl, formatDate, formatRating } from '@/utils/formatters'

export default function SeasonDetail() {
  const { seriesId, seasonNumber } = useParams<{ seriesId: string; seasonNumber: string }>()
  const navigate = useNavigate()
  const [season, setSeason] = useState<Season | null>(null)
  const [seriesName, setSeriesName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSeason = async () => {
      try {
        setLoading(true)
        const [seasonData, seriesData] = await Promise.all([
          seriesService.getSeason(Number(seriesId), Number(seasonNumber)),
          seriesService.getDetails(Number(seriesId))
        ])
        setSeason(seasonData)
        setSeriesName(seriesData.name)
      } catch (err) {
        setError('Error al cargar los detalles de la temporada')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (seriesId && seasonNumber) fetchSeason()
  }, [seriesId, seasonNumber])

  if (loading) return <LoadingSpinner fullScreen />
  if (error) return <ErrorMessage message={error} />
  if (!season) return <ErrorMessage message="Temporada no encontrada" />

  const posterUrl = getImageUrl(season.poster_path, 'poster', 'large')

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

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Poster */}
        <div className="md:col-span-1">
          <img
            src={posterUrl}
            alt={season.name}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="md:col-span-3">
          <p className="text-primary-500 font-semibold mb-2">{seriesName}</p>
          <h1 className="text-4xl font-bold mb-4">{season.name}</h1>
          
          {season.air_date && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
              <Calendar size={18} />
              <span>{formatDate(season.air_date)}</span>
              <span className="mx-2">•</span>
              <span>{season.episodes?.length || 0} episodios</span>
            </div>
          )}

          {season.overview && (
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Sinopsis</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {season.overview}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Episodios */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Episodios</h2>
        
        {!season.episodes || season.episodes.length === 0 ? (
          <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-slate-600 dark:text-slate-400">
              No hay información de episodios disponible
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {season.episodes.map((episode) => (
              <div
                key={episode.id}
                className="glass-card rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Imagen del episodio */}
                  <div className="md:col-span-1 relative">
                    <img
                      src={getImageUrl(episode.still_path, 'backdrop', 'medium')}
                      alt={episode.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 transition-colors">
                        <Play size={24} fill="currentColor" />
                      </button>
                    </div>
                    
                    {/* Número de episodio badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Ep {episode.episode_number}
                    </div>
                  </div>

                  {/* Info del episodio */}
                  <div className="md:col-span-3 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-1">
                          {episode.episode_number}. {episode.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                          {episode.air_date && (
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{formatDate(episode.air_date)}</span>
                            </div>
                          )}
                          {episode.runtime && (
                            <span>{episode.runtime} min</span>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      {episode.vote_average > 0 && (
                        <div className="flex items-center gap-1 bg-primary-500 text-white px-3 py-1 rounded-lg ml-4">
                          <Star size={14} fill="currentColor" />
                          <span className="font-bold text-sm">
                            {formatRating(episode.vote_average)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Descripción */}
                    {episode.overview && (
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify line-clamp-3">
                        {episode.overview}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
