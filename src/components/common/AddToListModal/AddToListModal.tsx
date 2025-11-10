import { useState, useEffect } from 'react'
import { X, Plus, Check, List, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks'
import { authService } from '@/services'
import type { UserList } from '@/services/auth'
import './AddToListModal.css'

interface AddToListModalProps {
  isOpen: boolean
  onClose: () => void
  mediaId: number
  mediaType: 'movie' | 'tv'
  mediaTitle: string
}

/**
 * Modal para agregar película/serie a listas personalizadas
 * - Muestra listas del usuario
 * - Permite crear nueva lista inline
 * - Feedback visual de éxito/error
 * - Variables CSS para theming
 */
const AddToListModal = ({ isOpen, onClose, mediaId, mediaType, mediaTitle }: AddToListModalProps) => {
  const { user, sessionId } = useAuth()
  const [lists, setLists] = useState<UserList[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToList, setAddingToList] = useState<number | null>(null)
  const [successList, setSuccessList] = useState<number | null>(null)
  
  // Estado para crear nueva lista
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')
  const [creatingList, setCreatingList] = useState(false)

  const loadLists = async () => {
    if (!user || !sessionId) return

    try {
      setLoading(true)
      setError(null)
      const response = await authService.getUserLists(user.id, sessionId)
      setLists(response.results || [])
    } catch (err) {
      console.error('Error al cargar listas:', err)
      setError('No se pudieron cargar las listas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && user && sessionId) {
      loadLists()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user, sessionId])

  const handleAddToList = async (listId: number) => {
    if (!sessionId || addingToList) return

    try {
      setAddingToList(listId)
      setError(null)
      await authService.addToList(listId, sessionId, mediaId, mediaType)
      
      // Mostrar feedback de éxito
      setSuccessList(listId)
      setTimeout(() => {
        setSuccessList(null)
      }, 2000)
    } catch (err) {
      console.error('Error al añadir a lista:', err)
      setError('No se pudo añadir a la lista')
    } finally {
      setAddingToList(null)
    }
  }

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionId || !newListName.trim() || creatingList) return

    try {
      setCreatingList(true)
      setError(null)
      
      const response = await authService.createList(
        sessionId,
        newListName.trim(),
        newListDescription.trim()
      )
      
      // Añadir película o serie a la nueva lista
      if (response.list_id) {
        await authService.addToList(response.list_id, sessionId, mediaId, mediaType)
      }
      
      // Recargar listas y resetear formulario
      await loadLists()
      setNewListName('')
      setNewListDescription('')
      setShowCreateForm(false)
      
      // Mostrar feedback
      if (response.list_id) {
        setSuccessList(response.list_id)
        setTimeout(() => setSuccessList(null), 2000)
      }
    } catch (err) {
      console.error('Error al crear lista:', err)
      setError('No se pudo crear la lista')
    } finally {
      setCreatingList(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="add-to-list-overlay" onClick={handleBackdropClick}>
      <div className="add-to-list-modal">
        {/* Header */}
        <div className="add-to-list-header">
          <div className="add-to-list-title-container">
            <List size={24} className="add-to-list-icon" />
            <div>
              <h2 className="add-to-list-title">Añadir a lista</h2>
              <p className="add-to-list-subtitle">{mediaTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="add-to-list-close-btn"
            aria-label="Cerrar modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="add-to-list-content">
          {/* Error message */}
          {error && (
            <div className="add-to-list-error">
              {error}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="add-to-list-loading">
              <Loader2 size={32} className="animate-spin" />
              <p>Cargando listas...</p>
            </div>
          ) : (
            <>
              {/* Botón crear nueva lista */}
              {!showCreateForm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="add-to-list-create-btn"
                >
                  <Plus size={20} />
                  <span>Crear nueva lista</span>
                </button>
              )}

              {/* Formulario crear lista */}
              {showCreateForm && (
                <form onSubmit={handleCreateList} className="add-to-list-create-form">
                  <input
                    type="text"
                    placeholder="Nombre de la lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    maxLength={100}
                    required
                    className="add-to-list-input"
                    autoFocus
                  />
                  <textarea
                    placeholder="Descripción (opcional)"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    maxLength={500}
                    rows={3}
                    className="add-to-list-textarea"
                  />
                  <div className="add-to-list-form-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false)
                        setNewListName('')
                        setNewListDescription('')
                      }}
                      className="add-to-list-form-cancel"
                      disabled={creatingList}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="add-to-list-form-submit"
                      disabled={!newListName.trim() || creatingList}
                    >
                      {creatingList ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          Crear y añadir
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de listas */}
              {lists.length === 0 ? (
                <div className="add-to-list-empty">
                  <p>No tienes listas creadas.</p>
                  <p className="text-sm">Crea una para comenzar a organizar tu contenido.</p>
                </div>
              ) : (
                <div className="add-to-list-items">
                  {lists.map((list) => {
                    const isAdding = addingToList === list.id
                    const isSuccess = successList === list.id

                    return (
                      <button
                        key={list.id}
                        onClick={() => handleAddToList(list.id)}
                        disabled={isAdding || isSuccess}
                        className={`add-to-list-item ${isSuccess ? 'success' : ''}`}
                      >
                        <div className="add-to-list-item-info">
                          <h3 className="add-to-list-item-name">{list.name}</h3>
                          {list.description && (
                            <p className="add-to-list-item-description">{list.description}</p>
                          )}
                          <p className="add-to-list-item-count">
                            {list.item_count} {list.item_count === 1 ? 'elemento' : 'elementos'}
                          </p>
                        </div>
                        <div className="add-to-list-item-action">
                          {isAdding ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : isSuccess ? (
                            <Check size={20} className="add-to-list-success-icon" />
                          ) : (
                            <Plus size={20} />
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddToListModal
