import { useEffect, useRef, useCallback } from 'react'

export const useInfiniteScroll = (
  callback: () => void,
  options: { threshold?: number; rootMargin?: string } = {}
) => {
  const { threshold = 0.1, rootMargin = '100px' } = options
  const observerTarget = useRef<HTMLDivElement>(null)
  const isLoadingRef = useRef(false)

  // Estabilizar el callback con useCallback
  const stableCallback = useCallback(() => {
    if (!isLoadingRef.current) {
      isLoadingRef.current = true
      callback()
      // Resetear después de un tiempo para permitir nuevas cargas
      setTimeout(() => {
        isLoadingRef.current = false
      }, 1000)
    }
  }, [callback])

  useEffect(() => {
    const target = observerTarget.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stableCallback()
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [stableCallback, threshold, rootMargin])

  return observerTarget
}
