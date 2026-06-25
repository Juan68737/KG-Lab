// Content for the HNSW module Overview tab (mirrors the mockup copy).

export const hnswContent = {
  title: 'HNSW — Hierarchical navigable small worlds',
  tags: [
    { label: 'retrieval', tone: 'violet' as const },
    { label: 'graph-based', tone: 'green' as const },
  ],
  difficulty: 'intermediate',
  agentCallout:
    'Agent integration: HNSW powers real-time memory recall in agentic loops — used in episodic memory stores and tool retrieval.',
  keyParameters: [
    { value: 'M = 16', caption: 'Max connections per node' },
    { value: 'ef = 200', caption: 'Search beam width' },
    { value: 'O(log n)', caption: 'Query complexity' },
    { value: '~98%', caption: 'Recall @ 10 (typical)' },
  ],
  note: 'Beats IVF on recall at equal QPS when dataset > 1M vectors. Favored for production pgvector and Weaviate deployments.',
}
