/**
 * Implementación de Least Recently Used (LRU) Cache
 * Útil para optimizar memoria manteniendo solo los elementos más usados
 */
export class LRUCache<T> {
  private maxSize: number
  private cache: Map<string, T> = new Map()

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  /**
   * Añade o actualiza un elemento en el cache
   * Si ya existe, se mueve al final (más reciente)
   * Si se excede el tamaño, elimina el más antiguo
   */
  set(key: string, value: T): void {
    // Si ya existe, eliminar y re-añadir (al final = más reciente)
    if (this.cache.has(key)) {
      this.cache.delete(key)
    }

    this.cache.set(key, value)

    // Si excedemos el tamaño máximo, eliminar el más antiguo
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
  }

  /**
   * Obtiene un elemento del cache
   * Si existe, se mueve al final (más reciente)
   */
  get(key: string): T | null {
    if (!this.cache.has(key)) return null

    // Mover al final (más reciente)
    const value = this.cache.get(key)!
    this.cache.delete(key)
    this.cache.set(key, value)

    return value
  }

  /**
   * Verifica si existe un elemento en el cache
   */
  has(key: string): boolean {
    return this.cache.has(key)
  }

  /**
   * Elimina un elemento específico del cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  /**
   * Limpia todo el cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Retorna el tamaño actual del cache
   */
  get size(): number {
    return this.cache.size
  }

  /**
   * Retorna todas las keys del cache
   */
  keys(): IterableIterator<string> {
    return this.cache.keys()
  }

  /**
   * Retorna todos los valores del cache
   */
  values(): IterableIterator<T> {
    return this.cache.values()
  }

  /**
   * Retorna todos los entries del cache
   */
  entries(): IterableIterator<[string, T]> {
    return this.cache.entries()
  }
}

// Instancias globales de cache para diferentes propósitos
export const imageCache = new LRUCache<string>(50) // Cache de URLs de imágenes
export const apiCache = new LRUCache<unknown>(100) // Cache de respuestas de API
export const metadataCache = new LRUCache<unknown>(200) // Cache de metadata
