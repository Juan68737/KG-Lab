import type { ReactNode } from 'react'

type Tone = 'violet' | 'green' | 'amber' | 'blue' | 'neutral'

const toneClasses: Record<Tone, string> = {
  violet: 'bg-accent-soft text-accent-fg',
  green: 'bg-green-soft text-green-fg',
  amber: 'bg-amber-soft text-amber-fg',
  blue: 'bg-blue-soft text-blue-fg',
  neutral: 'bg-surface-3 text-fg-muted',
}

// Small pill — used for sidebar status (done/active/new) and overview tags.
export function Badge({
  children,
  tone = 'neutral',
  size = 'sm',
}: {
  children: ReactNode
  tone?: Tone
  size?: 'sm' | 'md'
}) {
  const sizeClasses =
    size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px] font-medium'
  return (
    <span
      className={`inline-flex items-center rounded-full leading-none ${sizeClasses} ${toneClasses[tone]}`}
    >
      {children}
    </span>
  )
}
