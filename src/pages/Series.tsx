import { useState, useEffect, useRef } from 'react'
import { Tv } from 'lucide-react'
import { SeriesGrid } from '@/components/series'
import { LoadingSpinner } from '@/components/common'
import { useInfiniteScroll } from '@/hooks'
import type { Series } from '@/types'
import { seriesService } from '@/services'
import { mergeUniqueById } from '@/utils'

export default function Series() {
  const [series, setSeries] = useState<Series[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'popular' | 'top_rated' | 'on_the_air'>('popular')
  const loadedPages = useRef(new Map<string, Set<number>>())

  // Inicializar conjuntos para cada tab si no existen
  const getLoadedPagesForTab = (tab: string) => {
    if (!loadedPages.current.has(tab)) {
      loadedPages.current.set(tab, new Set<number>())
    }
    return loadedPages.current.get(tab)!
  }

  const fetchSeries = async (page: number, tab: typeof activeTab) => {
    const tabPages = getLoadedPagesForTab(tab)
    
    // Evitar cargar la misma página dos veces
    if (tabPages.has(page)) return
    if (page > totalPages && totalPages > 0) return
    if (loading) return

    try {
      setLoading(true)
      tabPages.add(page)
      
      let response
      switch (tab) {
        case 'popular':
          response = await seriesService.getPopular(page)
          break
        case 'top_rated':
          response = await seriesService.getTopRated(page)
          break
        case 'on_the_air':
          response = await seriesService.getOnTheAir(page)
          break
      }
      
      setSeries((prev) => {
        // Si cambiamos de tab y es página 1, reemplazar todo
        if (page === 1) return response.results
        // Si no, hacer merge sin duplicados
        return mergeUniqueById(prev, response.results)
      })
      
      setTotalPages(response.total_pages)
      setError(null)
    } catch (err) {
      tabPages.delete(page) // Permitir reintentar esta página
      setError('Error al cargar las series. Por favor, intenta nuevamente.')
      console.error('Error fetching series:', err)
    } finally {
      setLoading(false)
    }
  }

  // Cargar series cuando cambia el tab
  useEffect(() => {
    setCurrentPage(1)
    setSeries([])
    setTotalPages(0)
    fetchSeries(1, activeTab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const observerTarget = useInfiniteScroll(() => {
    if (loading) return
    if (totalPages > 0 && currentPage >= totalPages) return
    
    const nextPage = currentPage + 1
    const tabPages = getLoadedPagesForTab(activeTab)
    if (!tabPages.has(nextPage)) {
      setCurrentPage(nextPage)
      fetchSeries(nextPage, activeTab)
    }
  }, { rootMargin: '200px' })

  if (error && series.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mb-4" style={{ color: 'var(--error-fg)' }}>{error}</div>
        <button
          onClick={() => {
            setCurrentPage(1)
            setSeries([])
            setError(null)
            loadedPages.current.clear()
            fetchSeries(1, activeTab)
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
      {/* Header */}
      <div className="m-12">
        <div className="flex items-center gap-3 mb-4">
          <Tv size={32} style={{ color: 'var(--accent)' }} />
          <h1 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--fg)' }}>
            Series de TV
          </h1>
        </div>
        <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
          Descubre las mejores series de televisión
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('popular')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'popular' ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: activeTab === 'popular' ? 'var(--accent)' : 'var(--surface-muted)',
            color: activeTab === 'popular' ? 'white' : 'var(--fg)'
          }}
        >
          Populares
        </button>
        <button
          onClick={() => setActiveTab('top_rated')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'top_rated' ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: activeTab === 'top_rated' ? 'var(--accent)' : 'var(--surface-muted)',
            color: activeTab === 'top_rated' ? 'white' : 'var(--fg)'
          }}
        >
          Mejor Valoradas
        </button>
        <button
          onClick={() => setActiveTab('on_the_air')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'on_the_air' ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: activeTab === 'on_the_air' ? 'var(--accent)' : 'var(--surface-muted)',
            color: activeTab === 'on_the_air' ? 'white' : 'var(--fg)'
          }}
        >
          En Emisión
        </button>
      </div>

      {error && series.length > 0 && (
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

      {/* Series Grid */}
      <SeriesGrid series={series} />

      {loading && currentPage > 1 && (
        <div className="py-8">
          <LoadingSpinner />
        </div>
      )}

      <div ref={observerTarget} className="py-8" />

      {!loading && series.length > 0 && currentPage >= totalPages && totalPages > 0 && (
        <div className="text-center py-8" style={{ color: 'var(--fg-muted)' }}>
          <p className="text-lg font-medium">Has visto todas las series disponibles</p>
          <p className="text-sm mt-2">Total: {series.length} series</p>
        </div>
      )}
    </div>
  )
}
