import { useState, useRef, useEffect, useCallback } from 'react'

interface UseVirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  buffer?: number
  overscan?: number
}

interface VirtualScrollResult<T> {
  containerRef: React.RefObject<HTMLDivElement | null>
  visibleItems: T[]
  offsetY: number
  totalHeight: number
  startIndex: number
  endIndex: number
  scrollToIndex: (index: number) => void
}

/**
 * Hook para implementar virtual scrolling en listas largas
 * Mejora el rendimiento renderizando solo los items visibles
 * 
 * @param items - Array de items a renderizar
 * @param options - Configuración del virtual scroll
 * @returns Propiedades y métodos para implementar virtual scrolling
 */
export const useVirtualScroll = <T,>(
  items: T[],
  options: UseVirtualScrollOptions
): VirtualScrollResult<T> => {
  const { itemHeight, containerHeight, buffer = 5, overscan = 3 } = options
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight

  // Calcular índice de inicio con buffer
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - buffer - overscan
  )

  // Calcular índice final con buffer
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer + overscan
  )

  // Items visibles
  const visibleItems = items.slice(startIndex, endIndex)

  // Offset vertical para posicionar correctamente
  const offsetY = startIndex * itemHeight

  // Handler de scroll optimizado
  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
  }, [])

  // Función para hacer scroll a un índice específico
  const scrollToIndex = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollPosition = Math.max(0, Math.min(
        index * itemHeight,
        totalHeight - containerHeight
      ))
      containerRef.current.scrollTop = scrollPosition
    }
  }, [itemHeight, totalHeight, containerHeight])

  // Configurar listener de scroll
  useEffect(() => {
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return {
    containerRef,
    visibleItems,
    offsetY,
    totalHeight,
    startIndex,
    endIndex,
    scrollToIndex,
  }
}
