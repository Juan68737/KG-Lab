import { useMemo, useState } from 'react'
import { PlaygroundShell } from './PlaygroundShell'

// Capability per store across the four dimensions: 2 = strong, 1 = partial, 0 = weak.
type Cap = 0 | 1 | 2

interface Dimension {
  id: string
  need: string // the toggle label (a workload need)
  col: string // the table column label
}

interface Store {
  id: string
  name: string
  examples: string
  caps: Record<string, Cap>
  blurb: string
}

const DIMENSIONS: Dimension[] = [
  { id: 'similarity', need: 'Find items by meaning / similarity', col: 'Similarity' },
  { id: 'traversal', need: 'Follow relationships across many hops', col: 'Traversal' },
  { id: 'joins', need: 'Filter & join structured fields', col: 'Joins' },
  { id: 'onestore', need: 'Keep everything in one database', col: 'One store' },
]

const STORES: Store[] = [
  {
    id: 'vector',
    name: 'Vector DB',
    examples: 'Pinecone · Weaviate · Qdrant',
    caps: { similarity: 2, traversal: 0, joins: 0, onestore: 0 },
    blurb: 'Purpose-built for fast approximate nearest-neighbor search over embeddings.',
  },
  {
    id: 'graph',
    name: 'Graph DB',
    examples: 'Neo4j · Memgraph',
    caps: { similarity: 0, traversal: 2, joins: 1, onestore: 0 },
    blurb: 'Stores nodes and edges natively; shines at multi-hop traversals and path queries.',
  },
  {
    id: 'relational',
    name: 'Relational',
    examples: 'PostgreSQL · MySQL',
    caps: { similarity: 0, traversal: 1, joins: 2, onestore: 1 },
    blurb: 'Battle-tested joins, transactions, and SQL over structured rows.',
  },
  {
    id: 'pgvector',
    name: 'pgvector',
    examples: 'Postgres + pgvector',
    caps: { similarity: 2, traversal: 1, joins: 2, onestore: 2 },
    blurb: 'Vectors inside Postgres — similarity search alongside joins, in one database.',
  },
]

const CAP_LABEL: Record<Cap, string> = { 2: 'Strong', 1: 'Partial', 0: 'Weak' }
const CAP_CLASS: Record<Cap, string> = {
  2: 'text-fg',
  1: 'text-fg-muted',
  0: 'text-fg-subtle',
}

function CapDots({ cap }: { cap: Cap }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex gap-0.5">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`size-1.5 rounded-full ${i < cap ? 'bg-fg' : 'bg-surface-3 ring-1 ring-border-strong'}`}
          />
        ))}
      </span>
      <span className={`text-xs ${CAP_CLASS[cap]}`}>{CAP_LABEL[cap]}</span>
    </span>
  )
}

export function WhereItLivesPlayground() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const { winners, scored } = useMemo(() => {
    const sel = [...selected]
    const scored = STORES.map((s) => ({
      store: s,
      score: sel.reduce((sum, d) => sum + s.caps[d], 0),
    }))
    const max = Math.max(...scored.map((s) => s.score))
    const winners = sel.length && max > 0 ? scored.filter((s) => s.score === max) : []
    return { winners, scored }
  }, [selected])

  const winnerIds = new Set(winners.map((w) => w.store.id))

  return (
    <PlaygroundShell
      title="Where does it live?"
      subtitle="Vectors, graphs, and rows each have strengths. Toggle what your workload needs and see which store fits — and why pgvector is a popular do-it-all default."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Needs */}
        <div className="rounded-2xl border border-border bg-surface-2 p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
            What does your workload need?
          </p>
          <div className="flex flex-col gap-2">
            {DIMENSIONS.map((d) => {
              const on = selected.has(d.id)
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggle(d.id)}
                  className={[
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                    on
                      ? 'border-fg bg-accent-soft text-fg'
                      : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'grid size-4 shrink-0 place-items-center rounded border',
                      on ? 'border-fg bg-fg text-bg' : 'border-border-strong',
                    ].join(' ')}
                  >
                    {on && (
                      <svg viewBox="0 0 12 12" className="size-3" fill="none">
                        <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {d.need}
                </button>
              )
            })}
          </div>
        </div>

        {/* Recommendation */}
        <div className="rounded-2xl border border-border bg-surface-2 p-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
            Recommended store
          </p>
          {winners.length ? (
            <div className="flex flex-col gap-4">
              {winners.map(({ store }) => (
                <div key={store.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-semibold">{store.name}</h3>
                    <span className="text-xs text-fg-subtle">{store.examples}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{store.blurb}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[...selected].map((d) => {
                      const dim = DIMENSIONS.find((x) => x.id === d)!
                      return (
                        <span
                          key={d}
                          className="inline-flex items-center gap-1.5 rounded-md bg-surface-3 px-2 py-1 text-xs text-fg"
                        >
                          {dim.col}
                          <span className={CAP_CLASS[store.caps[d]]}>{CAP_LABEL[store.caps[d]]}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              ))}
              {winners.length > 1 && (
                <p className="text-xs text-fg-subtle">Tie — both fit your selected needs equally.</p>
              )}
            </div>
          ) : (
            <div className="flex h-full flex-col justify-center py-8 text-center">
              <p className="text-sm font-medium text-fg">Pick your needs</p>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                Toggle one or more requirements to see which store fits best.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison table */}
      <div className="mt-5 rounded-2xl border border-border bg-surface-2 p-5">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
          How they compare
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 font-medium text-fg-subtle">Store</th>
                {DIMENSIONS.map((d) => (
                  <th
                    key={d.id}
                    className={`pb-2 pr-4 font-medium ${selected.has(d.id) ? 'text-fg' : 'text-fg-subtle'}`}
                  >
                    {d.col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scored.map(({ store }) => (
                <tr
                  key={store.id}
                  className={`border-b border-border/60 last:border-0 ${winnerIds.has(store.id) ? 'bg-accent-soft' : ''}`}
                >
                  <td className="py-2.5 pr-4">
                    <span className="font-medium text-fg">{store.name}</span>
                  </td>
                  {DIMENSIONS.map((d) => (
                    <td key={d.id} className="py-2.5 pr-4">
                      <CapDots cap={store.caps[d.id]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PlaygroundShell>
  )
}
