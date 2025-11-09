import { useState } from 'react'
import { getImageUrl } from '@/utils/formatters'
import { ImageOff } from 'lucide-react'

interface OptimizedImageProps {
  path: string | null
  alt: string
  type?: 'poster' | 'backdrop' | 'profile'
  size?: 'small' | 'medium' | 'large' | 'original'
  className?: string
  placeholder?: boolean
  aspectRatio?: 'poster' | 'backdrop' | 'square' | 'auto'
  priority?: boolean // Para LCP images
  fetchPriority?: 'high' | 'low' | 'auto'
}

const OptimizedImage = ({
  path,
  alt,
  type = 'poster',
  size = 'medium',
  className = '',
  placeholder = true,
  aspectRatio = 'auto',
  priority = false,
  fetchPriority = 'auto',
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(placeholder && !priority)
  const [hasError, setHasError] = useState(false)

  const imageSrc = getImageUrl(path, type, size)

  const aspectRatioClass = {
    poster: 'aspect-[2/3]',
    backdrop: 'aspect-[16/9]',
    square: 'aspect-square',
    auto: '',
  }[aspectRatio]

  // Dimensiones explícitas para prevenir layout shifts
  const dimensions = {
    poster: { width: '342', height: '513' },
    backdrop: { width: '1280', height: '720' },
    square: { width: '500', height: '500' },
    profile: { width: '342', height: '513' }, // Same as poster
  }[type] || { width: 'auto', height: 'auto' }

  return (
    <div
      className={`relative overflow-hidden bg-slate-200 dark:bg-slate-700 ${aspectRatioClass} ${className}`}
    >
      {isLoading && placeholder && !priority && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-br from-slate-300 to-slate-200 dark:from-slate-600 dark:to-slate-700" />
      )}

      {!hasError && path ? (
        <img
          src={imageSrc}
          alt={alt}
          width={dimensions.width}
          height={dimensions.height}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={fetchPriority}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-2">
          <ImageOff className="w-12 h-12" />
          <span className="text-sm">No disponible</span>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
