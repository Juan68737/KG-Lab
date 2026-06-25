import { Bot, Flame, ArrowUpRight } from 'lucide-react'
import { Badge } from './Badge'
import { Card } from './Card'
import { HnswDiagram } from './HnswDiagram'
import { hnswContent } from '../data/hnsw'

export function Overview() {
  const c = hnswContent

  return (
    <div className="mx-auto max-w-5xl px-8 py-7">
      {/* Title block */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight">
            {c.title}
          </h1>
          <div className="mt-4 flex items-center gap-2">
            {c.tags.map((t) => (
              <Badge key={t.label} tone="neutral" size="md">
                {t.label}
              </Badge>
            ))}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-3 px-2.5 py-1 text-xs text-fg-muted">
              <Flame className="size-3.5" />
              {c.difficulty}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-medium text-fg transition-colors hover:border-border-strong"
        >
          Ask Claude
          <ArrowUpRight className="size-4 text-fg-subtle" />
        </button>
      </div>

      {/* Agent integration callout */}
      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface-2 p-5">
        <div className="flex items-start gap-3">
          <Bot className="mt-0.5 size-5 shrink-0 text-fg" />
          <p className="text-sm leading-relaxed text-fg-muted">{c.agentCallout}</p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-fg-subtle"
        >
          Try in agent mode
          <ArrowUpRight className="size-4" />
        </button>
      </div>

      {/* Two cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card label="How it works">
          <div className="rounded-xl bg-surface-3/60 p-4">
            <HnswDiagram />
          </div>
        </Card>

        <Card label="Key parameters">
          <div className="grid grid-cols-2 gap-3">
            {c.keyParameters.map((p) => (
              <div key={p.value} className="rounded-xl bg-surface-3 p-4">
                <p className="font-mono text-2xl font-bold leading-none text-fg">{p.value}</p>
                <p className="mt-2 text-xs leading-snug text-fg-subtle">{p.caption}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-xl bg-surface-3/60 p-4 text-sm leading-relaxed text-fg-muted">
            {c.note}
          </p>
        </Card>
      </div>
    </div>
  )
}
