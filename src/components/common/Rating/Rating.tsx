import { useState } from 'react'
import { Star } from 'lucide-react'
import './Rating.css'

interface RatingProps {
  /**
   * Número máximo de estrellas (por defecto 10)
   */
  maxRating?: number

  /**
   * Callback cuando el usuario selecciona una calificación
   */
  onRate?: (rating: number) => void

  /**
   * Calificación inicial
   */
  initialRating?: number

  /**
   * Si está deshabilitado
   */
  disabled?: boolean

  /**
   * Tamaño de las estrellas en píxeles
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Mostrar solo lectura (sin interacción)
   */
  readOnly?: boolean

  /**
   * Label accesible
   */
  ariaLabel?: string
}

/**
 * Componente de Rating con estrellas
 * - Soporte para mouse hover
 * - Variables CSS para theming
 * - Accesible con teclado (Arrow keys)
 */
const Rating = ({
  maxRating = 10,
  onRate,
  initialRating = 0,
  disabled = false,
  size = 'medium',
  readOnly = false,
  ariaLabel = 'Rating',
}: RatingProps) => {
  const [hoveredRating, setHoveredRating] = useState(0)
  const [selectedRating, setSelectedRating] = useState(initialRating)

  const sizeClass = `rating-size-${size}`
  const isInteractive = !disabled && !readOnly && !!onRate

  const handleRate = (rating: number) => {
    if (!isInteractive) return

    setSelectedRating(rating)
    onRate?.(rating)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (!isInteractive) return

    let newRating = selectedRating

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        newRating = Math.min(index + 2, maxRating)
        break
      case 'ArrowLeft':
      case 'ArrowDown':
        newRating = Math.max(index, selectedRating - 1)
        break
      case 'Enter':
      case ' ':
        handleRate(index + 1)
        e.preventDefault()
        return
      default:
        return
    }

    setSelectedRating(newRating)
    onRate?.(newRating)
  }

  return (
    <div
      className={`rating-container ${sizeClass} ${disabled ? 'rating-disabled' : ''} ${readOnly ? 'rating-readonly' : ''}`}
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length: maxRating }).map((_, i) => {
        const rating = i + 1
        const isHovered = rating <= hoveredRating
        const isSelected = rating <= selectedRating

        return (
          <button
            key={i}
            className="rating-star"
            onMouseEnter={() => !readOnly && setHoveredRating(rating)}
            onMouseLeave={() => !readOnly && setHoveredRating(0)}
            onClick={() => handleRate(rating)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            disabled={disabled || readOnly}
            aria-label={`${rating} de ${maxRating} estrellas`}
            aria-current={selectedRating === rating}
            type="button"
          >
            <Star
              size={24}
              className={`rating-star-icon ${isHovered || isSelected ? 'rating-star-filled' : 'rating-star-empty'}`}
              fill={isHovered || isSelected ? 'currentColor' : 'none'}
            />
          </button>
        )
      })}

      {/* Display de calificación actual */}
      {selectedRating > 0 && (
        <span className="rating-display">
          {selectedRating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  )
}

export default Rating
