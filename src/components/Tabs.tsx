import type { LucideIcon } from 'lucide-react'
import { LayoutGrid, Play, Bot, FileText, Code2 } from 'lucide-react'

export type TabId = 'overview' | 'playground' | 'agent' | 'papers' | 'code'

interface Tab {
  id: TabId
  label: string
  icon: LucideIcon
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'agent', label: 'Agent mode', icon: Bot },
  { id: 'papers', label: 'Papers', icon: FileText },
  { id: 'code', label: 'Code', icon: Code2 },
]

export function Tabs({
  active,
  onChange,
}: {
  active: TabId
  onChange: (id: TabId) => void
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border px-3">
      {tabs.map((tab) => {
        const isActive = tab.id === active
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={[
              'relative flex items-center gap-2 px-3 py-3.5 text-sm font-medium transition-colors',
              isActive ? 'text-fg' : 'text-fg-muted hover:text-fg',
            ].join(' ')}
          >
            <Icon className="size-4" />
            {tab.label}
            {isActive && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-fg" />
            )}
          </button>
        )
      })}
    </div>
  )
}
