import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import MediaCard from '@/components/common/MediaCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { Movie, Series, PaginatedResponse } from '@/types'
import './Recommendations.css'

interface RecommendationsProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
  service: {
    getRecommendations: (id: number, page?: number) => Promise<PaginatedResponse<Movie | Series>>
  }
}

/**
 * Componente de recomendaciones
 * Muestra películas o series recomendadas basadas en el item actual
 */
const Recommendations = ({ mediaId, mediaType, service }: RecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<(Movie | Series)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError(false)
        const data = await service.getRecommendations(mediaId, 1)
        setRecommendations(data.results || [])
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [mediaId, service])

  if (loading) {
    return (
      <div className="recommendations-section">
        <h3 className="recommendations-title">
          <Sparkles size={24} style={{ color: 'var(--accent)' }} />
          Recomendaciones
        </h3>
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || recommendations.length === 0) {
    return null
  }

  return (
    <div className="recommendations-section">
      <h3 className="recommendations-title">
        <Sparkles size={24} style={{ color: 'var(--accent)' }} />
        Recomendaciones
      </h3>
      
      <div className="recommendations-grid">
        {recommendations.slice(0, 6).map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            mediaType={mediaType}
          />
        ))}
      </div>
    </div>
  )
}

export default Recommendations
