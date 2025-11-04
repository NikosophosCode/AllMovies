import { useState } from 'react'
import { User, Expand, ExternalLink } from 'lucide-react'
import type { Review } from '@/services/reviews'
import { reviewsService } from '@/services'
import { formatDate } from '@/utils/formatters'
import './ReviewCard.css'

interface ReviewCardProps {
  review: Review
  expanded?: boolean
  onExpandChange?: (expanded: boolean) => void
}

/**
 * Tarjeta para mostrar reseñas
 * - Usa variables CSS para todos los colores
 * - Soporte expandible para ver contenido completo
 * - Avatar del autor con fallback
 * - Rating del autor mostrado como badge
 */
const ReviewCard = ({ review, expanded: initialExpanded = false, onExpandChange }: ReviewCardProps) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)
  const isTruncated = review.content.length > 300

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const avatarUrl = reviewsService.getAvatarUrl(review, 'small')
  const truncatedContent = isExpanded ? review.content : reviewsService.truncateReview(review)
  const hasRating = review.author_details.rating !== null

  return (
    <article className="review-card">
      {/* Header con autor e información */}
      <div className="review-header">
        {/* Avatar */}
        <div className="review-avatar-container">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={review.author}
              className="review-avatar"
              loading="lazy"
            />
          ) : (
            <div className="review-avatar-fallback">
              <User size={20} />
            </div>
          )}
        </div>

        {/* Información del autor */}
        <div className="review-author-info">
          <h4 className="review-author-name">{review.author}</h4>
          <p className="review-author-username">@{review.author_details.username}</p>
          <time className="review-date">{formatDate(review.created_at)}</time>
        </div>

        {/* Rating badge si existe */}
        {hasRating && (
          <div className="review-rating-badge">
            <span className="review-rating-number">{review.author_details.rating}</span>
            <span className="review-rating-max">/10</span>
          </div>
        )}
      </div>

      {/* Contenido de la reseña */}
      <div className="review-content">
        <p className={`review-text ${!isExpanded && isTruncated ? 'truncated' : ''}`}>
          {truncatedContent}
        </p>

        {/* Indicador de truncado */}
        {isTruncated && !isExpanded && (
          <div className="review-gradient-fade"></div>
        )}
      </div>

      {/* Footer con acciones */}
      <div className="review-footer">
        {/* Botones de acción */}
        <div className="review-actions">
          {isTruncated && (
            <button
              onClick={handleToggleExpand}
              className="review-action-btn review-expand-btn"
              aria-label={isExpanded ? 'Contraer reseña' : 'Expandir reseña'}
              type="button"
            >
              <Expand size={16} />
              <span>{isExpanded ? 'Menos' : 'Más'}</span>
            </button>
          )}

          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="review-action-btn review-link-btn"
            aria-label="Leer reseña completa en TMDB"
          >
            <ExternalLink size={16} />
            <span>Completa</span>
          </a>
        </div>

        {/* Metadata */}
        <div className="review-metadata">
          <span className="review-meta-label">
            {review.updated_at !== review.created_at ? 'Actualizado' : 'Publicado'} hace poco
          </span>
        </div>
      </div>
    </article>
  )
}

export default ReviewCard
