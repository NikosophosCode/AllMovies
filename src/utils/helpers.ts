/**
 * Get YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (videoKey: string): string => {
  return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`
}

/**
 * Get YouTube video URL
 */
export const getYouTubeUrl = (videoKey: string): string => {
  return `https://www.youtube.com/watch?v=${videoKey}`
}

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get route with params
 */
export const getRoute = (route: string, params: Record<string, string | number>): string => {
  let finalRoute = route

  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, String(value))
  })

  return finalRoute
}
