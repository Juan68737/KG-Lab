import { PanelLeft, Search, Activity, Bell, Palette } from 'lucide-react'
import { AnimatedThemeToggle } from './AnimatedThemeToggle'

function IconButton({
  label,
  children,
  dot,
}: {
  label: string
  children: React.ReactNode
  dot?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative grid size-9 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-accent-soft hover:text-fg"
    >
      {children}
      {dot && (
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red-500 ring-2 ring-surface" />
      )}
    </button>
  )
}

// AdminCN-style top bar: collapse toggle, search, action icons, theme toggle, avatar.
export function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface px-5">
      <button
        type="button"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
        className="grid size-9 place-items-center rounded-lg text-fg-subtle transition-colors hover:bg-accent-soft hover:text-fg"
      >
        <PanelLeft className="size-[18px]" />
      </button>

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" />
        <input
          type="text"
          placeholder="Type to search..."
          className="h-10 w-full rounded-lg border border-border bg-surface-3 pl-9 pr-12 text-sm text-fg placeholder:text-fg-subtle focus:border-border-strong focus:outline-none"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <IconButton label="Activity">
          <Activity className="size-[18px]" />
        </IconButton>
        <IconButton label="Notifications" dot>
          <Bell className="size-[18px]" />
        </IconButton>
        <AnimatedThemeToggle />
        <IconButton label="Appearance">
          <Palette className="size-[18px]" />
        </IconButton>

        {/* Avatar */}
        <div className="relative ml-1.5">
          <div className="grid size-9 place-items-center overflow-hidden rounded-full bg-surface-3 text-xs font-medium text-fg-muted">
            KG
          </div>
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-fg ring-2 ring-surface" />
        </div>
      </div>
    </header>
  )
}
