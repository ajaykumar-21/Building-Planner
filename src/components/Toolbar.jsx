const tools = [
  { name: "select", label: "Select" },
  { name: "line", label: "Line" },
  { name: "rect", label: "Rectangle" },
  { name: "circle", label: "Circle" },
];

export default function Toolbar({
  selectedTool,
  setTool,
  toggleAnnotations,
  showAnnotations,
}) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-medium mb-2">Tools</h2>
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => setTool(tool.name)}
          className={`block w-full text-left px-3 py-2 rounded 
            ${
              selectedTool === tool.name
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
        >
          {tool.label}
        </button>
      ))}

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-2">View</h2>
        <button
          onClick={toggleAnnotations}
          className="text-sm px-3 py-2 border rounded w-full hover:bg-gray-200"
        >
          {showAnnotations ? "Hide Annotations" : "Show Annotations"}
        </button>
      </div>
    </div>
  );
}
