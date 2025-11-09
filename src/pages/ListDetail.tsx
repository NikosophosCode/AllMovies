import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, List as ListIcon, Trash2, AlertCircle, Film, Tv } from 'lucide-react'
import { useAuth } from '@/hooks'
import MediaCard from '@/components/common/MediaCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import type { Movie } from '@/types'
import { authService } from '@/services'

interface ListDetails {
  id: number
  name: string
  description: string
  item_count: number
  items: Movie[]
  created_by: string
  iso_639_1: string
}

export default function ListDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, sessionId } = useAuth()
  
  const [list, setList] = useState<ListDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingItem, setRemovingItem] = useState<number | null>(null)

  const listId = Number(id)

  useEffect(() => {
    const fetchListDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await authService.getListDetails(listId)
        setList(data)
      } catch (err) {
        console.error('Error al cargar detalles de lista:', err)
        setError('No se pudieron cargar los detalles de la lista')
      } finally {
        setLoading(false)
      }
    }

    if (listId) {
      fetchListDetails()
    }
  }, [listId])

  const handleRemoveItem = async (mediaId: number) => {
    if (!sessionId || !window.confirm('¿Eliminar esta película de la lista?')) return

    try {
      setRemovingItem(mediaId)
      await authService.removeFromList(listId, sessionId, mediaId)
      
      // Actualizar la lista localmente
      setList(prev => {
        if (!prev) return null
        return {
          ...prev,
          items: prev.items.filter(item => item.id !== mediaId),
          item_count: prev.item_count - 1
        }
      })
    } catch (err) {
      console.error('Error al eliminar de la lista:', err)
      alert('No se pudo eliminar el elemento de la lista')
    } finally {
      setRemovingItem(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-24">
        <AlertCircle size={64} className="mb-4" style={{ color: 'var(--fg-muted)' }} />
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Inicia sesión para ver tus listas
        </h2>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (error || !list) {
    return <ErrorMessage message={error || 'Lista no encontrada'} />
  }

  // Determinar tipos de contenido
  const hasMovies = list.items.some(item => 'title' in item)
  const hasSeries = list.items.some(item => 'name' in item)

  return (
    <div className="animate-fade-in">
      {/* Botón volver */}
      <button
        onClick={() => navigate('/my-lists')}
        className="flex items-center gap-2 m-6 transition-colors"
        style={{ color: 'var(--accent)' }}
      >
        <ArrowLeft size={20} />
        Volver a Mis Listas
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-3">
          <ListIcon size={32} style={{ color: 'var(--accent)' }} />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
              {list.name}
            </h1>
            {list.description && (
              <p className="text-lg" style={{ color: 'var(--fg-muted)' }}>
                {list.description}
              </p>
            )}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="flex flex-wrap gap-4 mt-4">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-lg"
            style={{ backgroundColor: 'var(--surface-muted)' }}
          >
            <span style={{ color: 'var(--fg-muted)' }}>Total:</span>
            <span className="font-bold" style={{ color: 'var(--fg)' }}>
              {list.item_count} {list.item_count === 1 ? 'elemento' : 'elementos'}
            </span>
          </div>

          {hasMovies && (
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface-muted)' }}
            >
              <Film size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--fg)' }}>Películas</span>
            </div>
          )}

          {hasSeries && (
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ backgroundColor: 'var(--surface-muted)' }}
            >
              <Tv size={18} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--fg)' }}>Series</span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      {list.items.length === 0 ? (
        <div className="text-center py-24">
          <ListIcon size={64} className="mx-auto mb-4" style={{ color: 'var(--fg-muted)', opacity: 0.5 }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
            Lista vacía
          </h2>
          <p style={{ color: 'var(--fg-muted)' }}>
            Esta lista aún no tiene contenido.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {list.items.map((item) => {
            const mediaType = 'title' in item ? 'movie' : 'tv'
            const isRemoving = removingItem === item.id

            return (
              <div key={item.id} className="relative group">
                <MediaCard
                  media={item}
                  mediaType={mediaType}
                />
                
                {/* Botón eliminar */}
                {isAuthenticated && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isRemoving}
                    className="absolute top-2 right-2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 z-10"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: 'white'
                    }}
                    aria-label="Eliminar de la lista"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
