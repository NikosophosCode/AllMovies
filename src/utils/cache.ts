export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export class Cache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map()

  set(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  }

  get(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(): void {
    this.cache.clear()
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  size(): number {
    return this.cache.size
  }
}

// Instancia global de caché
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiCache = new Cache<any>()
