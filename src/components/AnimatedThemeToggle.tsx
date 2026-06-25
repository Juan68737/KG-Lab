import { useRef } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme'

// Header theme toggle. On click it captures its own center as the origin for
// the corner-to-corner wave reveal (see runThemeTransition + index.css).
export function AnimatedThemeToggle() {
  const { theme, toggle } = useTheme()
  const ref = useRef<HTMLButtonElement>(null)
  const isDark = theme === 'dark'

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined
    toggle(origin)
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative grid size-9 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-accent-soft hover:text-fg"
    >
      <Sun
        className={`absolute size-[18px] transition-all duration-300 ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'
        }`}
      />
      <Moon
        className={`absolute size-[18px] transition-all duration-300 ${
          isDark ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
    </button>
  )
}
