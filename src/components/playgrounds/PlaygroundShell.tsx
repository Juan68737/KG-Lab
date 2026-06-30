import type { ReactNode } from 'react'

// Consistent outer frame for every playground: same gutter as the Overview tab,
// plus an optional title/subtitle header and a right-aligned toolbar slot.
export function PlaygroundShell({
  title,
  subtitle,
  toolbar,
  children,
}: {
  title: string
  subtitle?: string
  toolbar?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto max-w-5xl px-8 py-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-fg-muted">{subtitle}</p>
          )}
        </div>
        {toolbar}
      </div>
      {children}
    </div>
  )
}
