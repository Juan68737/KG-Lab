// Schematic of HNSW's layered graph: sparse top layers, dense bottom layer,
// with a greedy descent path and the query-result node highlighted.
const ACCENT = '#7c5cff'
const DIM = '#3f3f46'
const RESULT = '#ef4444'
const LABEL = '#71717a'

// y positions for the three layers
const L2 = 40
const L1 = 95
const L0 = 150

export function HnswDiagram() {
  return (
    <svg viewBox="0 0 400 190" className="h-auto w-full" role="img" aria-label="HNSW layered graph">
      {/* layer labels */}
      <text x="8" y={L2 + 4} fill={LABEL} fontSize="9">layer 2 (sparse)</text>
      <text x="8" y={L1 + 4} fill={LABEL} fontSize="9">layer 1</text>
      <text x="8" y={L0 + 4} fill={LABEL} fontSize="9">layer 0 (dense)</text>

      {/* Layer 2: two nodes + edge */}
      <line x1="150" y1={L2} x2="260" y2={L2} stroke={DIM} strokeWidth="1.5" />
      <circle cx="150" cy={L2} r="5" fill={ACCENT} />
      <circle cx="260" cy={L2} r="5" fill={ACCENT} />

      {/* Layer 1: row of nodes */}
      <line x1="150" y1={L1} x2="350" y2={L1} stroke={DIM} strokeWidth="1.5" />
      <circle cx="150" cy={L1} r="5" fill={ACCENT} />
      <circle cx="205" cy={L1} r="5" fill={ACCENT} />
      <circle cx="260" cy={L1} r="5" fill={ACCENT} />
      <circle cx="350" cy={L1} r="5" fill={ACCENT} />

      {/* Layer 0: dense row, most dimmed, one on-path, query result at end */}
      <line x1="115" y1={L0} x2="370" y2={L0} stroke={DIM} strokeWidth="1.5" />
      {[115, 160, 200, 240, 285, 330, 370].map((x) => (
        <circle key={x} cx={x} cy={L0} r="4.5" fill={x === 200 ? ACCENT : DIM} />
      ))}

      {/* descent path (dashed verticals through the entry column) */}
      <line x1="150" y1={L2} x2="150" y2={L1} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
      <line x1="205" y1={L1} x2="200" y2={L0} stroke={ACCENT} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

      {/* query result node */}
      <circle cx="330" cy={L0} r="7" fill="none" stroke={RESULT} strokeWidth="1.5" />
      <circle cx="330" cy={L0} r="3.5" fill={RESULT} />
      <text x="330" y={L0 + 22} fill={RESULT} fontSize="9" textAnchor="middle">query result</text>
    </svg>
  )
}
