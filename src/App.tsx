import { useState } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { ContentPanel } from './components/ContentPanel'

export default function App() {
  // The active lesson in the sidebar. Module 0's first lesson is the default.
  const [activeLessonId, setActiveLessonId] = useState('what-is-a-kg')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider>
      <div className="flex h-full w-full bg-bg text-fg">
        {sidebarOpen && (
          <Sidebar activeLessonId={activeLessonId} onSelect={setActiveLessonId} />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
          <ContentPanel lessonId={activeLessonId} />
        </div>
      </div>
    </ThemeProvider>
  )
}
