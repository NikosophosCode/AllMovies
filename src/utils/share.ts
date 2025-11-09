/**
 * Utilidades para compartir contenido
 * Usa Web Share API con fallback a copiar al portapapeles
 */

interface ShareData {
  title: string
  text?: string
  url: string
}

/**
 * Comparte contenido usando Web Share API si está disponible,
 * de lo contrario copia la URL al portapapeles
 */
export async function shareContent(data: ShareData): Promise<{
  success: boolean
  method: 'share' | 'clipboard'
  error?: string
}> {
  // Verificar si Web Share API está disponible
  if (navigator.share && navigator.canShare && navigator.canShare(data)) {
    try {
      await navigator.share(data)
      return {
        success: true,
        method: 'share'
      }
    } catch (error) {
      // Si el usuario cancela, no es un error
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          method: 'share',
          error: 'Compartir cancelado'
        }
      }
      // Si falla, intentar con clipboard como fallback
      console.warn('Web Share API falló, usando clipboard:', error)
    }
  }

  // Fallback: copiar al portapapeles
  try {
    await navigator.clipboard.writeText(data.url)
    return {
      success: true,
      method: 'clipboard'
    }
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error)
    return {
      success: false,
      method: 'clipboard',
      error: 'No se pudo copiar al portapapeles'
    }
  }
}

/**
 * Genera datos de compartir para una película
 */
export function getMovieShareData(movieId: number, title: string): ShareData {
  const url = `${window.location.origin}/movies/${movieId}`
  return {
    title: `${title} - AllMovies`,
    text: `Mira ${title} en AllMovies`,
    url
  }
}

/**
 * Genera datos de compartir para una serie
 */
export function getSeriesShareData(seriesId: number, name: string): ShareData {
  const url = `${window.location.origin}/series/${seriesId}`
  return {
    title: `${name} - AllMovies`,
    text: `Mira ${name} en AllMovies`,
    url
  }
}

/**
 * Genera datos de compartir para una temporada
 */
export function getSeasonShareData(
  seriesId: number,
  seasonNumber: number,
  seriesName: string
): ShareData {
  const url = `${window.location.origin}/series/${seriesId}/season/${seasonNumber}`
  return {
    title: `${seriesName} - Temporada ${seasonNumber} - AllMovies`,
    text: `Mira la temporada ${seasonNumber} de ${seriesName} en AllMovies`,
    url
  }
}

/**
 * Genera datos de compartir para una lista
 */
export function getListShareData(listId: number, listName: string): ShareData {
  const url = `${window.location.origin}/my-lists/${listId}`
  return {
    title: `${listName} - AllMovies`,
    text: `Mira la lista "${listName}" en AllMovies`,
    url
  }
}

/**
 * Verifica si Web Share API está disponible
 */
export function isWebShareSupported(): boolean {
  return typeof navigator !== 'undefined' && 'share' in navigator
}

/**
 * Verifica si Clipboard API está disponible
 */
export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator
}
