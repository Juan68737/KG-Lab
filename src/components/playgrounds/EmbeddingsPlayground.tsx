import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Plus, AlertTriangle } from 'lucide-react'
import { PlaygroundShell } from './PlaygroundShell'
import {
  embedText,
  computeBasis,
  project,
  cosine,
  dot,
  l2,
  type PcaBasis,
} from '../../lib/embeddings'

// Preset words in obvious clusters so "similar meaning → close together" is visible.
const PRESETS = [
  'dog', 'cat', 'puppy', 'kitten',
  'car', 'truck', 'bicycle',
  'king', 'queen',
  'apple', 'banana',
  'happy', 'joyful', 'sad',
]

const BOX = { w: 460, h: 360, pad: 36 }

type Status = 'loading' | 'ready' | 'error'

export function EmbeddingsPlayground() {
  const [status, setStatus] = useState<Status>('loading')
  const [basis, setBasis] = useState<PcaBasis | null>(null)
  const [words, setWords] = useState<string[]>(PRESETS)
  const [selected, setSelected] = useState<string[]>(['king', 'queen'])
  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const vecs = useRef(new Map<string, number[]>())

  // Load model + embed presets + build the projection basis once.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setStatus('loading')
        const collected: number[][] = []
        for (const w of PRESETS) {
          const v = await embedText(w)
          if (cancelled) return
          vecs.current.set(w, v)
          collected.push(v)
        }
        const b = computeBasis(collected)
        if (cancelled) return
        setBasis(b)
        setStatus('ready')
      } catch (e) {
        console.error('[embeddings] load failed:', e)
        if (!cancelled) setStatus('error')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const positions = useMemo(() => {
    if (!basis) return new Map<string, { x: number; y: number }>()
    const m = new Map<string, { x: number; y: number }>()
    for (const w of words) {
      const v = vecs.current.get(w)
      if (v) m.set(w, project(basis, v, BOX))
    }
    return m
  }, [basis, words])

  function toggleSelect(word: string) {
    setSelected((prev) => {
      if (prev.includes(word)) return prev.filter((w) => w !== word)
      const next = [...prev, word]
      return next.slice(-2) // keep at most the two most recent
    })
  }

  async function addWord() {
    const text = input.trim().toLowerCase()
    if (!text || adding) return
    setInput('')
    if (vecs.current.has(text)) {
      setSelected((p) => [...p, text].slice(-2))
      return
    }
    try {
      setAdding(true)
      const v = await embedText(text)
      vecs.current.set(text, v)
      setWords((w) => (w.includes(text) ? w : [...w, text]))
      setSelected((p) => [...p, text].slice(-2))
    } catch {
      // ignore a single failed embed
    } finally {
      setAdding(false)
    }
  }

  const [a, b] = selected
  const va = a ? vecs.current.get(a) : undefined
  const vb = b ? vecs.current.get(b) : undefined
  const metrics =
    va && vb ? { cos: cosine(va, vb), dotv: dot(va, vb), dist: l2(va, vb) } : null

  return (
    <PlaygroundShell
      title="Embeddings — meaning as position"
      subtitle="Every word becomes a vector, then we flatten those vectors to 2D. Things that mean similar things land close together. Add your own word, or pick two to compare."
    >
      {status === 'loading' ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-2 py-24 text-center">
          <Loader2 className="size-6 animate-spin text-fg-subtle" />
          <p className="text-sm font-medium text-fg">Loading the embedding model…</p>
          <p className="max-w-xs text-xs leading-relaxed text-fg-subtle">
            ~23&nbsp;MB, downloaded once and cached in your browser. Runs fully on-device.
          </p>
        </div>
      ) : status === 'error' ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface-2 py-24 text-center">
          <AlertTriangle className="size-6 text-amber-fg" />
          <p className="text-sm font-medium text-fg">Couldn't load the model</p>
          <p className="max-w-xs text-xs leading-relaxed text-fg-subtle">
            The embedding model needs network access on first load. Check your connection and
            reload.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          {/* Map */}
          <div className="rounded-2xl border border-border bg-surface-2 p-3">
            <svg
              viewBox={`0 0 ${BOX.w} ${BOX.h}`}
              className="h-auto w-full"
              role="img"
              aria-label="2D map of word embeddings"
            >
              {/* connecting line between the two selected words */}
              {a && b && positions.get(a) && positions.get(b) && (
                <line
                  x1={positions.get(a)!.x}
                  y1={positions.get(a)!.y}
                  x2={positions.get(b)!.x}
                  y2={positions.get(b)!.y}
                  stroke="rgb(var(--fg))"
                  strokeWidth="1.25"
                  strokeDasharray="4 3"
                  opacity="0.6"
                />
              )}

              {words.map((w) => {
                const p = positions.get(w)
                if (!p) return null
                const isSel = selected.includes(w)
                const width = w.length * 7.5 + 18
                return (
                  <g
                    key={w}
                    className="cursor-pointer"
                    onClick={() => toggleSelect(w)}
                  >
                    <rect
                      x={p.x - width / 2}
                      y={p.y - 12}
                      width={width}
                      height="24"
                      rx="12"
                      fill={isSel ? 'rgb(var(--fg))' : 'rgb(var(--surface-3))'}
                      stroke={isSel ? 'rgb(var(--fg))' : 'rgb(var(--border-strong))'}
                      strokeWidth="1"
                    />
                    <text
                      x={p.x}
                      y={p.y + 4}
                      fill={isSel ? 'rgb(var(--bg))' : 'rgb(var(--fg-muted))'}
                      fontSize="12"
                      fontWeight={isSel ? 600 : 500}
                      textAnchor="middle"
                    >
                      {w}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Controls + readout */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                Add a word
              </p>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWord()}
                  placeholder="e.g. tiger"
                  className="h-9 w-full rounded-lg border border-border bg-surface-3 px-3 text-sm text-fg placeholder:text-fg-subtle focus:border-border-strong focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addWord}
                  disabled={adding}
                  className="grid size-9 shrink-0 place-items-center rounded-lg bg-fg text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
                  aria-label="Add word"
                >
                  {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-surface-2 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                Compare two words
              </p>
              {metrics ? (
                <>
                  <p className="mb-3 text-sm text-fg">
                    <span className="font-medium">{a}</span>
                    <span className="text-fg-subtle"> vs </span>
                    <span className="font-medium">{b}</span>
                  </p>
                  <Metric label="cosine" hint="direction · higher = closer" value={metrics.cos} bar={(metrics.cos + 1) / 2} />
                  <Metric label="dot" hint="rewards magnitude" value={metrics.dotv} />
                  <Metric label="L2" hint="distance · lower = closer" value={metrics.dist} />
                </>
              ) : (
                <p className="text-sm leading-relaxed text-fg-muted">
                  Pick two words on the map to see their cosine, dot, and L2.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PlaygroundShell>
  )
}

function Metric({
  label,
  hint,
  value,
  bar,
}: {
  label: string
  hint: string
  value: number
  bar?: number
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-sm font-semibold text-fg">{label}</span>
        <span className="font-mono text-sm text-fg">{value.toFixed(2)}</span>
      </div>
      {bar !== undefined && (
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
          <div className="h-full rounded-full bg-fg" style={{ width: `${Math.max(0, Math.min(1, bar)) * 100}%` }} />
        </div>
      )}
      <p className="mt-1 text-[11px] text-fg-subtle">{hint}</p>
    </div>
  )
}
