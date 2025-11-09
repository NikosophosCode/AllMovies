import { useEffect, useRef } from 'react'

/**
 * Hook para prevenir forced reflows causados por lecturas/escrituras
 * de propiedades geométricas del DOM (offsetWidth, scrollTop, etc.)
 * 
 * Estrategia: Batch DOM reads y writes usando requestAnimationFrame
 */

interface DOMBatchQueue {
  reads: (() => void)[]
  writes: (() => void)[]
}

const batchQueue: DOMBatchQueue = {
  reads: [],
  writes: [],
}

let isScheduled = false

const processBatch = () => {
  // Primero ejecutar todas las lecturas
  const reads = [...batchQueue.reads]
  batchQueue.reads = []
  reads.forEach(read => read())

  // Luego ejecutar todas las escrituras
  const writes = [...batchQueue.writes]
  batchQueue.writes = []
  writes.forEach(write => write())

  isScheduled = false
}

export const scheduleRead = (callback: () => void) => {
  batchQueue.reads.push(callback)
  
  if (!isScheduled) {
    isScheduled = true
    requestAnimationFrame(processBatch)
  }
}

export const scheduleWrite = (callback: () => void) => {
  batchQueue.writes.push(callback)
  
  if (!isScheduled) {
    isScheduled = true
    requestAnimationFrame(processBatch)
  }
}

/**
 * Hook para medir dimensiones del elemento sin causar reflows
 */
export const useDimensionsOptimized = <T extends HTMLElement>() => {
  const ref = useRef<T>(null)
  const dimensionsRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // ResizeObserver no causa reflow
        const { width, height } = entry.contentRect
        dimensionsRef.current = { width, height }
      }
    })

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return { ref, dimensions: dimensionsRef.current }
}

/**
 * Hook para scroll optimizado sin forced reflows
 */
export const useScrollOptimized = (callback: (scrollY: number) => void) => {
  const scrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY

      if (!ticking.current) {
        requestAnimationFrame(() => {
          callback(scrollY.current)
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [callback])
}

/**
 * Hook para operaciones de estilo sin forced reflows
 */
export const useStyleUpdate = () => {
  const updateStyle = (element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => {
    scheduleWrite(() => {
      Object.assign(element.style, styles)
    })
  }

  return { updateStyle }
}
