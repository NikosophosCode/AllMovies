import { useEffect, useRef } from 'react'

export const useInfiniteScroll = (callback: () => void, options: { threshold?: number } = {}) => {
  const { threshold = 0.1 } = options
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          callback()
        }
      },
      { threshold }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [callback, threshold])

  return observerTarget
}
