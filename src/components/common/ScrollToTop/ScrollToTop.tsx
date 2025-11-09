import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Componente que hace scroll al top de la página cuando cambia la ruta
 * Debe estar dentro de un BrowserRouter
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
