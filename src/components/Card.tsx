import type { ReactNode } from 'react'

// Standard elevated card: border + surface-2, uppercase label header.
export function Card({
  label,
  action,
  children,
  className = '',
}: {
  label?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-xl border border-border bg-surface-2 p-5 ${className}`}>
      {(label || action) && (
        <div className="mb-4 flex items-center justify-between">
          {label && (
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-subtle">
              {label}
            </h3>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
