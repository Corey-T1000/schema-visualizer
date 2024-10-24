import { SchemaVisualizer } from './components/SchemaVisualizer';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <div className="relative w-full h-screen bg-[#0F172A] overflow-hidden">
      {/* Base layer - Three.js visualization */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <SchemaVisualizer />
      </div>
      
      {/* Middle layer - Sidebar */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
