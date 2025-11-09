import { useCallback } from 'react'
import { movieService, seriesService, searchService } from '@/services'
import { apiCache } from '@/utils/lruCache'

/**
 * Hook para prefetch de datos
 * Permite cargar datos de forma anticipada para mejorar la UX
 */
export const usePrefetch = () => {
  /**
   * Prefetch de detalles de película
   */
  const prefetchMovie = useCallback(async (movieId: number) => {
    const cacheKey = `movie-${movieId}`
    
    // Si ya está en cache, no hacer nada
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      const data = await movieService.getDetails(movieId)
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch movie error:', error)
    }
  }, [])

  /**
   * Prefetch de detalles de serie
   */
  const prefetchSeries = useCallback(async (seriesId: number) => {
    const cacheKey = `series-${seriesId}`
    
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      const data = await seriesService.getDetails(seriesId)
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch series error:', error)
    }
  }, [])

  /**
   * Prefetch de películas populares
   */
  const prefetchPopularMovies = useCallback(async () => {
    const cacheKey = 'movies-popular'
    
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      const data = await movieService.getPopular()
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch popular movies error:', error)
    }
  }, [])

  /**
   * Prefetch de películas próximas
   */
  const prefetchUpcoming = useCallback(async () => {
    const cacheKey = 'movies-upcoming'
    
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      const data = await movieService.getUpcoming()
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch upcoming error:', error)
    }
  }, [])

  /**
   * Prefetch de series populares
   */
  const prefetchPopularSeries = useCallback(async () => {
    const cacheKey = 'series-popular'
    
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      const data = await seriesService.getPopular()
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch popular series error:', error)
    }
  }, [])

  /**
   * Prefetch de resultados de búsqueda
   */
  const prefetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) return

    const cacheKey = `search-${query}`
    
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      const data = await searchService.multi(query)
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch search error:', error)
    }
  }, [])

  /**
   * Prefetch de trending
   */
  const prefetchTrending = useCallback(async (mediaType: 'all' | 'movie' | 'tv' = 'all') => {
    const cacheKey = `trending-${mediaType}`
    
    if (apiCache.has(cacheKey)) {
      return
    }

    try {
      // Simulación - ajustar según tu servicio
      const data = await movieService.getPopular()
      apiCache.set(cacheKey, data)
    } catch (error) {
      console.debug('Prefetch trending error:', error)
    }
  }, [])

  /**
   * Limpia el cache de prefetch
   */
  const clearPrefetchCache = useCallback(() => {
    apiCache.clear()
  }, [])

  return {
    prefetchMovie,
    prefetchSeries,
    prefetchPopularMovies,
    prefetchUpcoming,
    prefetchPopularSeries,
    prefetchSearchResults,
    prefetchTrending,
    clearPrefetchCache,
  }
}
