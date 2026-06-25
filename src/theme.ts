import { createContext, useContext } from 'react'

export type Theme = 'dark' | 'light'

export const THEME_KEY = 'kglab-theme'

export interface ThemeContextValue {
  theme: Theme
  /** Toggle theme. Pass the click origin (px) to seed the corner-wave reveal. */
  toggle: (origin?: { x: number; y: number }) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}

export function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * Swap the theme with a corner-to-corner circular wave via the View Transitions
 * API. `origin` is the click point in viewport px; the reveal circle grows from
 * there. Falls back to an instant swap when the API or motion is unavailable.
 */
export function runThemeTransition(next: Theme, origin?: { x: number; y: number }) {
  localStorage.setItem(THEME_KEY, next)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const startViewTransition = document.startViewTransition?.bind(document)

  if (!startViewTransition || prefersReduced) {
    applyTheme(next)
    return
  }

  const x = origin?.x ?? window.innerWidth - 48
  const y = origin?.y ?? 48
  document.documentElement.style.setProperty('--wave-x', `${x}px`)
  document.documentElement.style.setProperty('--wave-y', `${y}px`)

  startViewTransition(() => {
    applyTheme(next)
  })
}
