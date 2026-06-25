/** @type {import('tailwindcss').Config} */
// Tokens mirror DESIGN_SYSTEM.md. Add new tokens there first, then here.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0b',
        surface: '#141416',
        'surface-2': '#1b1b1e',
        'surface-3': '#232327',
        border: '#27272b',
        'border-strong': '#34343a',
        fg: '#f4f4f5',
        'fg-muted': '#a1a1aa',
        'fg-subtle': '#71717a',
        accent: '#7c5cff',
        'accent-soft': 'rgba(124,92,255,0.10)',
        'accent-fg': '#b5a4ff',
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
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
}
