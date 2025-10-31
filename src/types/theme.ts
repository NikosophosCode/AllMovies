export type ThemeMode = 'light' | 'dark' | 'auto'

export interface Theme {
  mode: ThemeMode
  primaryColor: string
  secondaryColor: string
  accentColor: string
  customColors?: Record<string, string>
}

export interface ThemeContextType {
  theme: Theme
  setThemeMode: (mode: ThemeMode) => void
  setPrimaryColor: (color: string) => void
  isDark: boolean
}
