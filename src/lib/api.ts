// Thin client for the KG Lab FastAPI backend (run with `just api`).
// In dev, Vite proxies /api → http://localhost:8000.

export interface ExtractedEntity {
  text: string
  label: string
}
export interface ExtractedRelation {
  subj: string
  rel: string
  obj: string
}
export interface ExtractResult {
  sentences: string[]
  entities: ExtractedEntity[]
  relations: ExtractedRelation[]
}

async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${path} failed: ${res.status}`)
  return res.json() as Promise<T>
}

/** spaCy NER + dependency-parse relations for a block of text. */
export function extractText(text: string): Promise<ExtractResult> {
  return postJSON<ExtractResult>('/api/extract', { text })
}

/** sentence-transformers embeddings; returns one raw vector per input text. */
export async function embedTexts(texts: string[]): Promise<number[][]> {
  const d = await postJSON<{ vectors: number[][] }>('/api/embed', { texts })
  return d.vectors
}
