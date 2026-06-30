import type { ComponentType } from 'react'
import { KgExplorerPlayground } from './KgExplorerPlayground'

// Maps a lesson id to its Playground component. Lessons without an entry fall
// back to the "coming soon" stub in ContentPanel.
export const playgroundRegistry: Record<string, ComponentType> = {
  'what-is-a-kg': KgExplorerPlayground,
}
