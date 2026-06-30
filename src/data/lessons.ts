// Per-lesson Overview content, data-driven so the Overview tab renders from
// data instead of bespoke components. Diagrams are referenced by key and
// resolved in Overview.tsx. See ROADMAP.md §5 for the data model.

export type Tone = 'violet' | 'green' | 'amber' | 'blue' | 'neutral'

export interface KeyPoint {
  value: string
  caption: string
}

export interface LessonContent {
  title: string
  tags: { label: string; tone: Tone }[]
  difficulty: string
  /** The callout box under the title. */
  callout: string
  /** Left card. Provide a diagram key OR a bullet list. */
  howItWorksLabel?: string
  diagram?: 'hnsw' | 'kg'
  howItWorks?: string[]
  /** Right card. */
  keyPointsLabel?: string
  keyPoints: KeyPoint[]
  note: string
}

export const lessonContent: Record<string, LessonContent> = {
  'what-is-a-kg': {
    title: 'What is a knowledge graph?',
    tags: [
      { label: 'foundations', tone: 'neutral' },
      { label: 'concepts', tone: 'neutral' },
    ],
    difficulty: 'beginner',
    callout:
      'A knowledge graph stores facts as a network of typed entities and relationships — the substrate every later module builds on.',
    howItWorksLabel: 'How it works',
    diagram: 'kg',
    keyPointsLabel: 'Key ideas',
    keyPoints: [
      { value: 'Node', caption: 'An entity — a paper, author, or method' },
      { value: 'Edge', caption: 'A typed relationship between two nodes' },
      { value: 'Triple', caption: '(subject, predicate, object)' },
      { value: 'Property', caption: 'Attributes attached to nodes or edges' },
    ],
    note: 'RDF models facts as (subject, predicate, object) triples; property graphs attach key/value properties to nodes and edges. Same idea, different storage.',
  },

  'embeddings-101': {
    title: 'Embeddings 101',
    tags: [
      { label: 'foundations', tone: 'neutral' },
      { label: 'vectors', tone: 'neutral' },
    ],
    difficulty: 'beginner',
    callout:
      'Embeddings turn text into vectors so "similar meaning" becomes "close in space" — the basis of vector retrieval in Module 1.',
    howItWorksLabel: 'How it works',
    howItWorks: [
      'Tokens → model → a fixed-length vector',
      'Similar meaning → small angle / distance',
      'Normalize, then compare with cosine similarity',
      'Index millions of these for fast search (Module 1)',
    ],
    keyPointsLabel: 'Key ideas',
    keyPoints: [
      { value: 'Vector', caption: 'A list of numbers representing meaning' },
      { value: 'Cosine', caption: 'Angle between vectors (direction)' },
      { value: 'Dot', caption: 'Magnitude-sensitive similarity' },
      { value: 'L2', caption: 'Straight-line distance' },
    ],
    note: 'Cosine ignores magnitude; dot product rewards it; L2 measures absolute distance. Most retrieval uses cosine on normalized vectors.',
  },

  'text-to-structure': {
    title: 'Text → structure',
    tags: [
      { label: 'foundations', tone: 'neutral' },
      { label: 'extraction', tone: 'neutral' },
    ],
    difficulty: 'beginner',
    callout:
      'LLMs can read raw text and emit structured claims and entities — the bridge from documents to a graph (Module 2).',
    howItWorksLabel: 'The pipeline',
    howItWorks: [
      'Chunk documents into passages',
      'Extract entities and claims from each chunk',
      'Link mentions to canonical nodes',
      'Write triples into the graph store',
    ],
    keyPointsLabel: 'Key ideas',
    keyPoints: [
      { value: 'Chunk', caption: 'Split docs into passages' },
      { value: 'Extract', caption: 'Pull entities & claims' },
      { value: 'Link', caption: 'Map mentions to canonical nodes' },
      { value: 'Why now', caption: 'LLMs make extraction cheap & general' },
    ],
    note: 'Before LLMs, extraction needed brittle rules or labeled data per domain. Now one model generalizes across domains from a prompt.',
  },

  'where-it-lives': {
    title: 'Where it lives',
    tags: [
      { label: 'foundations', tone: 'neutral' },
      { label: 'storage', tone: 'neutral' },
    ],
    difficulty: 'beginner',
    callout:
      'Vectors, graphs, and rows have different strengths — and pgvector lets one Postgres do double duty for many apps.',
    howItWorksLabel: 'Pick by access pattern',
    howItWorks: [
      'Similarity search → vector DB (ANN over embeddings)',
      'Multi-hop relationships → graph DB (traversals)',
      'Structured filters / joins → relational (SQL)',
      'pgvector → vectors inside Postgres, one store',
    ],
    keyPointsLabel: 'Key ideas',
    keyPoints: [
      { value: 'Vector DB', caption: 'ANN search over embeddings' },
      { value: 'Graph DB', caption: 'Traversals & path queries' },
      { value: 'Relational', caption: 'Joins, transactions, SQL' },
      { value: 'pgvector', caption: 'Vectors inside Postgres' },
    ],
    note: 'Pick by access pattern: similarity → vector; relationships → graph; structured joins → relational. pgvector blends vector + relational in one store.',
  },

  // Migrated from the old hnsw.ts so the lesson still renders when Module 1 unlocks.
  hnsw: {
    title: 'HNSW — Hierarchical navigable small worlds',
    tags: [
      { label: 'retrieval', tone: 'neutral' },
      { label: 'graph-based', tone: 'neutral' },
    ],
    difficulty: 'intermediate',
    callout:
      'Agent integration: HNSW powers real-time memory recall in agentic loops — used in episodic memory stores and tool retrieval.',
    howItWorksLabel: 'How it works',
    diagram: 'hnsw',
    keyPointsLabel: 'Key parameters',
    keyPoints: [
      { value: 'M = 16', caption: 'Max connections per node' },
      { value: 'ef = 200', caption: 'Search beam width' },
      { value: 'O(log n)', caption: 'Query complexity' },
      { value: '~98%', caption: 'Recall @ 10 (typical)' },
    ],
    note: 'Beats IVF on recall at equal QPS when dataset > 1M vectors. Favored for production pgvector and Weaviate deployments.',
  },
}
