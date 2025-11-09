import { useEffect, useState } from 'react'
import { MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import ReviewCard from '../ReviewCard/ReviewCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Review, ReviewsResponse } from '@/services/reviews'
import './ReviewsSection.css'

interface ReviewsSectionProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
  fetchReviews: (id: number, page: number) => Promise<ReviewsResponse>
}

/**
 * Sección de reseñas para páginas de detalle
 * - Paginación completa
 * - Estados de loading, error y vacío
 * - Diseño responsive
 * - Variables CSS para theming
 */
const ReviewsSection = ({ mediaId, mediaType, fetchReviews }: ReviewsSectionProps) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchReviews(mediaId, currentPage)
        setReviews(data.results)
        setTotalPages(data.total_pages)
        setTotalResults(data.total_results)
      } catch (err) {
        console.error('Error al cargar reseñas:', err)
        setError('No se pudieron cargar las reseñas')
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [mediaId, currentPage, fetchReviews])

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      // Scroll suave al inicio de la sección
      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      // Scroll suave al inicio de la sección
      document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <div className="reviews-section-loading">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (totalResults === 0) {
    return (
      <div className="reviews-empty-state" id="reviews-section">
        <MessageCircle size={48} className="reviews-empty-icon" />
        <h3 className="reviews-empty-title">Sin reseñas</h3>
        <p className="reviews-empty-text">
          Todavía no hay reseñas para esta {mediaType === 'movie' ? 'película' : 'serie'}.
        </p>
      </div>
    )
  }

  return (
    <section className="reviews-section" id="reviews-section">
      {/* Header con contador */}
      <div className="reviews-header">
        <h3 className="reviews-title">
          <MessageCircle size={24} className="reviews-title-icon" />
          Reseñas
          <span className="reviews-count">({totalResults})</span>
        </h3>
      </div>

      {/* Grid de reseñas */}
      <div className="reviews-grid">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="reviews-pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="reviews-pagination-btn"
            aria-label="Página anterior"
          >
            <ChevronLeft size={20} />
            <span className="reviews-pagination-text">Anterior</span>
          </button>

          <div className="reviews-pagination-info">
            <span className="reviews-pagination-current">Página {currentPage}</span>
            <span className="reviews-pagination-separator">de</span>
            <span className="reviews-pagination-total">{totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="reviews-pagination-btn"
            aria-label="Página siguiente"
          >
            <span className="reviews-pagination-text">Siguiente</span>
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </section>
  )
}

export default ReviewsSection
