import { LayoutDashboard, Lock } from 'lucide-react'
import { Badge } from './Badge'
import {
  modules,
  completedCount,
  totalCount,
  type Lesson,
  type LessonStatus,
} from '../data/modules'

function StatusBadge({ status }: { status: LessonStatus }) {
  if (status === 'done') return <Badge tone="green">done</Badge>
  if (status === 'active') return <Badge tone="amber">active</Badge>
  if (status === 'new') return <Badge tone="blue">new</Badge>
  return null
}

function NavItem({
  lesson,
  isActive,
  onSelect,
}: {
  lesson: Lesson
  isActive: boolean
  onSelect: (id: string) => void
}) {
  const locked = lesson.status === 'locked'
  const Icon = lesson.icon

  return (
    <button
      type="button"
      disabled={locked}
      onClick={() => !locked && onSelect(lesson.id)}
      className={[
        'group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-accent-soft text-fg font-medium'
          : locked
            ? 'text-fg-subtle cursor-not-allowed'
            : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
      ].join(' ')}
    >
      {locked ? (
        <Lock className="size-4 shrink-0 text-fg-subtle" />
      ) : (
        <Icon className={`size-4 shrink-0 ${isActive ? 'text-fg' : 'text-fg-subtle'}`} />
      )}
      <span className="flex-1 truncate text-left">{lesson.label}</span>
      <StatusBadge status={lesson.status} />
    </button>
  )
}

export function Sidebar({
  activeLessonId,
  onSelect,
}: {
  activeLessonId: string
  onSelect: (id: string) => void
}) {
  const progress = Math.round((completedCount / totalCount) * 100)

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-border bg-surface">
      {/* Logo + progress */}
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-bg">
            <LayoutDashboard className="size-4" />
          </div>
          <span className="text-base font-semibold">KG Lab</span>
        </div>

        <div className="mt-5">
          <p className="text-xs text-fg-subtle">Your progress</p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
            <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-fg-subtle">
            {completedCount} of {totalCount} lessons
          </p>
        </div>
      </div>

      {/* Modules 0–5 */}
      <nav className="no-scrollbar flex-1 overflow-y-auto px-2 py-3">
        {modules.map((module) => (
          <div key={module.number} className="mb-2">
            <p className="mb-1 mt-3 px-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle">
              Module {module.number} · {module.title}
            </p>
            <div className="flex flex-col gap-1">
              {module.lessons.map((lesson) => (
                <NavItem
                  key={lesson.id}
                  lesson={lesson}
                  isActive={lesson.id === activeLessonId}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
