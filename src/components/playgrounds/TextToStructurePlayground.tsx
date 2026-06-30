import { useEffect, useRef, useState } from 'react'
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import { PlaygroundShell } from './PlaygroundShell'
import { extractText, type ExtractResult } from '../../lib/api'

const EXAMPLES: { label: string; text: string }[] = [
  {
    label: 'Transformers',
    text: 'Vaswani introduced the Transformer in the Attention paper. BERT, created by Devlin at Google, is based on the Transformer and was evaluated on GLUE. Later OpenAI released GPT-3, which also builds on the Transformer.',
  },
  {
    label: 'Databases',
    text: 'PostgreSQL is a relational database. The pgvector extension adds vector search to PostgreSQL. Pinecone and Weaviate are dedicated vector databases, while Neo4j is a graph database used for traversals.',
  },
]

type Status = 'idle' | 'loading' | 'ready' | 'error'

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Highlight any entity span found by spaCy inside the original text.
function Highlighted({ text, entities }: { text: string; entities: { text: string }[] }) {
  const names = [...new Set(entities.map((e) => e.text))].sort((a, b) => b.length - a.length)
  if (!names.length) return <>{text}</>
  const re = new RegExp(`(${names.map(escapeRe).join('|')})`, 'g')
  const set = new Set(names)
  return (
    <>
      {text.split(re).map((p, i) =>
        set.has(p) ? (
          <mark key={i} className="rounded bg-accent-soft px-1 font-medium text-fg">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export function TextToStructurePlayground() {
  const [text, setText] = useState(EXAMPLES[0].text)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<ExtractResult | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced extraction on text change.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (!text.trim()) {
      setResult(null)
      setStatus('idle')
      return
    }
    timer.current = setTimeout(async () => {
      try {
        setStatus('loading')
        const r = await extractText(text)
        setResult(r)
        setStatus('ready')
      } catch {
        setStatus('error')
      }
    }, 500)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [text])

  return (
    <PlaygroundShell
      title="From text to structure"
      subtitle="Real NLP, not keyword matching: spaCy splits the text into sentences, tags named entities, and pulls subject–verb–object relations from the dependency parse. Edit the text or paste your own."
    >
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                Your text
              </p>
              <div className="flex gap-1">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => setText(ex.text)}
                    className="rounded-md border border-border px-2 py-1 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              className="w-full resize-none rounded-lg border border-border bg-surface-3 p-3 text-sm leading-relaxed text-fg focus:border-border-strong focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-border bg-surface-2 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
              Entities highlighted
              {status === 'loading' && <Loader2 className="size-3 animate-spin" />}
            </p>
            <p className="text-sm leading-relaxed text-fg-muted">
              <Highlighted text={text} entities={result?.entities ?? []} />
            </p>
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-3">
          {status === 'error' ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface-2 py-16 text-center">
              <AlertTriangle className="size-5 text-amber-fg" />
              <p className="text-sm font-medium text-fg">Couldn't reach the backend</p>
              <p className="max-w-xs text-xs leading-relaxed text-fg-subtle">
                Extraction runs on the Python API. Start it with{' '}
                <span className="font-mono text-fg-muted">just api</span> and edit the text.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <Stat n={result?.sentences.length ?? 0} label="sentences" />
                <Stat n={result?.entities.length ?? 0} label="entities" />
                <Stat n={result?.relations.length ?? 0} label="relations" />
              </div>

              <div className="rounded-2xl border border-border bg-surface-2 p-4">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                  Entities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {result?.entities.length ? (
                    result.entities.map((e, i) => (
                      <span
                        key={`${e.text}-${i}`}
                        className="inline-flex items-center gap-1.5 rounded-md bg-surface-3 px-2 py-1 text-xs text-fg"
                      >
                        {e.text}
                        <span className="text-[10px] font-medium text-fg-subtle">{e.label}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-fg-subtle">None found.</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-surface-2 p-4">
                <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
                  <Sparkles className="size-3" />
                  Relations (subject → verb → object)
                </p>
                <ul className="flex flex-col gap-2">
                  {result?.relations.length ? (
                    result.relations.map((r, i) => (
                      <li key={i} className="flex flex-wrap items-center gap-1.5 text-xs">
                        <Chip>{r.subj}</Chip>
                        <span className="text-fg-subtle">{r.rel}</span>
                        <Chip>{r.obj}</Chip>
                      </li>
                    ))
                  ) : (
                    <span className="text-sm text-fg-subtle">
                      No subject–verb–object relations in this text.
                    </span>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </PlaygroundShell>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-surface-3 px-2 py-0.5 font-medium text-fg">{children}</span>
  )
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl bg-surface-3 p-3 text-center">
      <p className="font-mono text-2xl font-bold leading-none text-fg">{n}</p>
      <p className="mt-1.5 text-[11px] text-fg-subtle">{label}</p>
    </div>
  )
}
