import { useCallback, useEffect, useState, type ReactNode } from 'react'
import {
  ThemeContext,
  applyTheme,
  getInitialTheme,
  runThemeTransition,
  type Theme,
} from '../theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply on mount and whenever theme changes (covers the initial paint too).
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggle = useCallback(
    (origin?: { x: number; y: number }) => {
      setTheme((prev) => {
        const next: Theme = prev === 'dark' ? 'light' : 'dark'
        runThemeTransition(next, origin)
        return next
      })
    },
    [],
  )

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}
