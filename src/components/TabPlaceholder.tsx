import type { LucideIcon } from 'lucide-react'

// Stub shown for tabs that aren't built yet (Playground, Agent, Papers, Code).
export function TabPlaceholder({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col items-center px-8 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-surface-2">
        <Icon className="size-6 text-fg-subtle" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-fg-muted">{description}</p>
      <span className="mt-4 inline-flex items-center rounded-full bg-surface-3 px-2.5 py-1 text-xs text-fg-subtle">
        Coming soon
      </span>
    </div>
  )
}
