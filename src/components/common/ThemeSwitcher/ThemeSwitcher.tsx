import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks'
import type { ThemeMode } from '@/types'

const ThemeSwitcher = () => {
  const { theme, setThemeMode, isDark } = useTheme()

  const modes: ThemeMode[] = ['light', 'dark', 'auto']

  const handleToggle = () => {
    const currentIndex = modes.indexOf(theme.mode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThemeMode(modes[nextIndex])
  }

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg transition-all duration-200 blur-button"
      title={`Theme: ${theme.mode}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={20} style={{ color: 'var(--fg-muted)' }} />
      ) : (
        <Sun size={20} style={{ color: 'var(--fg-muted)' }} />
      )}
    </button>
  )
}

export default ThemeSwitcher
