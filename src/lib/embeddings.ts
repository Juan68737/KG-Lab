// Similarity math + a tiny PCA for 2D projection. The vectors themselves come
// from the Python backend (sentence-transformers) via src/lib/api.ts. See
// ROADMAP.md §3 (compute tiers).

// ---- similarity math ----

export function dot(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length; i++) s += a[i] * b[i]
  return s
}

export function norm(a: number[]): number {
  return Math.sqrt(dot(a, a))
}

export function cosine(a: number[], b: number[]): number {
  const d = norm(a) * norm(b)
  return d === 0 ? 0 : dot(a, b) / d
}

export function l2(a: number[], b: number[]): number {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const diff = a[i] - b[i]
    s += diff * diff
  }
  return Math.sqrt(s)
}

// ---- tiny PCA → 2D ----

export interface PcaBasis {
  mean: number[]
  v1: number[]
  v2: number[]
  fit: { minX: number; maxX: number; minY: number; maxY: number }
}

function meanVec(vecs: number[][]): number[] {
  const d = vecs[0].length
  const m = new Array(d).fill(0)
  for (const v of vecs) for (let i = 0; i < d; i++) m[i] += v[i]
  for (let i = 0; i < d; i++) m[i] /= vecs.length
  return m
}

function normalizeInPlace(v: number[]): number[] {
  const n = Math.sqrt(dot(v, v)) || 1
  for (let i = 0; i < v.length; i++) v[i] /= n
  return v
}

// Leading eigenvector of the covariance via power iteration (deterministic seed).
function powerIteration(centered: number[][], iters = 80): number[] {
  const d = centered[0].length
  let v = normalizeInPlace(new Array(d).fill(0).map((_, i) => Math.sin(i + 1)))
  for (let it = 0; it < iters; it++) {
    const w = new Array(d).fill(0)
    for (const x of centered) {
      const s = dot(x, v)
      for (let i = 0; i < d; i++) w[i] += s * x[i]
    }
    v = normalizeInPlace(w)
  }
  return v
}

/** Build a fixed PCA basis from anchor vectors (scores fit recorded for project). */
export function computeBasis(vecs: number[][]): PcaBasis {
  const mean = meanVec(vecs)
  const centered = vecs.map((v) => v.map((x, i) => x - mean[i]))
  const v1 = powerIteration(centered)
  // Deflate, then second component.
  const deflated = centered.map((x) => {
    const s = dot(x, v1)
    return x.map((xi, i) => xi - s * v1[i])
  })
  const v2 = powerIteration(deflated)

  const xs = centered.map((x) => dot(x, v1))
  const ys = centered.map((x) => dot(x, v2))
  return {
    mean,
    v1,
    v2,
    fit: {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    },
  }
}

/** Project a vector onto the fixed basis, returning clamped viewBox coords. */
export function project(
  basis: PcaBasis,
  vec: number[],
  box: { w: number; h: number; pad: number },
): { x: number; y: number } {
  const centered = vec.map((x, i) => x - basis.mean[i])
  const sx = dot(centered, basis.v1)
  const sy = dot(centered, basis.v2)
  const { minX, maxX, minY, maxY } = basis.fit
  const nx = (sx - minX) / (maxX - minX || 1)
  const ny = (sy - minY) / (maxY - minY || 1)
  const clamp = (t: number) => Math.max(0, Math.min(1, t))
  return {
    x: box.pad + clamp(nx) * (box.w - 2 * box.pad),
    y: box.pad + clamp(ny) * (box.h - 2 * box.pad),
  }
}
