import React, { createContext, useEffect, useState } from 'react'
import type { Theme, ThemeMode, ThemeContextType } from '@/types'

const DEFAULT_THEME: Theme = {
  mode: 'dark',
  primaryColor: '#d32f2f',
  secondaryColor: '#1976d2',
  accentColor: '#f57c00',
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('app-theme')
    return saved ? JSON.parse(saved) : DEFAULT_THEME
  })

  useEffect(() => {
    localStorage.setItem('app-theme', JSON.stringify(theme))

    const root = document.documentElement
    if (theme.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const setThemeMode = (mode: ThemeMode) => {
    setTheme((prev) => ({ ...prev, mode }))
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
