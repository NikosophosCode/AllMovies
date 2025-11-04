import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, List, Film } from 'lucide-react'
import { useAuth } from '@/hooks'
import { authService } from '@/services'
import type { UserList } from '@/services/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'
import './MyLists.css'

export default function MyLists() {
  const { user, sessionId } = useAuth()
  const [lists, setLists] = useState<UserList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchLists = useCallback(async () => {
    if (!user?.id || !sessionId) return

    try {
      setLoading(true)
      setError(null)
      const data = await authService.getUserLists(user.id, sessionId)
      setLists(data.results || [])
    } catch (err) {
      console.error('Error fetching lists:', err)
      setError('Error al cargar las listas')
    } finally {
      setLoading(false)
    }
  }, [user?.id, sessionId])

  useEffect(() => {
    if (user?.id && sessionId) {
      fetchLists()
    } else {
      setLoading(false)
    }
  }, [user?.id, sessionId, fetchLists])

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newListName.trim() || !sessionId) return

    try {
      setCreating(true)
      await authService.createList(sessionId, newListName, newListDescription)
      
      // Resetear formulario y recargar listas
      setNewListName('')
      setNewListDescription('')
      setShowCreateForm(false)
      await fetchLists()
    } catch (err) {
      console.error('Error creating list:', err)
      alert('Error al crear la lista. Inténtalo de nuevo.')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteList = async (listId: number) => {
    if (!sessionId) return
    
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar esta lista?')
    if (!confirmed) return

    try {
      await authService.deleteList(listId, sessionId)
      await fetchLists()
    } catch (err) {
      console.error('Error deleting list:', err)
      alert('Error al eliminar la lista. Inténtalo de nuevo.')
    }
  }

  if (!user || !sessionId) {
    return (
      <div className="text-center py-24 animate-fade-in">
        <List size={64} className="mx-auto mb-4" style={{ color: 'var(--fg-soft)' }} />
        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--fg)' }}>
          Mis Listas
        </h1>
        <p className="text-lg mb-6" style={{ color: 'var(--fg-muted)' }}>
          Debes estar autenticado para crear y gestionar listas
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#ffffff'
          }}
        >
          Iniciar Sesión
        </a>
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="my-lists-page animate-fade-in">
      {/* Header */}
      <div className="my-lists-header">
        <div className="flex items-center gap-3">
          <List size={32} style={{ color: 'var(--accent)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>
            Mis Listas
          </h1>
        </div>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="my-lists-create-btn"
        >
          <Plus size={20} />
          Nueva Lista
        </button>
      </div>

      {/* Formulario de nueva lista */}
      {showCreateForm && (
        <form onSubmit={handleCreateList} className="my-lists-form">
          <input
            type="text"
            placeholder="Nombre de la lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="my-lists-input"
            required
            maxLength={100}
          />
          
          <textarea
            placeholder="Descripción (opcional)"
            value={newListDescription}
            onChange={(e) => setNewListDescription(e.target.value)}
            className="my-lists-textarea"
            maxLength={500}
          />
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating || !newListName.trim()}
              className="my-lists-submit-btn"
            >
              {creating ? 'Creando...' : 'Crear Lista'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false)
                setNewListName('')
                setNewListDescription('')
              }}
              className="my-lists-cancel-btn"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de listas */}
      {lists.length === 0 ? (
        <div className="text-center py-24">
          <Film size={64} className="mx-auto mb-4" style={{ color: 'var(--fg-soft)' }} />
          <p className="text-xl mb-2" style={{ color: 'var(--fg)' }}>
            Aún no tienes listas
          </p>
          <p style={{ color: 'var(--fg-muted)' }}>
            ¡Crea tu primera lista para organizar tus películas favoritas!
          </p>
        </div>
      ) : (
        <div className="my-lists-grid">
          {lists.map((list) => (
            <div key={list.id} className="my-lists-card">
              {/* Poster de la lista */}
              {list.poster_path && (
                <div className="my-lists-card-poster">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${list.poster_path}`}
                    alt={list.name}
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="my-lists-card-content">
                <h3 className="my-lists-card-title">{list.name}</h3>
                
                {list.description && (
                  <p className="my-lists-card-description">
                    {list.description}
                  </p>
                )}
                
                <div className="my-lists-card-footer">
                  <span className="my-lists-card-count">
                    <Film size={16} />
                    {list.item_count} {list.item_count === 1 ? 'elemento' : 'elementos'}
                  </span>
                  
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="my-lists-delete-btn"
                    title="Eliminar lista"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
