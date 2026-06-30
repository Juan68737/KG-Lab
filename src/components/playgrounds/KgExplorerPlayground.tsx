import { useMemo, useState } from 'react'
import { PlaygroundShell } from './PlaygroundShell'
import {
  entities,
  relationships,
  typeColor,
  entityTypes,
  entityById,
  nodeWidth,
  NODE_HEIGHT,
  type Relationship,
} from './kgExplorerData'

type View = 'graph' | 'triples'

const VIEW_W = 740
const VIEW_H = 430

// Pull an edge endpoint back toward its source so the arrowhead sits just
// outside the target node instead of under it.
function trim(x1: number, y1: number, x2: number, y2: number, pad: number) {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.hypot(dx, dy) || 1
  return { x: x2 - (dx / len) * pad, y: y2 - (dy / len) * pad }
}

function EntityChip({ id }: { id: string }) {
  const e = entityById(id)
  const c = typeColor[e.type]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: `${c}22`, color: 'rgb(var(--fg))' }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: c }} />
      {e.label}
    </span>
  )
}

export function KgExplorerPlayground() {
  const [view, setView] = useState<View>('graph')
  const [selected, setSelected] = useState<string | null>(null)

  // Neighbors + incident edges of the selected node.
  const { neighborIds, incident } = useMemo(() => {
    if (!selected) return { neighborIds: new Set<string>(), incident: new Set<Relationship>() }
    const n = new Set<string>()
    const inc = new Set<Relationship>()
    for (const r of relationships) {
      if (r.from === selected) { n.add(r.to); inc.add(r) }
      else if (r.to === selected) { n.add(r.from); inc.add(r) }
    }
    return { neighborIds: n, incident: inc }
  }, [selected])

  const sel = selected ? entityById(selected) : null
  const selRels = relationships.filter((r) => incident.has(r))

  return (
    <PlaygroundShell
      title="Explore a knowledge graph"
      subtitle="A small research knowledge graph: typed entities joined by relationships. Click any node to inspect its type, properties, and connections — then flip to the triples view to see the same graph as facts."
      toolbar={
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-1">
          {(['graph', 'triples'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={[
                'rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                view === v ? 'bg-surface-3 text-fg' : 'text-fg-muted hover:text-fg',
              ].join(' ')}
            >
              {v}
            </button>
          ))}
        </div>
      }
    >
      {view === 'graph' ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          {/* Graph canvas */}
          <div className="rounded-2xl border border-border bg-surface-2 p-3">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="h-auto w-full"
              role="img"
              aria-label="Knowledge graph of papers, authors, methods, datasets and orgs"
            >
              <defs>
                <marker
                  id="kg-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="context-stroke" />
                </marker>
              </defs>

              {/* click-catcher to deselect */}
              <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="transparent" onClick={() => setSelected(null)} />

              {/* Edges */}
              {relationships.map((r) => {
                const a = entityById(r.from)
                const b = entityById(r.to)
                const isInc = incident.has(r)
                const dim = selected && !isInc
                const start = trim(b.x, b.y, a.x, a.y, nodeWidth(a.label) / 2 + 4)
                const end = trim(a.x, a.y, b.x, b.y, nodeWidth(b.label) / 2 + 8)
                const mx = (start.x + end.x) / 2
                const my = (start.y + end.y) / 2
                return (
                  <g key={`${r.from}-${r.to}`} opacity={dim ? 0.12 : 1} className="transition-opacity">
                    <line
                      x1={start.x}
                      y1={start.y}
                      x2={end.x}
                      y2={end.y}
                      stroke={isInc ? 'rgb(var(--fg))' : 'rgb(var(--fg-subtle))'}
                      strokeWidth={isInc ? 1.75 : 1.25}
                      markerEnd="url(#kg-arrow)"
                    />
                    {isInc && (
                      <>
                        <rect
                          x={mx - r.label.length * 3 - 5}
                          y={my - 8}
                          width={r.label.length * 6 + 10}
                          height="16"
                          rx="4"
                          fill="rgb(var(--surface-2))"
                        />
                        <text x={mx} y={my + 3} fill="rgb(var(--fg-muted))" fontSize="9.5" textAnchor="middle">
                          {r.label}
                        </text>
                      </>
                    )}
                  </g>
                )
              })}

              {/* Nodes */}
              {entities.map((e) => {
                const w = nodeWidth(e.label)
                const c = typeColor[e.type]
                const isSel = selected === e.id
                const isNeighbor = neighborIds.has(e.id)
                const dim = selected && !isSel && !isNeighbor
                return (
                  <g
                    key={e.id}
                    opacity={dim ? 0.3 : 1}
                    className="cursor-pointer transition-opacity"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      setSelected(isSel ? null : e.id)
                    }}
                  >
                    <rect
                      x={e.x - w / 2}
                      y={e.y - NODE_HEIGHT / 2}
                      width={w}
                      height={NODE_HEIGHT}
                      rx={NODE_HEIGHT / 2}
                      fill={c}
                      fillOpacity={isSel ? 0.35 : 0.16}
                      stroke={c}
                      strokeOpacity={isSel ? 1 : 0.55}
                      strokeWidth={isSel ? 2 : 1.25}
                    />
                    <text
                      x={e.x}
                      y={e.y + 4}
                      fill="rgb(var(--fg))"
                      fontSize="12.5"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {e.label}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-2 pb-1 pt-2">
              {entityTypes.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
                  <span className="size-2 rounded-full" style={{ backgroundColor: typeColor[t] }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="rounded-2xl border border-border bg-surface-2 p-5">
            {sel ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: typeColor[sel.type] }} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                    {sel.type}
                  </span>
                </div>
                <h3 className="mt-1 text-xl font-semibold">{sel.label}</h3>

                <dl className="mt-4 flex flex-col gap-2">
                  {sel.props.map((p) => (
                    <div key={p.k} className="flex justify-between gap-3 text-sm">
                      <dt className="text-fg-subtle">{p.k}</dt>
                      <dd className="text-right font-medium text-fg">{p.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-5 border-t border-border pt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                    Relationships
                  </p>
                  <ul className="flex flex-col gap-2">
                    {selRels.map((r) => (
                      <li key={`${r.from}-${r.to}`} className="flex flex-wrap items-center gap-1.5 text-xs">
                        <EntityChip id={r.from} />
                        <span className="text-fg-subtle">{r.label}</span>
                        <EntityChip id={r.to} />
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col justify-center py-6 text-center">
                <p className="text-sm font-medium text-fg">Click a node</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                  Select any entity to see its type, properties, and the relationships that connect it.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Triples view
        <div className="rounded-2xl border border-border bg-surface-2 p-6">
          <p className="mb-4 text-sm text-fg-muted">
            The same graph, read as <span className="text-fg">{relationships.length} triples</span> —
            each relationship is one <span className="font-mono">(subject, predicate, object)</span> fact.
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-2 text-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">Subject</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">Predicate</div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">Object</div>
            {relationships.map((r) => (
              <div key={`${r.from}-${r.to}`} className="contents">
                <div className="flex items-center"><EntityChip id={r.from} /></div>
                <div className="flex items-center text-fg-muted">{r.label}</div>
                <div className="flex items-center"><EntityChip id={r.to} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PlaygroundShell>
  )
}
