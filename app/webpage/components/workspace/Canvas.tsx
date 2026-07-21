"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MousePointer2, 
  RefreshCcw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles,
  Paintbrush,
  Undo2,
  Redo2,
  Download,
  Scissors
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RenderStatus } from "@/app/workspace/page";

interface CustomFabric {
  name: string;
  dataUrl: string;
}

interface CanvasProps {
  activeTemplate: string;
  activeFabric: string | null;
  renderStatus: RenderStatus;
  sketchUrl?: string | null;
  segments: any[];
  setSegments: (segs: any[]) => void;
  selectedSegmentId: string | null;
  setSelectedSegmentId: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  customFabrics?: CustomFabric[];
}

export function rebuildPath(id: string, points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return "";
  
  if (id === "seg_collar" || id === "seg_sleeve_l" || id === "seg_sleeve_r") {
    if (points.length >= 8) {
      return `M ${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}, ${points[3].x} ${points[3].y} L ${points[4].x} ${points[4].y} C ${points[5].x} ${points[5].y}, ${points[6].x} ${points[6].y}, ${points[7].x} ${points[7].y} Z`;
    }
  } else if (id === "seg_bodice" || id === "seg_waistband" || id === "seg_wrap_top" || id === "seg_trousers_l" || id === "seg_trousers_r" || id === "seg_top" || id === "seg_peplum" || id === "seg_column_body") {
    if (points.length >= 4) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`;
    }
  } else if (id === "seg_skirt" || id === "seg_skirt_body") {
    if (points.length >= 8) {
      return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} C ${points[2].x} ${points[2].y}, ${points[3].x} ${points[3].y}, ${points[3].x} ${points[3].y} C ${points[4].x} ${points[4].y}, ${points[5].x} ${points[5].y}, ${points[5].x} ${points[5].y} C ${points[6].x} ${points[6].y}, ${points[7].x} ${points[7].y}, ${points[7].x} ${points[7].y} Z`;
    }
  }

  let pathStr = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    pathStr += ` L ${points[i].x} ${points[i].y}`;
  }
  return pathStr + " Z";
}

