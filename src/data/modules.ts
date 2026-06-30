import type { LucideIcon } from 'lucide-react'
import {
  BookOpen,
  Binary,
  FileText,
  Database,
  Search,
  Layers,
  Hexagon,
  Shrink,
  ScanText,
  Merge,
  Spline,
  Network,
  Share2,
  Workflow,
  TrendingUp,
  Link2,
  Brain,
  Blend,
  Combine,
  ArrowUpDown,
  Boxes,
  Columns3,
  GitGraph,
  Waypoints,
  Clock,
  Gauge,
} from 'lucide-react'

// 'available' = unlocked and clickable but not yet completed (no badge).
export type LessonStatus = 'done' | 'active' | 'available' | 'new' | 'locked'

export interface Lesson {
  id: string
  label: string
  icon: LucideIcon
  status: LessonStatus
}

export interface Module {
  number: number
  title: string
  lessons: Lesson[]
}

// Curriculum from ROADMAP.md. Current scope: Module 0 is unlocked; Modules 1–5
// are locked until their lessons are built.
export const modules: Module[] = [
  {
    number: 0,
    title: 'Foundations',
    lessons: [
      { id: 'what-is-a-kg', label: 'What is a knowledge graph', icon: BookOpen, status: 'active' },
      { id: 'embeddings-101', label: 'Embeddings 101', icon: Binary, status: 'available' },
      { id: 'text-to-structure', label: 'Text → structure', icon: FileText, status: 'available' },
      { id: 'where-it-lives', label: 'Where it lives', icon: Database, status: 'available' },
    ],
  },
  {
    number: 1,
    title: 'Vector Retrieval',
    lessons: [
      { id: 'flat-search', label: 'Flat / brute-force kNN', icon: Search, status: 'locked' },
      { id: 'ivf-index', label: 'IVF index', icon: Layers, status: 'locked' },
      { id: 'hnsw', label: 'HNSW', icon: Hexagon, status: 'locked' },
      { id: 'quantization', label: 'Quantization & precision', icon: Shrink, status: 'locked' },
    ],
  },
  {
    number: 2,
    title: 'Graph Construction',
    lessons: [
      { id: 'entity-extraction', label: 'Entity extraction & linking', icon: ScanText, status: 'locked' },
      { id: 'entity-resolution', label: 'Entity resolution / dedup', icon: Merge, status: 'locked' },
      { id: 'relation-extraction', label: 'Relation extraction', icon: Spline, status: 'locked' },
      { id: 'schema-design', label: 'Schema & ontology design', icon: Network, status: 'locked' },
    ],
  },
  {
    number: 3,
    title: 'Graph ML',
    lessons: [
      { id: 'node2vec', label: 'Node embeddings (Node2Vec)', icon: Share2, status: 'locked' },
      { id: 'community-detection', label: 'Community detection', icon: Workflow, status: 'locked' },
      { id: 'centrality', label: 'Centrality & ranking', icon: TrendingUp, status: 'locked' },
      { id: 'link-prediction', label: 'Link prediction', icon: Link2, status: 'locked' },
      { id: 'gnn-intro', label: 'GNNs (intro)', icon: Brain, status: 'locked' },
    ],
  },
  {
    number: 4,
    title: 'Hybrid Retrieval',
    lessons: [
      { id: 'sparse-dense', label: 'Sparse + dense', icon: Blend, status: 'locked' },
      { id: 'fusion', label: 'Fusion (RRF)', icon: Combine, status: 'locked' },
      { id: 'reranking', label: 'Reranking', icon: ArrowUpDown, status: 'locked' },
      { id: 'matryoshka', label: 'Matryoshka emb.', icon: Boxes, status: 'locked' },
      { id: 'colbert', label: 'ColBERT', icon: Columns3, status: 'locked' },
    ],
  },
  {
    number: 5,
    title: 'Agentic + Research',
    lessons: [
      { id: 'graphrag', label: 'GraphRAG', icon: GitGraph, status: 'locked' },
      { id: 'kg-rag', label: 'KG-RAG', icon: Database, status: 'locked' },
      { id: 'multi-hop', label: 'Multi-hop reasoning', icon: Waypoints, status: 'locked' },
      { id: 'temporal-kgs', label: 'Temporal KGs', icon: Clock, status: 'locked' },
      { id: 'evaluation', label: 'Evaluation', icon: Gauge, status: 'locked' },
    ],
  },
]

export const allLessons = modules.flatMap((m) => m.lessons)

// Progress: count completed + the active lesson (in-progress) toward the total.
export const completedCount = allLessons.filter(
  (l) => l.status === 'done' || l.status === 'active',
).length
export const totalCount = allLessons.length
