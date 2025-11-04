import client from './api/client'

export interface ReviewAuthorDetails {
  name: string
  username: string
  avatar_path: string | null
  rating: number | null
}

export interface Review {
  id: string
  author: string
  author_details: ReviewAuthorDetails
  content: string
  created_at: string
  updated_at: string
  url: string
}

export interface ReviewsResponse {
  id: number
  page: number
  results: Review[]
  total_pages: number
  total_results: number
}

export const reviewsService = {
  /**
   * Obtener reseñas de una película
   */
  async getMovieReviews(movieId: number, page = 1): Promise<ReviewsResponse> {
    const { data } = await client.get(`/movie/${movieId}/reviews`, {
      params: { page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Obtener reseñas de una serie
   */
  async getTVReviews(tvId: number, page = 1): Promise<ReviewsResponse> {
    const { data } = await client.get(`/tv/${tvId}/reviews`, {
      params: { page, language: 'es-ES' },
    })
    return data
  },

  /**
   * Obtener URL del avatar del autor
   */
  getAvatarUrl(review: Review, size: 'small' | 'medium' | 'large' = 'small'): string | null {
    if (!review.author_details.avatar_path) return null
    
    const sizeMap = {
      small: 'w45',
      medium: 'w185',
      large: 'w300'
    }
    
    // Si comienza con /https, es una URL de Gravatar
    if (review.author_details.avatar_path.startsWith('/https')) {
      return review.author_details.avatar_path.substring(1)
    }
    
    // Si es path de TMDB
    return `https://image.tmdb.org/t/p/${sizeMap[size]}${review.author_details.avatar_path}`
  },

  /**
   * Truncar contenido de reseña
   */
  truncateReview(review: Review, maxLength = 300): string {
    if (review.content.length <= maxLength) return review.content
    return review.content.substring(0, maxLength) + '...'
  }
}
