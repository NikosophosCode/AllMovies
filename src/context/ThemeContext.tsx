import React, { useEffect, useState } from 'react'
import type { Theme, ThemeMode } from '@/types'
import { ThemeContext } from './theme.context'

// Re-exportar el contexto para compatibilidad
export { ThemeContext } from './theme.context'

const DEFAULT_THEME: Theme = {
  mode: 'light',
  primaryColor: '#d32f2f',
  secondaryColor: '#1976d2',
  accentColor: '#f57c00',
}

// Provider Component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme')
    console.log('💾 Tema guardado en localStorage:', saved)
    return saved ? JSON.parse(saved) : DEFAULT_THEME
  })

  // Apply theme to <html> and persist
  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(theme))

    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const effectiveDark = theme.mode === 'auto' ? prefersDark : theme.mode === 'dark'

    root.classList.toggle('dark', effectiveDark)
    // Help native form controls match the theme
    root.style.colorScheme = effectiveDark ? 'dark' : 'light'

    console.log(effectiveDark ? '🌙 Dark mode activated' : '☀️ Light mode activated')
  }, [theme])

  // Respond to system changes when in auto mode
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (theme.mode === 'auto') {
        const root = document.documentElement
        root.classList.toggle('dark', media.matches)
        root.style.colorScheme = media.matches ? 'dark' : 'light'
      }
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme.mode])

  const setThemeMode = (mode: ThemeMode) => {
    console.log('🎨 setThemeMode llamado con:', mode)
    console.log('🎨 Tema actual antes del cambio:', theme.mode)
    setTheme((prev) => {
      const newTheme = { ...prev, mode }
      console.log('🎨 Nuevo tema:', newTheme)
      return newTheme
    })
  }

  const setPrimaryColor = (color: string) => {
    setTheme((prev) => ({ ...prev, primaryColor: color }))
  }

  const isDark = theme.mode === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, setThemeMode, setPrimaryColor, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
