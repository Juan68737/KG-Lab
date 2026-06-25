import { useState } from 'react'
import { Play, Bot, FileText, Code2, Lock } from 'lucide-react'
import { Tabs, type TabId } from './Tabs'
import { Overview } from './Overview'
import { TabPlaceholder } from './TabPlaceholder'
import { allModules } from '../data/modules'

export function ContentPanel({ moduleId }: { moduleId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const module = allModules.find((m) => m.id === moduleId)

  // Only HNSW has full content in this build; other modules show a locked state.
  const isHnsw = moduleId === 'hnsw'

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col bg-surface">
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {!isHnsw ? (
          <TabPlaceholder
            icon={Lock}
            title={`${module?.label ?? 'Module'} not unlocked yet`}
            description="Complete the prior modules to unlock this lesson. HNSW is the active module — select it from the sidebar."
          />
        ) : activeTab === 'overview' ? (
          <Overview />
        ) : activeTab === 'playground' ? (
          <TabPlaceholder
            icon={Play}
            title="Interactive playground"
            description="Tune M and ef, watch the graph rebuild, and run live nearest-neighbor queries against a sample dataset."
          />
        ) : activeTab === 'agent' ? (
          <TabPlaceholder
            icon={Bot}
            title="Agent mode"
            description="Drop HNSW into an agentic loop and watch it power episodic memory recall and tool retrieval in real time."
          />
        ) : activeTab === 'papers' ? (
          <TabPlaceholder
            icon={FileText}
            title="Papers & references"
            description="The original Malkov & Yashunin HNSW paper plus follow-up work on filtered and disk-based variants."
          />
        ) : (
          <TabPlaceholder
            icon={Code2}
            title="Reference implementation"
            description="Copy-paste-ready HNSW snippets for pgvector, Weaviate, and a from-scratch Python build."
          />
        )}
      </div>
    </main>
  )
}