export default function Canvas({
  activeTemplate,
  activeFabric,
  renderStatus,
  sketchUrl,
  segments = [],
  setSegments,
  selectedSegmentId,
  setSelectedSegmentId,
  undo,
  redo,
  canUndo,
  canRedo,
  customFabrics = []
}: CanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState<"Pointer" | "Brush" | "Node Edit">("Pointer");
  const [draggedNode, setDraggedNode] = useState<{ segmentId: string; pointIndex: number } | null>(null);

  // Brush paint drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<{ x: number; y: number }[]>([]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const handleNodeMouseDown = (e: React.MouseEvent, segmentId: string, pointIndex: number) => {
    if (tool !== "Node Edit") return;
    e.stopPropagation();
    e.preventDefault();
    setDraggedNode({ segmentId, pointIndex });
  };

  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (tool !== "Brush") return;
    setIsDrawing(true);
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 500 / rect.height;
    const x = Math.round((e.clientX - rect.left) * scaleX);
    const y = Math.round((e.clientY - rect.top) * scaleY);
    setCurrentLine([{ x, y }]);
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (draggedNode && tool === "Node Edit") {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const scaleX = 400 / rect.width;
      const scaleY = 500 / rect.height;
      const x = Math.round((e.clientX - rect.left) * scaleX);
      const y = Math.round((e.clientY - rect.top) * scaleY);

      const constrainedX = Math.max(10, Math.min(390, x));
      const constrainedY = Math.max(10, Math.min(490, y));

      const updated = segments.map((seg) => {
        if (seg.id === draggedNode.segmentId) {
          const newPoints = [...seg.points];
          newPoints[draggedNode.pointIndex] = {
            ...newPoints[draggedNode.pointIndex],
            x: constrainedX,
            y: constrainedY
          };
          const newPath = rebuildPath(seg.id, newPoints);
          return {
            ...seg,
            points: newPoints,
            svg_path: newPath
          };
        }
        return seg;
      });
      setSegments(updated);
      return;
    }

    if (isDrawing && tool === "Brush") {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const scaleX = 400 / rect.width;
      const scaleY = 500 / rect.height;
      const x = Math.round((e.clientX - rect.left) * scaleX);
      const y = Math.round((e.clientY - rect.top) * scaleY);
      setCurrentLine(prev => [...prev, { x, y }]);
    }
  };

  const handleSvgMouseUp = () => {
    if (isDrawing && tool === "Brush" && currentLine.length > 1) {
      let drawLayer = segments.find(s => s.id === "freehand_drawings");
      let updatedSegments = [];

      if (!drawLayer) {
        drawLayer = {
          id: "freehand_drawings",
          label: "Freehand Annotations",
          strokeLines: [],
          z_index: 20,
          points: [],
          svg_path: "",
          defaultFill: "none"
        };
        updatedSegments = [...segments, drawLayer];
      } else {
        updatedSegments = [...segments];
      }

      const updatedLines = [
        ...(drawLayer.strokeLines || []),
        { points: currentLine, color: "#8b5cf6", width: 2.5 }
      ];

      const newDrawLayer = {
        ...drawLayer,
        strokeLines: updatedLines
      };

      setSegments(updatedSegments.map(s => s.id === "freehand_drawings" ? newDrawLayer : s));
    }

    setDraggedNode(null);
    setIsDrawing(false);
    setCurrentLine([]);
  };

  const handleClearFills = () => {
    const cleared = segments
      .map(seg => {
        if (seg.id === "freehand_drawings") {
          return {
            ...seg,
            strokeLines: []
          };
        }
        return {
          ...seg,
          fill: undefined,
          fabric: undefined
        };
      });
    setSegments(cleared);
    setSelectedSegmentId(null);
  };

  const handleExportSVG = () => {
    // Compile dynamic patterns
    const dynamicPatternsMarkup = customFabrics.map((fab) => `
      <pattern id="pat_${fab.name.toLowerCase()}" width="80" height="80" patternUnits="userSpaceOnUse">
        <image href="${fab.dataUrl}" x="0" y="0" width="80" height="80" opacity="0.9" />
      </pattern>
    `).join("\n");

    const patternMarkup = `
      <defs>
        <pattern id="pat_silk" width="80" height="80" patternUnits="userSpaceOnUse">
          <image href="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=100&auto=format&fit=crop" x="0" y="0" width="80" height="80" opacity="0.9" />
        </pattern>
        <pattern id="pat_lace" width="50" height="50" patternUnits="userSpaceOnUse">
          <image href="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=100&auto=format&fit=crop" x="0" y="0" width="100" height="100" opacity="0.6" />
        </pattern>
        ${dynamicPatternsMarkup}
      </defs>
    `;

    const pathsMarkup = segments.map((seg) => {
      if (seg.id === "freehand_drawings") {
        if (!seg.strokeLines) return "";
        return seg.strokeLines.map((line: any) => (
          `<polyline points="${line.points.map((p: any) => `${p.x},${p.y}`).join(" ")}" stroke="${line.color}" stroke-width="${line.width}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`
        )).join("\n");
      }

      let fillVal = seg.fill || seg.defaultFill;
      if (seg.fabric) {
        fillVal = `url(#pat_${seg.fabric.toLowerCase()})`;
      }
      const pathD = rebuildPath(seg.id, seg.points);
      return `<path d="${pathD}" fill="${fillVal}" stroke="#1c1917" stroke-width="1.2" />`;
    }).join("\n");

    const fullSVGString = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="800" height="1000">
  ${patternMarkup}
  <rect width="400" height="500" fill="#FFFBF7" />
  ${pathsMarkup}
</svg>
    `;

    const blob = new Blob([fullSVGString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `couture-design-${activeTemplate}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const floatingTools = [
    { name: "Pointer", icon: MousePointer2, action: () => setTool("Pointer") },
    { name: "Brush", icon: Paintbrush, action: () => setTool("Brush") },
    { name: "Node Edit", icon: Scissors, action: () => setTool("Node Edit") },
    { name: "Undo", icon: Undo2, action: undo, disabled: !canUndo },
    { name: "Redo", icon: Redo2, action: redo, disabled: !canRedo },
    { name: "Export SVG", icon: Download, action: handleExportSVG },
    { name: "Clear Canvas", icon: RefreshCcw, action: handleClearFills },
  ];

  return (
    <main 
      className="flex-1 overflow-hidden bg-cream relative group"
      onMouseUp={handleSvgMouseUp}
      onMouseLeave={handleSvgMouseUp}
    >
      {/* Canvas Viewport */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
        <motion.div
           style={{ scale: zoom }}
           className="w-full h-full relative group/viewport flex items-center justify-center"
        >
          {/* Base Sketch Layer with scaling grid */}
          <div className="absolute inset-0 bg-cream">
            <div 
              className="absolute inset-0 opacity-80 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, rgba(42, 27, 61, 0.06) 1.2px, transparent 1.2px)`,
                backgroundSize: '24px 24px'
              }}
            />
            <div className="w-full h-full flex items-center justify-center opacity-[0.03]">
              <span className="text-[100px] font-black tracking-tighter text-velvet select-none uppercase rotate-12">
                {activeTemplate}
              </span>
            </div>
          </div>

          {/* User Drawing Backing */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.18]">
            {sketchUrl ? (
              <img src={sketchUrl} alt="Backing Outline" className="w-[88%] h-[88%] object-contain mix-blend-multiply" />
            ) : (
              <img 
                src="/presets/fashion_silhouette_presets_1782147065744.png" 
                alt="Active Silhouette"
                className="w-[88%] h-[88%] object-contain mix-blend-multiply"
              />
            )}
          </div>

          {/* Interactive SVG Canvas Layer */}
          <div className="relative w-[88%] h-[88%] flex items-center justify-center">
            <svg 
              viewBox="0 0 400 500" 
              className="w-full h-full object-contain"
              onMouseDown={handleSvgMouseDown}
              onMouseMove={handleSvgMouseMove}
            >
              <defs>
                {/* Patterns used to map fabrics overlay coordinates */}
                <pattern id="pat_silk" width="80" height="80" patternUnits="userSpaceOnUse">
                  <image href="/presets/fabric_texture_samples_1782147104328.png" x="0" y="0" width="80" height="80" opacity="0.9" />
                </pattern>
                <pattern id="pat_lace" width="50" height="50" patternUnits="userSpaceOnUse">
                  <image href="/presets/fabric_texture_samples_1782147104328.png" x="0" y="0" width="100" height="100" opacity="0.6" style={{ filter: "hue-rotate(90deg)" }} />
                </pattern>
                <pattern id="pat_ankara" width="120" height="120" patternUnits="userSpaceOnUse">
                  <image href="/presets/fabric_texture_samples_1782147104328.png" x="0" y="0" width="120" height="120" style={{ filter: "hue-rotate(240deg) saturate(1.8)" }} />
                </pattern>
                <pattern id="pat_velvet" width="100" height="100" patternUnits="userSpaceOnUse">
                  <image href="/presets/fabric_texture_samples_1782147104328.png" x="-10" y="-10" width="120" height="120" opacity="0.8" style={{ filter: "brightness(0.4) saturate(0.6)" }} />
                </pattern>
                <pattern id="pat_satin" width="60" height="60" patternUnits="userSpaceOnUse">
                  <image href="/presets/fabric_texture_samples_1782147104328.png" x="0" y="0" width="60" height="60" opacity="0.95" style={{ filter: "hue-rotate(45deg) brightness(1.2)" }} />
                </pattern>
                <pattern id="pat_cotton" width="40" height="40" patternUnits="userSpaceOnUse">
                  <image href="/presets/fabric_texture_samples_1782147104328.png" x="0" y="0" width="40" height="40" opacity="0.45" />
                </pattern>

                {/* Inject custom dynamic patterns */}
                {customFabrics.map((fab) => (
                  <pattern key={fab.name} id={`pat_${fab.name.toLowerCase()}`} width="80" height="80" patternUnits="userSpaceOnUse">
                    <image href={fab.dataUrl} x="0" y="0" width="80" height="80" opacity="0.9" />
                  </pattern>
                ))}
              </defs>

              {/* Vector Layers */}
              {segments.map((seg) => {
                if (seg.id === "freehand_drawings") return null;

                const isSelected = selectedSegmentId === seg.id;
                const pathD = rebuildPath(seg.id, seg.points);

                // Set fill color based on custom color/fabric mapping
                let fillVal = seg.fill || seg.defaultFill;
                if (seg.fabric) {
                  fillVal = `url(#pat_${seg.fabric.toLowerCase()})`;
                }

                return (
                  <path
                    key={seg.id}
                    d={pathD}
                    fill={fillVal}
                    stroke={isSelected ? "#8b5cf6" : "rgba(42, 27, 61, 0.25)"}
                    strokeWidth={isSelected ? 2 : 1.2}
                    className="transition-all cursor-pointer hover:opacity-95"
                    style={{
                      transition: "fill 0.2s ease-in-out, stroke 0.15s ease-in-out",
                    }}
                    onClick={(e) => {
                      if (tool === "Brush") return;
                      e.stopPropagation();
                      setSelectedSegmentId(seg.id === selectedSegmentId ? null : seg.id);
                    }}
                  />
                );
              })}

              {/* Render annotation lines */}
              {segments.map(seg => {
                if (seg.id === "freehand_drawings" && seg.strokeLines) {
                  return seg.strokeLines.map((line: any, idx: number) => (
                    <polyline
                      key={`stroke-${idx}`}
                      points={line.points.map((pt: any) => `${pt.x},${pt.y}`).join(" ")}
                      stroke={line.color}
                      strokeWidth={line.width}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ));
                }
                return null;
              })}

              {/* Render dynamic line currently drawing */}
              {isDrawing && currentLine.length > 1 && (
                <polyline
                  points={currentLine.map(pt => `${pt.x},${pt.y}`).join(" ")}
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Overlapping anchor drag nodes - only visible in Node Edit tool Mode */}
              {tool === "Node Edit" && selectedSegmentId && segments.map((seg) => {
                if (seg.id !== selectedSegmentId) return null;

                return seg.points.map((pt: any, index: number) => {
                  return (
                    <circle
                      key={`${seg.id}-node-${index}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.isControl ? 4 : 5.5}
                      fill={pt.isControl ? "white" : "#8b5cf6"}
                      stroke={pt.isControl ? "#8b5cf6" : "white"}
                      strokeWidth={1.5}
                      className="cursor-move hover:scale-130 active:scale-150 transition-all select-none"
                      onMouseDown={(e) => handleNodeMouseDown(e, seg.id, index)}
                    />
                  );
                });
              })}
            </svg>
          </div>

          {/* Generative AI Loading Overlay */}
          <AnimatePresence>
            {renderStatus === "generating" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-velvet/85 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-50 text-center px-12"
              >
                <div className="relative">
                   <div className="w-20 h-20 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
                   <Sparkles className="absolute inset-0 margin-auto w-6 h-6 text-violet-400 animate-pulse m-auto" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-cream tracking-widest uppercase font-sans">Synthesizing Fabric</h3>
                   <p className="text-zinc-300 text-xs font-sans">AI is mapping texture boundaries and drape folds shadows...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Canvas UI */}
      <div className="absolute top-8 right-8 flex flex-col gap-2 z-40">
        <button onClick={handleZoomIn} className="p-3 rounded-xl bg-white/90 border border-velvet/10 text-zinc-500 hover:text-velvet transition-all hover:bg-cream cursor-pointer shadow-md">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-3 rounded-xl bg-white/90 border border-velvet/10 text-zinc-500 hover:text-velvet transition-all hover:bg-cream cursor-pointer shadow-md">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main Floating Tool Strip */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-white/90 backdrop-blur-md border border-velvet/15 shadow-xl">
          {floatingTools.map((t) => {
            const isToolActive = tool === t.name;
            const isDisabled = t.disabled;
            return (
              <button
                key={t.name}
                onClick={t.action}
                disabled={isDisabled}
                className={cn(
                  "p-3 rounded-full transition-all relative group cursor-pointer disabled:opacity-30 disabled:pointer-events-none",
                  isToolActive ? "bg-velvet text-cream font-bold" : "text-zinc-450 hover:text-velvet"
                )}
              >
                <t.icon className="w-5 h-5 relative z-10" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2.5 py-1.5 rounded bg-velvet text-[8px] font-bold text-cream uppercase tracking-widest transition-all duration-200 pointer-events-none whitespace-nowrap invisible opacity-0 group-hover:visible group-hover:opacity-100 shadow-lg">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </main>
  );
}
