import { useState } from 'react'
import { ThemeProvider } from './components/ThemeProvider'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { ContentPanel } from './components/ContentPanel'

export default function App() {
  // The active module in the sidebar. HNSW is the focus of the mockup.
  const [activeModuleId, setActiveModuleId] = useState('hnsw')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider>
      <div className="flex h-full w-full bg-bg text-fg">
        {sidebarOpen && (
          <Sidebar activeModuleId={activeModuleId} onSelect={setActiveModuleId} />
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <Header onToggleSidebar={() => setSidebarOpen((o) => !o)} />
          <ContentPanel moduleId={activeModuleId} />
        </div>
      </div>
    </ThemeProvider>
  )
}
