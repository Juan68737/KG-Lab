// A small knowledge graph: typed entities (nodes) joined by labeled
// relationships (edges). Theme-aware monochrome via CSS variables.
const NODE = 'rgb(var(--fg))'
const EDGE = 'rgb(var(--fg-subtle))'
const LABEL = 'rgb(var(--fg-subtle))'
const NODE_TEXT = 'rgb(var(--bg))'

interface Node {
  id: string
  label: string
  x: number
  y: number
}
interface Edge {
  from: string
  to: string
  label: string
}

const nodes: Node[] = [
  { id: 'paper', label: 'Paper', x: 200, y: 45 },
  { id: 'author', label: 'Author', x: 60, y: 140 },
  { id: 'method', label: 'Method', x: 200, y: 175 },
  { id: 'dataset', label: 'Dataset', x: 340, y: 140 },
]

const edges: Edge[] = [
  { from: 'author', to: 'paper', label: 'wrote' },
  { from: 'paper', to: 'method', label: 'introduces' },
  { from: 'paper', to: 'dataset', label: 'evaluates on' },
  { from: 'method', to: 'dataset', label: 'tested on' },
]

const byId = (id: string) => nodes.find((n) => n.id === id)!

export function KnowledgeGraphDiagram() {
  return (
    <svg
      viewBox="0 0 400 210"
      className="h-auto w-full"
      role="img"
      aria-label="Knowledge graph: entities joined by typed relationships"
    >
      {/* Edges first so nodes sit on top */}
      {edges.map((e) => {
        const a = byId(e.from)
        const b = byId(e.to)
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        return (
          <g key={`${e.from}-${e.to}`}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={EDGE} strokeWidth="1.5" />
            <rect
              x={mx - e.label.length * 3 - 4}
              y={my - 8}
              width={e.label.length * 6 + 8}
              height="16"
              rx="4"
              fill="rgb(var(--surface-2))"
            />
            <text x={mx} y={my + 3} fill={LABEL} fontSize="9" textAnchor="middle">
              {e.label}
            </text>
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <rect
            x={n.x - 38}
            y={n.y - 15}
            width="76"
            height="30"
            rx="15"
            fill={NODE}
          />
          <text
            x={n.x}
            y={n.y + 4}
            fill={NODE_TEXT}
            fontSize="12"
            fontWeight="600"
            textAnchor="middle"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}
