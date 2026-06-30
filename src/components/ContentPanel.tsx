import { useState } from 'react'
import { Play, Bot, FileText, Code2, Lock } from 'lucide-react'
import { Tabs, type TabId } from './Tabs'
import { Overview } from './Overview'
import { TabPlaceholder } from './TabPlaceholder'
import { playgroundRegistry } from './playgrounds'
import { allLessons } from '../data/modules'
import { lessonContent } from '../data/lessons'

export function ContentPanel({ lessonId }: { lessonId: string }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const lesson = allLessons.find((l) => l.id === lessonId)
  const content = lessonContent[lessonId]
  const Playground = playgroundRegistry[lessonId]

  const locked = lesson?.status === 'locked'
  const hasOverview = !locked && !!content

  return (
    <main className="flex h-full min-w-0 flex-1 flex-col bg-surface">
      <Tabs active={activeTab} onChange={setActiveTab} />

      <div className="no-scrollbar flex-1 overflow-y-auto">
        {locked ? (
          <TabPlaceholder
            icon={Lock}
            title={`${lesson?.label ?? 'Lesson'} is locked`}
            description="This lesson unlocks in a later module. Module 0 — Foundations is available now; pick a lesson from the sidebar."
          />
        ) : activeTab === 'overview' ? (
          hasOverview ? (
            <Overview content={content} />
          ) : (
            <TabPlaceholder
              icon={FileText}
              title={`${lesson?.label ?? 'Lesson'} overview`}
              description="Overview content for this lesson is coming soon."
            />
          )
        ) : activeTab === 'playground' ? (
          Playground ? (
            <Playground />
          ) : (
            <TabPlaceholder
              icon={Play}
              title="Interactive playground"
              description="Manipulate the algorithm directly — sliders, live queries, and visualizations. You drive; watch the mechanism."
            />
          )
        ) : activeTab === 'agent' ? (
          <TabPlaceholder
            icon={Bot}
            title="Agent mode"
            description="Give an AI agent a goal and watch it use this technique as a tool — reasoning and tool calls streamed live."
          />
        ) : activeTab === 'papers' ? (
          <TabPlaceholder
            icon={FileText}
            title="Papers & references"
            description="Primary sources and follow-up reading for this lesson."
          />
        ) : (
          <TabPlaceholder
            icon={Code2}
            title="Reference implementation"
            description="The real Python — the library code this lesson is based on."
          />
        )}
      </div>
    </main>
  )
}
