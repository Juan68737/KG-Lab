// Data for the "Explore a knowledge graph" playground (what-is-a-kg).
// A small, populated research KG: typed entities + relationships + properties.
// Node positions are hand-placed so the layout is deterministic (no physics).

export type EntityType = 'Paper' | 'Author' | 'Method' | 'Dataset' | 'Org'

export interface Entity {
  id: string
  label: string
  type: EntityType
  x: number
  y: number
  props: { k: string; v: string }[]
}

export interface Relationship {
  from: string
  to: string
  label: string
}

// Muted categorical palette — the one sanctioned use of color (see DESIGN_SYSTEM §5).
// Tuned to read on both dark and light themes.
export const typeColor: Record<EntityType, string> = {
  Paper: '#a78bfa', // violet
  Author: '#f0b866', // amber
  Method: '#5ec99a', // emerald
  Dataset: '#7cb3f0', // blue
  Org: '#f2a0b4', // rose
}

export const entityTypes: EntityType[] = ['Paper', 'Author', 'Method', 'Dataset', 'Org']

export const entities: Entity[] = [
  // Orgs (far left)
  { id: 'google', label: 'Google', type: 'Org', x: 70, y: 105, props: [{ k: 'founded', v: '1998' }, { k: 'focus', v: 'Industry research' }] },
  { id: 'openai', label: 'OpenAI', type: 'Org', x: 70, y: 345, props: [{ k: 'founded', v: '2015' }, { k: 'focus', v: 'AI research' }] },
  // Authors
  { id: 'vaswani', label: 'Vaswani', type: 'Author', x: 200, y: 70, props: [{ k: 'role', v: 'Researcher' }, { k: 'affiliation', v: 'Google' }] },
  { id: 'devlin', label: 'Devlin', type: 'Author', x: 200, y: 225, props: [{ k: 'role', v: 'Researcher' }, { k: 'affiliation', v: 'Google' }] },
  { id: 'brown', label: 'Brown', type: 'Author', x: 200, y: 365, props: [{ k: 'role', v: 'Researcher' }, { k: 'affiliation', v: 'OpenAI' }] },
  // Papers
  { id: 'attention', label: 'Attention', type: 'Paper', x: 370, y: 80, props: [{ k: 'year', v: '2017' }, { k: 'citations', v: '100k+' }, { k: 'venue', v: 'NeurIPS' }] },
  { id: 'bert', label: 'BERT', type: 'Paper', x: 370, y: 235, props: [{ k: 'year', v: '2018' }, { k: 'citations', v: '90k+' }, { k: 'venue', v: 'NAACL' }] },
  { id: 'gpt3', label: 'GPT-3', type: 'Paper', x: 370, y: 375, props: [{ k: 'year', v: '2020' }, { k: 'citations', v: '30k+' }, { k: 'venue', v: 'NeurIPS' }] },
  // Methods
  { id: 'transformer', label: 'Transformer', type: 'Method', x: 545, y: 215, props: [{ k: 'kind', v: 'Architecture' }, { k: 'year', v: '2017' }] },
  { id: 'selfattn', label: 'Self-Attention', type: 'Method', x: 650, y: 110, props: [{ k: 'kind', v: 'Mechanism' }] },
  // Datasets
  { id: 'wmt', label: 'WMT', type: 'Dataset', x: 560, y: 70, props: [{ k: 'task', v: 'Translation' }, { k: 'kind', v: 'Benchmark' }] },
  { id: 'glue', label: 'GLUE', type: 'Dataset', x: 655, y: 305, props: [{ k: 'task', v: 'NLU' }, { k: 'kind', v: 'Benchmark' }] },
  { id: 'squad', label: 'SQuAD', type: 'Dataset', x: 545, y: 365, props: [{ k: 'task', v: 'Question answering' }, { k: 'kind', v: 'Benchmark' }] },
]

export const relationships: Relationship[] = [
  { from: 'vaswani', to: 'attention', label: 'wrote' },
  { from: 'devlin', to: 'bert', label: 'wrote' },
  { from: 'brown', to: 'gpt3', label: 'wrote' },
  { from: 'attention', to: 'transformer', label: 'introduces' },
  { from: 'bert', to: 'transformer', label: 'based on' },
  { from: 'gpt3', to: 'transformer', label: 'based on' },
  { from: 'transformer', to: 'selfattn', label: 'uses' },
  { from: 'attention', to: 'wmt', label: 'evaluated on' },
  { from: 'bert', to: 'glue', label: 'evaluated on' },
  { from: 'bert', to: 'squad', label: 'evaluated on' },
  { from: 'vaswani', to: 'google', label: 'affiliated with' },
  { from: 'devlin', to: 'google', label: 'affiliated with' },
  { from: 'brown', to: 'openai', label: 'affiliated with' },
]

export const entityById = (id: string) => entities.find((e) => e.id === id)!

// width of a node box for a given label (px), used for layout + edge trimming.
export const nodeWidth = (label: string) => label.length * 7.2 + 26
export const NODE_HEIGHT = 30
