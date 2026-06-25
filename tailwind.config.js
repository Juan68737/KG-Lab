/** @type {import('tailwindcss').Config} */
// Tokens mirror DESIGN_SYSTEM.md + the CSS variables in src/index.css.
// Colors map to `rgb(var(--x) / <alpha-value>)` so opacity utilities work and
// the values swap between light/dark via [data-theme]. Add new tokens in all
// three places.
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: withAlpha('--bg'),
        surface: withAlpha('--surface'),
        'surface-2': withAlpha('--surface-2'),
        'surface-3': withAlpha('--surface-3'),
        border: withAlpha('--border'),
        'border-strong': withAlpha('--border-strong'),
        fg: withAlpha('--fg'),
        'fg-muted': withAlpha('--fg-muted'),
        'fg-subtle': withAlpha('--fg-subtle'),
        accent: withAlpha('--accent'),
        'accent-fg': withAlpha('--accent-fg'),
        // accent-soft is a fixed low-alpha white/black for hover + active bg.
        'accent-soft': 'rgb(var(--accent-soft) / var(--accent-soft-alpha))',
        // Status badge hues — same in both themes.
        'green-soft': 'rgba(34,197,94,0.12)',
        'green-fg': '#7ee2a8',
        'amber-soft': 'rgba(245,158,11,0.14)',
        'amber-fg': '#f4c66b',
        'blue-soft': 'rgba(59,130,246,0.15)',
        'blue-fg': '#8ab4ff',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
