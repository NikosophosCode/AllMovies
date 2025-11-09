import { useState, useEffect, useRef, useCallback } from 'react'
import { useInfiniteScroll, useFilters } from '@/hooks'
import { MovieGrid } from '@/components/movies'
import { LoadingSpinner, AdvancedFilters } from '@/components/common'
import type { FilterState } from '@/components/common'
import type { Movie } from '@/types'
import { movieService } from '@/services'
import { mergeUniqueById } from '@/utils'

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { filters, setFilters } = useFilters('movie')
  const loadedPages = useRef(new Set<number>())

  const fetchMovies = async (page: number, currentFilters: FilterState) => {
    // Evitar cargar la misma página dos veces
    if (loadedPages.current.has(page)) return
    if (page > totalPages && totalPages > 0) return
    if (loading) return

    try {
      setLoading(true)
      loadedPages.current.add(page)
      
      // Usar filtros si están activos
      const hasFilters = currentFilters.genres.length > 0 || currentFilters.year !== '' || currentFilters.sortBy !== 'popularity.desc'
      
      const response = hasFilters
        ? await movieService.searchByFilters({
            genres: currentFilters.genres,
            year: currentFilters.year ? Number(currentFilters.year) : undefined,
            sortBy: currentFilters.sortBy,
          }, page)
        : await movieService.getPopular(page)
      
      setMovies((prev) => {
        // Usar la utilidad para merge sin duplicados
        return mergeUniqueById(prev, response.results)
      })
      
      setTotalPages(response.total_pages)
      setError(null)
    } catch (err) {
      loadedPages.current.delete(page) // Permitir reintentar esta página
      setError('Error al cargar películas. Por favor, intenta nuevamente.')
      console.error('Error fetching movies:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(1, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reiniciar cuando cambien los filtros
  useEffect(() => {
    setMovies([])
    setCurrentPage(1)
    loadedPages.current.clear()
    fetchMovies(1, filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const observerTarget = useInfiniteScroll(() => {
    if (loading) return
    if (totalPages > 0 && currentPage >= totalPages) return
    
    const nextPage = currentPage + 1
    if (!loadedPages.current.has(nextPage)) {
      setCurrentPage(nextPage)
      fetchMovies(nextPage, filters)
    }
  }, { rootMargin: '200px' })

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters)
  }, [setFilters])

  if (error && movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4" style={{ color: 'var(--error-fg)' }}>{error}</div>
        <button
          onClick={() => {
            setCurrentPage(1)
            setMovies([])
            setError(null)
            loadedPages.current.clear()
            fetchMovies(1, filters)
          }}
          className="px-6 py-2 rounded-lg transition-colors"
          style={{
            backgroundColor: 'var(--accent)',
            color: 'white'
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <div className="m-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
          Películas Populares
        </h1>
        <p className="text-lg mb-6" style={{ color: 'var(--fg-muted)' }}>
          Explora nuestro catálogo completo de películas más populares
        </p>

        {/* Filtros Avanzados */}
        <AdvancedFilters 
          onFilterChange={handleFilterChange} 
          mediaType="movie" 
          initialFilters={filters}
        />
      </div>

      {error && movies.length > 0 && (
        <div 
          className="mb-6 p-4 border rounded-lg"
          style={{
            backgroundColor: 'var(--error-bg)',
            borderColor: 'var(--error-border)',
            color: 'var(--error-fg)'
          }}
        >
          {error}
        </div>
      )}

      <MovieGrid movies={movies} isLoading={loading && currentPage === 1} />

      {loading && currentPage > 1 && (
        <div className="py-8">
          <LoadingSpinner />
        </div>
      )}

      <div ref={observerTarget} className="py-8" />

      {!loading && movies.length > 0 && currentPage > totalPages && (
        <div className="text-center py-8" style={{ color: 'var(--fg-muted)' }}>
          <p className="text-lg font-medium">Has visto todas las películas disponibles</p>
          <p className="text-sm mt-2">Total: {movies.length} películas</p>
        </div>
      )}
    </div>
  )
}

