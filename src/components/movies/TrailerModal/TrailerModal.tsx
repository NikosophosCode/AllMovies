import { useState } from 'react'
import { X, Play } from 'lucide-react'
import type { Video } from '@/types'
import './TrailerModal.css'

interface TrailerModalProps {
  video: Video | null
  isOpen: boolean
  onClose: () => void
}

/**
 * Modal para reproducir trailers de YouTube
 * - Usa variables CSS para theming
 * - Soporte para tecla ESC para cerrar
 * - Optimizado con backdrop-filter
 */
const TrailerModal = ({ video, isOpen, onClose }: TrailerModalProps) => {
  const [isLoading, setIsLoading] = useState(true)

  if (!isOpen || !video) return null

  const youtubeUrl = `https://www.youtube.com/embed/${video.key}?autoplay=1&controls=1`

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Cerrar con ESC
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="trailer-modal-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Trailer modal"
    >
      {/* Contenedor principal */}
      <div className="trailer-modal-container">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="trailer-modal-close"
          aria-label="Cerrar modal"
          type="button"
        >
          <X size={28} />
        </button>

        {/* Wrapper de video para mantener aspect ratio */}
        <div className="trailer-video-wrapper">
          {isLoading && (
            <div className="trailer-loading">
              <Play size={48} className="trailer-play-icon" />
              <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
                Cargando trailer...
              </p>
            </div>
          )}

          <iframe
            width="100%"
            height="100%"
            src={youtubeUrl}
            title={video.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            className="trailer-iframe"
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        </div>

        {/* Información del video */}
        <div className="trailer-info">
          <h3 className="trailer-title">{video.name}</h3>
          <p className="trailer-type">{video.type}</p>
        </div>
      </div>
    </div>
  )
}

export default TrailerModal
