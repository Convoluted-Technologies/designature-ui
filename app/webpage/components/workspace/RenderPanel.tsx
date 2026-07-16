"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Download, 
  Settings2, 
  Layout, 
  Maximize2,
  MoreVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RenderStatus } from "@/app/workspace/page";

interface RenderPanelProps {
  renderStatus: RenderStatus;
  setRenderStatus: (s: RenderStatus) => void;
  activeBackground: string;
  setActiveBackground: (b: string) => void;
  onRender: () => void;
  renderedImageUrl: string | null;
}

export default function RenderPanel({ 
  renderStatus, 
  setRenderStatus, 
  activeBackground, 
  setActiveBackground,
  onRender,
  renderedImageUrl
}: RenderPanelProps) {
  const backgrounds = [
    { name: "Studio", color: "bg-zinc-800" },
    { name: "Runway", color: "bg-zinc-700" },
    { name: "Garden", color: "bg-emerald-900/20" },
    { name: "Luxury", color: "bg-violet-900/20" },
  ];

  return (
    <aside className="w-80 h-full border-l border-velvet/10 bg-white/70 backdrop-blur-xl flex flex-col z-30">
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Synthesis Trigger */}
        <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-violet-655/5 to-velvet/5 border border-velvet/10 shadow-[0_12px_30px_rgba(42,27,61,0.04)]">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-2xl bg-velvet flex items-center justify-center shadow-lg shadow-velvet/20">
                <Zap className="w-5 h-5 text-white" />
             </div>
             <div>
                <h3 className="text-xs font-bold text-velvet uppercase tracking-widest font-sans">AI Synthesis</h3>
                <span className="text-[10px] text-zinc-450">Virtual Try-On Engine</span>
             </div>
          </div>
          <button
            onClick={onRender}
            disabled={renderStatus === "generating"}
            className="w-full h-12 rounded-2xl bg-velvet text-cream font-bold text-xs uppercase tracking-widest hover:bg-velvet/95 transition-all shadow-xl disabled:opacity-50 group flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            {renderStatus === "generating" ? "Processing..." : (
               <>
                 Initiate AI Render
                 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </>
            )}
          </button>
        </div>

        {/* AI Output Box */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4">
             <span className="text-[11px] font-bold text-zinc-550 uppercase tracking-widest font-sans">Output Studio</span>
             <Maximize2 className="w-4 h-4 text-zinc-650 cursor-pointer hover:text-velvet" />
          </div>
          
          <div className="flex-1 rounded-2xl border border-velvet/10 bg-white/50 overflow-hidden relative group">
            <AnimatePresence mode="wait">
              {renderStatus === "idle" || renderStatus === "generating" ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8 text-center gap-4"
                >
                  <div className="w-full h-40 bg-cream rounded-xl flex items-center justify-center border border-velvet/5">
                     <Layout className="w-8 h-8 text-zinc-350" />
                  </div>
                  <p className="text-[10px] text-zinc-550 font-medium leading-relaxed italic font-sans animate-fade-in">
                    Configure silhouettes and fabrics on the left to start the rendering pipeline.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative"
                >
                  <div className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-velvet/80 backdrop-blur-md border border-velvet/10 text-[8px] tracking-widest font-bold text-cream">
                     HD READY
                  </div>
                  <img 
                    src={renderedImageUrl || "/presets/workspace_background_contexts_1782147146726.png"} 
                    alt="AI Render Output" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-velvet/40 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Context Backdrop Selector */}
        <div className="mt-8">
           <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest mb-4 block font-sans">Render Context</span>
           <div className="flex justify-between items-center bg-velvet/5 p-2 rounded-2xl border border-velvet/10">
              {backgrounds.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => setActiveBackground(bg.name)}
                  className={cn(
                    "w-12 h-12 rounded-xl transition-all relative group cursor-pointer border border-velvet/5",
                    bg.color,
                    activeBackground === bg.name ? "ring-2 ring-violet-600 ring-offset-2 ring-offset-white" : ""
                  )}
                >
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2 py-1 rounded bg-velvet text-[7px] text-cream font-bold uppercase pointer-events-none whitespace-nowrap invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-205 shadow-md">
                    {bg.name}
                  </span>
                </button>
              ))}
           </div>
        </div>

        {/* HD Artifact Export */}
        <div className="mt-8 space-y-3 pb-6">
          <div className="flex gap-2">
            <select className="flex-1 h-12 rounded-2xl bg-white/60 border border-velvet/10 text-xs font-bold text-zinc-650 px-4 focus:border-violet-605 focus:ring-1 focus:ring-violet-605 outline-none appearance-none cursor-pointer font-sans shadow-xs">
               <option>PNG (Transparent)</option>
               <option>JPEG (Studio)</option>
               <option>PDF (Pattern Mesh)</option>
            </select>
          </div>
          <button className="w-full h-12 rounded-2xl bg-violet-650 text-white font-bold text-xs uppercase tracking-widest hover:bg-violet-600 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.12)] font-sans">
            <Download className="w-4 h-4" />
            Export HD Artifact
          </button>
        </div>
      </div>
    </aside>
  );
}
