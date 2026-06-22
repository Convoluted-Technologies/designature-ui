"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { MousePointer2, Move, Layers, RefreshCcw, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { RenderStatus } from "@/app/workspace/page";

interface CanvasProps {
  activeTemplate: string;
  activeFabric: string | null;
  renderStatus: RenderStatus;
}

export default function Canvas({ activeTemplate, activeFabric, renderStatus }: CanvasProps) {
  const [zoom, setZoom] = useState(1);
  const [tool, setTool] = useState("Pointer");
  const canvasRef = useRef<HTMLDivElement>(null);

  // Zoom logic
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.5));

  const floatingTools = [
    { name: "Pointer", icon: MousePointer2 },
    { name: "Layer Fabric", icon: Layers },
    { name: "Clear", icon: RefreshCcw },
    { name: "Regenerate", icon: Move },
  ];

  return (
    <main className="flex-1 overflow-hidden bg-[#121214] relative group cursor-crosshair">
      {/* Workspace Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Canvas Viewport */}
      <div className="absolute inset-0 flex items-center justify-center p-20 overflow-auto no-scrollbar">
        <motion.div
           style={{ scale: zoom }}
           className="relative aspect-3/4 h-full max-h-[800px] bg-neutral-900/40 rounded-4xl border border-white/5 shadow-2xl overflow-hidden group/viewport flex items-center justify-center"
        >
          {/* Base Sketch Layer */}
          <div className="absolute inset-0 bg-[#0F0F11]">
            <div className="w-full h-full flex items-center justify-center opacity-20">
              <span className="text-[120px] font-black tracking-tighter text-white/5 select-none uppercase rotate-12">
                {activeTemplate}
              </span>
            </div>
          </div>

          {/* Silhouette Frame */}
          <div className="relative w-[80%] h-[80%] border border-violet-500/20 rounded-3xl flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full p-12 flex items-center justify-center">
                  {/* Placeholder for the Generated Silhouette */}
                  <img 
                    src="/brain/0f6309c4-727f-494e-aec5-40af47674ce5/fashion_silhouette_presets_1782147065744.png" 
                    alt="Active Silhouette"
                    className="w-full h-full object-contain opacity-80 mix-blend-screen"
                  />
                </div>
             </div>

             {/* Fabric Texture Layer */}
             <AnimatePresence>
               {activeFabric && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 0.6 }}
                   exit={{ opacity: 0 }}
                   className="absolute inset-0 pointer-events-none"
                   style={{
                     backgroundImage: `url('/brain/0f6309c4-727f-494e-aec5-40af47674ce5/fabric_texture_samples_1782147104328.png')`,
                     backgroundSize: '200px',
                     mixBlendMode: 'overlay'
                   }}
                 />
               )}
             </AnimatePresence>
          </div>

          {/* Generative AI Loading Overlay */}
          <AnimatePresence>
            {renderStatus === "generating" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-50 text-center px-12"
              >
                <div className="relative">
                   <div className="w-20 h-20 rounded-full border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
                   <Sparkles className="absolute inset-0 margin-auto w-6 h-6 text-violet-400 animate-pulse m-auto" />
                </div>
                <div className="space-y-2">
                   <h3 className="text-xl font-bold text-white tracking-widest uppercase">Synthesizing Fabric</h3>
                   <p className="text-zinc-400 text-xs">AI is mapping {activeFabric || "texture"} to {activeTemplate} silhouettes...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating Canvas UI */}
      <div className="absolute top-8 right-8 flex flex-col gap-2 z-40">
        <button onClick={handleZoomIn} className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-zinc-400 hover:text-white transition-all hover:bg-neutral-800">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-3 rounded-xl bg-neutral-900 border border-white/10 text-zinc-400 hover:text-white transition-all hover:bg-neutral-800">
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Main Floating Tool Strip */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40">
        <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/10 shadow-2xl">
          {floatingTools.map((t) => (
            <button
              key={t.name}
              onClick={() => setTool(t.name)}
              className={cn(
                "p-3 rounded-full transition-all relative group",
                tool === t.name ? "bg-violet-600 text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <t.icon className="w-5 h-5 relative z-10" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 rounded bg-black text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
