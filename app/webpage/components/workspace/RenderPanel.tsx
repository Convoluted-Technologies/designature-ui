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
}

export default function RenderPanel({ renderStatus, setRenderStatus, activeBackground, setActiveBackground }: RenderPanelProps) {
  const backgrounds = [
    { name: "Studio", color: "bg-zinc-800" },
    { name: "Runway", color: "bg-zinc-700" },
    { name: "Garden", color: "bg-emerald-900/20" },
    { name: "Luxury", color: "bg-violet-900/20" },
  ];

  const handleSynthesize = () => {
    setRenderStatus("generating");
    setTimeout(() => {
      setRenderStatus("complete");
    }, 3000);
  };

  return (
    <aside className="w-80 h-full border-l border-white/5 bg-neutral-900/40 backdrop-blur-xl flex flex-col z-30">
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Synthesis Trigger */}
        <div className="mb-8 p-6 rounded-3xl bg-linear-to-br from-violet-600/20 to-zinc-900/40 border border-violet-500/30 shadow-2xl shadow-violet-900/10">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Zap className="w-5 h-5 text-white" />
             </div>
             <div>
                <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">AI Synthesis</h3>
                <span className="text-[10px] text-zinc-500">Virtual Try-On Engine</span>
             </div>
          </div>
          <button
            onClick={handleSynthesize}
            disabled={renderStatus === "generating"}
            className="w-full h-12 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 transition-all shadow-xl disabled:opacity-50 group flex items-center justify-center gap-2"
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
             <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Output Studio</span>
             <Maximize2 className="w-4 h-4 text-zinc-600 cursor-pointer hover:text-zinc-400" />
          </div>
          
          <div className="flex-1 rounded-2xl border border-white/5 bg-black/40 overflow-hidden relative group">
            <AnimatePresence mode="wait">
              {renderStatus === "idle" || renderStatus === "generating" ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center p-8 text-center gap-4"
                >
                  <div className="w-full h-40 bg-zinc-800/40 rounded-xl animate-pulse flex items-center justify-center">
                     <Layout className="w-8 h-8 text-zinc-700" />
                  </div>
                  <p className="text-[10px] text-zinc-600 font-medium leading-relaxed italic">
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
                  <div className="absolute top-2 right-2 z-10 p-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-violet-400">
                     HD READY
                  </div>
                  <img 
                    src="/brain/0f6309c4-727f-494e-aec5-40af47674ce5/workspace_background_contexts_1782147146726.png" 
                    alt="AI Render Output" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Context Backdrop Selector */}
        <div className="mt-8">
           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 block">Render Context</span>
           <div className="flex justify-between items-center bg-black/20 p-2 rounded-2xl border border-white/5">
              {backgrounds.map((bg) => (
                <button
                  key={bg.name}
                  onClick={() => setActiveBackground(bg.name)}
                  className={cn(
                    "w-12 h-12 rounded-xl transition-all relative group",
                    bg.color,
                    activeBackground === bg.name ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-neutral-900" : ""
                  )}
                >
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-1.5 py-0.5 rounded bg-black text-[7px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {bg.name}
                  </span>
                </button>
              ))}
           </div>
        </div>

        {/* HD Artifact Export */}
        <div className="mt-8 space-y-3 pb-6">
          <div className="flex gap-2">
            <select className="flex-1 h-12 rounded-2xl bg-black/40 border border-white/10 text-xs font-bold text-zinc-400 px-4 focus:border-violet-500 outline-none appearance-none cursor-pointer">
               <option>PNG (Transparent)</option>
               <option>JPEG (Studio)</option>
               <option>PDF (Pattern Mesh)</option>
            </select>
          </div>
          <button className="w-full h-12 rounded-2xl bg-violet-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-violet-500 transition-all flex items-center justify-center gap-3">
            <Download className="w-4 h-4" />
            Export HD Artifact
          </button>
        </div>
      </div>
    </aside>
  );
}
