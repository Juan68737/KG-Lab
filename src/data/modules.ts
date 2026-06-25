import type { LucideIcon } from 'lucide-react'
import {
  Search,
  Layers,
  Hexagon,
  Link2,
  Share2,
  Network,
  ArrowUpDown,
  Boxes,
  Columns3,
  GitGraph,
  Database,
  Clock,
} from 'lucide-react'

export type ModuleStatus = 'done' | 'active' | 'new' | 'locked'

export interface Module {
  id: string
  label: string
  icon: LucideIcon
  status: ModuleStatus
}

export interface ModuleGroup {
  label: string
  modules: Module[]
}

// Mirrors the KG Lab sidebar in the mockup, grouped by stage.
export const moduleGroups: ModuleGroup[] = [
  {
    label: 'Retrieval',
    modules: [
      { id: 'flat-search', label: 'Flat search', icon: Search, status: 'done' },
      { id: 'ivf-index', label: 'IVF index', icon: Layers, status: 'done' },
      { id: 'hnsw', label: 'HNSW', icon: Hexagon, status: 'active' },
    ],
  },
  {
    label: 'Graph construction',
    modules: [
      { id: 'entity-linking', label: 'Entity linking', icon: Link2, status: 'locked' },
      { id: 'node2vec', label: 'Node2Vec', icon: Share2, status: 'locked' },
      { id: 'louvain-leiden', label: 'Louvain / Leiden', icon: Network, status: 'locked' },
    ],
  },
  {
    label: 'Hybrid retrieval',
    modules: [
      { id: 'reranking', label: 'Reranking', icon: ArrowUpDown, status: 'locked' },
      { id: 'matryoshka', label: 'Matryoshka emb.', icon: Boxes, status: 'locked' },
      { id: 'colbert', label: 'ColBERT', icon: Columns3, status: 'locked' },
    ],
  },
  {
    label: 'Agentic + research',
    modules: [
      { id: 'graphrag', label: 'GraphRAG', icon: GitGraph, status: 'new' },
      { id: 'kg-rag', label: 'KG-RAG', icon: Database, status: 'locked' },
      { id: 'temporal-kgs', label: 'Temporal KGs', icon: Clock, status: 'locked' },
    ],
  },
]

export const allModules = moduleGroups.flatMap((g) => g.modules)

// Progress numbers shown in the sidebar. The mockup displays "3 of 11" (HNSW,
// the active module, counts as in-progress toward 3). Keep these as the source
// of truth for the copy rather than deriving from statuses.
export const completedCount = 3
export const totalCount = 11
