import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { ContentPanel } from './components/ContentPanel'

export default function App() {
  // The active module in the sidebar. HNSW is the focus of the mockup.
  const [activeModuleId, setActiveModuleId] = useState('hnsw')

  return (
    <div className="flex h-full w-full bg-bg text-fg">
      <Sidebar activeModuleId={activeModuleId} onSelect={setActiveModuleId} />
      <ContentPanel moduleId={activeModuleId} />
    </div>
  )
}
