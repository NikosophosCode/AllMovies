import { POSTER_SIZES, BACKDROP_SIZES } from './constants'

export const getImageUrl = (
  path: string | null,
  type: 'poster' | 'backdrop' = 'poster',
  size: 'small' | 'medium' | 'large' = 'medium'
): string => {
  if (!path) {
    return `https://via.placeholder.com/${type === 'poster' ? '342x513' : '1280x720'}?text=No+Image`
  }

  const baseUrl = type === 'poster' ? POSTER_SIZES : BACKDROP_SIZES
  const sizeUrl = baseUrl[size.toUpperCase() as keyof typeof baseUrl]
  return `${sizeUrl}${path}`
}

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

export const formatRating = (rating: number): string => {
  return (Math.round(rating * 10) / 10).toFixed(1)
}

export const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.substring(0, maxLength)}...`
}

export const formatNumber = (num: number): string => {
  if (!num) return '0'
  
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`
  }
  
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`
  }
  
  return num.toString()
}

export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
