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
      className="p-2 hover:bg-white/10 dark:hover:bg-white/10 rounded-lg transition-colors"
      title={`Theme: ${theme.mode}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon size={20} className="text-slate-300" />
      ) : (
        <Sun size={20} className="text-slate-700" />
      )}
    </button>
  )
}

export default ThemeSwitcher
