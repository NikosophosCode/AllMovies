import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon, Filter } from 'lucide-react'
import { useDebounce } from '@/hooks'
import MediaCard from '@/components/common/MediaCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Movie, Series } from '@/types'
import { searchService } from '@/services'

// Tipo para los resultados de búsqueda multi que incluyen media_type
type SearchResult = (Movie | Series) & {
  media_type?: 'movie' | 'tv' | 'person'
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(!!initialQuery)
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const debouncedQuery = useDebounce(query, 500)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)

      let response

      if (mediaType === 'movie') {
        response = await searchService.movies(searchQuery)
      } else if (mediaType === 'tv') {
        response = await searchService.tv(searchQuery)
      } else {
        response = await searchService.multi(searchQuery)
      }

      setResults(response.results)
    } catch (err) {
      setError('Error al buscar. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [mediaType])

  useEffect(() => {
    if (debouncedQuery && debouncedQuery !== initialQuery) {
      performSearch(debouncedQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery])

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Rehacer búsqueda cuando cambia el tipo de media
  useEffect(() => {
    if (query.trim() && hasSearched) {
      performSearch(query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaType])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  return (
    <div className="animate-fade-in">
      {/* Barra de búsqueda principal */}
      <div className="m-12">
        <form onSubmit={handleSearch} className="relative mb-6">
          <div className="relative">
            <SearchIcon 
              className="absolute left-4 top-1/2 -translate-y-1/2" 
              style={{ color: 'var(--input-placeholder)' }}
              size={24} 
            />
            <input
              type="text"
              placeholder="Busca películas y series..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none transition-colors text-lg"
              style={{
                backgroundColor: 'var(--input-bg)',
                borderColor: 'var(--input-border)',
                color: 'var(--input-fg)'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--input-border-focus)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
            />
          </div>
        </form>

        {/* Botones de filtro y tipo de media */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--surface-muted)',
              color: 'var(--fg)'
            }}
          >
            <Filter size={18} />
            Filtros
          </button>

          <div className="flex gap-2">
            {(['all', 'movie', 'tv'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMediaType(type)}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: mediaType === type ? 'var(--accent)' : 'var(--surface-muted)',
                  color: mediaType === type ? 'white' : 'var(--fg)'
                }}
              >
                {type === 'all' ? 'Todos' : type === 'movie' ? 'Películas' : 'Series'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel de filtros (expandible) */}
      {showFilters && (
        <div className="mb-8 p-6 rounded-lg animate-slide-in-up" style={{ backgroundColor: 'var(--surface-muted)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--fg)' }}>Año</label>
              <input
                type="number"
                placeholder="2024"
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-fg)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--input-border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--fg)' }}>Calificación mínima</label>
              <input
                type="number"
                min="0"
                max="10"
                placeholder="5"
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-fg)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--input-border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--fg)' }}>Ordenar por</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border-2 focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'var(--input-bg)',
                  borderColor: 'var(--input-border)',
                  color: 'var(--input-fg)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--input-border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--input-border)'}
              >
                <option>Relevancia</option>
                <option>Más reciente</option>
                <option>Mejor calificadas</option>
                <option>Más populares</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Mensajes de error */}
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Cargando */}
      {loading && <LoadingSpinner />}

      {/* Resultados */}
      {hasSearched && !loading && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>
              {results.length > 0
                ? `${results.length} resultados encontrados`
                : 'No se encontraron resultados'}
            </h2>
          </div>

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
              {results
                .filter((item) => {
                  // Filtrar personas si estamos en búsqueda 'all'
                  if (mediaType === 'all' && item.media_type === 'person') {
                    return false
                  }
                  return true
                })
                .map((item) => {
                  // Determinar el tipo de media
                  let itemMediaType: 'movie' | 'tv' = 'movie'
                  
                  if (mediaType === 'all') {
                    // Si es búsqueda multi, usar el media_type de la API
                    itemMediaType = item.media_type === 'tv' ? 'tv' : 'movie'
                  } else {
                    // Si es búsqueda específica, usar el mediaType seleccionado
                    itemMediaType = mediaType
                  }

                  return (
                    <MediaCard
                      key={`${itemMediaType}-${item.id}`}
                      media={item as Movie | Series}
                      mediaType={itemMediaType}
                    />
                  )
                })}
            </div>
          )}
        </>
      )}

      {/* Estado inicial */}
      {!hasSearched && (
        <div className="text-center py-24">
          <SearchIcon size={64} className="mx-auto mb-4" style={{ color: 'var(--fg-soft)' }} />
          <p className="text-xl" style={{ color: 'var(--fg-muted)' }}>
            Comienza a escribir para buscar películas y series
          </p>
        </div>
      )}
    </div>
  )
}
