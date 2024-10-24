import { SchemaVisualizer } from './components/SchemaVisualizer';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="flex h-screen bg-[#0F172A]">
      <Sidebar />
      <div className="flex-1 relative">
        <SchemaVisualizer />
      </div>
    </div>
  );
}

export default App;
