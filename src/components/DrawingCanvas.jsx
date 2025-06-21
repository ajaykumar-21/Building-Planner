import { useRef, useState, useEffect } from "react";

export default function DrawingCanvas({ tool, showAnnotations }) {
  const canvasRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState(null);

  useEffect(() => {
    redraw();
  }, [shapes, currentShape, showAnnotations, selectedShapeIndex]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e) => {
    const pos = getMousePos(e);

    if (tool === "select") {
      const index = shapes.findIndex((shape) => isInsideShape(pos, shape));
      if (index !== -1) {
        const shape = shapes[index];
        const offset = {
          x: pos.x - shape.start.x,
          y: pos.y - shape.start.y,
        };
        setSelectedShapeIndex(index);
        setDragOffset(offset);
        setIsDrawing(true);
      } else {
        setSelectedShapeIndex(null);
      }
      return;
    }

    setIsDrawing(true);
    setCurrentShape({
      type: tool,
      start: pos,
      end: pos,
    });
  };

  const handleMouseMove = (e) => {
    const pos = getMousePos(e);

    if (tool === "select" && isDrawing && selectedShapeIndex !== null) {
      const updatedShapes = [...shapes];
      const shape = updatedShapes[selectedShapeIndex];
      const dx = pos.x - dragOffset.x;
      const dy = pos.y - dragOffset.y;

      const width = shape.end.x - shape.start.x;
      const height = shape.end.y - shape.start.y;

      shape.start = { x: dx, y: dy };
      shape.end = { x: dx + width, y: dy + height };

      setShapes(updatedShapes);
      return;
    }

    if (isDrawing && currentShape) {
      setCurrentShape({ ...currentShape, end: pos });
    }
  };

  const handleMouseUp = () => {
    if (tool === "select") {
      setIsDrawing(false);
      return;
    }

    if (currentShape) {
      setShapes([...shapes, currentShape]);
      setCurrentShape(null);
      setIsDrawing(false);
    }
  };

  const isInsideShape = (pos, shape) => {
    const { start, end, type } = shape;

    if (type === "circle") {
      const radius = Math.hypot(end.x - start.x, end.y - start.y);
      const dist = Math.hypot(pos.x - start.x, pos.y - start.y);
      return dist <= radius;
    }

    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
  };

  const drawShape = (ctx, shape, index) => {
    const { start, end, type } = shape;
    ctx.beginPath();
    ctx.strokeStyle = selectedShapeIndex === index ? "blue" : "black";

    if (type === "line") {
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    } else if (type === "rect") {
      ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (type === "circle") {
      const radius = Math.hypot(end.x - start.x, end.y - start.y);
      ctx.arc(start.x, start.y, radius, 0, Math.PI * 2);
    }

    ctx.stroke();

    if (showAnnotations) {
      ctx.font = "12px Arial";
      ctx.fillStyle = "red";
      const width = Math.abs(end.x - start.x).toFixed(0);
      const height = Math.abs(end.y - start.y).toFixed(0);

      if (type === "line") {
        ctx.fillText(
          `${width}px`,
          (start.x + end.x) / 2,
          (start.y + end.y) / 2
        );
      } else {
        ctx.fillText(`${width}px`, (start.x + end.x) / 2, start.y - 5);
        ctx.fillText(`${height}px`, end.x + 5, (start.y + end.y) / 2);
      }
    }
  };

  const redraw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    shapes.forEach((shape, index) => drawShape(ctx, shape, index));
    if (currentShape) drawShape(ctx, currentShape, -1);
  };

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={600}
      className="border m-4 bg-white"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
