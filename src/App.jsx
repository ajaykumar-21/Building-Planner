import { useState } from "react";
import Toolbar from "./components/Toolbar";
import DrawingCanvas from "./components/DrawingCanvas";

function App() {
  const [tool, setTool] = useState("select");
  const [showAnnotations, setShowAnnotations] = useState(true);

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4 text-center text-xl font-semibold">
        Building Planner
      </header>

      <div className="flex flex-1">
        {/* Toolbar */}
        <div className="w-48 bg-gray-100 border-r">
          <Toolbar
            selectedTool={tool}
            setTool={setTool}
            toggleAnnotations={() => setShowAnnotations((prev) => !prev)}
            showAnnotations={showAnnotations}
          />
        </div>
        {/* Drawing Area */}
        <div className="flex-1">
          <DrawingCanvas tool={tool} showAnnotations={showAnnotations} />
        </div>
      </div>
    </div>
  );
}

export default App;
