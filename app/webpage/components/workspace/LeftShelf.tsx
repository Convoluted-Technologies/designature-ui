"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Layers, 
  UserCircle, 
  Grid2X2, 
  Scissors, 
  Image as ImageIcon,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ShelfProps {
  activeTemplate: string;
  setActiveTemplate: (t: string) => void;
  activeFabric: string | null;
  setActiveFabric: (f: string | null) => void;
}

export default function LeftShelf({ activeTemplate, setActiveTemplate, activeFabric, setActiveFabric }: ShelfProps) {
  const [openTab, setOpenTab] = useState<string | null>("design");

  const sections = [
    {
      id: "design",
      title: "Design Templates",
      icon: Layers,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["Gown", "Skirt", "Ankara", "Sari"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTemplate(t)}
                className={cn(
                  "p-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                  activeTemplate === t 
                    ? "bg-violet-600/20 border-violet-500 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]" 
                    : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/10"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-4 p-6 rounded-2xl border-2 border-dashed border-white/5 bg-white/2 flex flex-col items-center justify-center gap-2 group hover:border-violet-500/30 transition-colors cursor-pointer">
            <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-violet-400 transition-colors" />
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider group-hover:text-zinc-300">Image to Sketch</span>
          </div>
        </div>
      )
    },
    {
      id: "twin",
      title: "Digital Twin Gen",
      icon: UserCircle,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/20 border border-white/5 flex flex-col gap-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Mannequin</span>
            <div className="h-40 rounded-lg bg-zinc-800 animate-pulse overflow-hidden relative">
               <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>
            <button className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Plus className="w-3 h-3" /> Create New Twin
            </button>
          </div>
        </div>
      )
    },
    {
      id: "fabric",
      title: "Fabric Library",
      icon: Grid2X2,
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {["Silk", "Lace", "Ankara", "Velvet", "Satin", "Cotton"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFabric(f === activeFabric ? null : f)}
                className={cn(
                  "aspect-square rounded-lg border transition-all relative overflow-hidden group",
                  activeFabric === f ? "border-violet-500 ring-1 ring-violet-500" : "border-white/5"
                )}
              >
                <div className="w-full h-full bg-zinc-800 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-1 left-1 text-[8px] font-bold bg-black/60 px-1 rounded uppercase">{f}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "pattern",
      title: "Pattern Blueprint",
      icon: Scissors,
      content: (
        <div className="space-y-3">
          <p className="text-[10px] text-zinc-500 leading-relaxed italic">
            Automated generation of 2D flat geometric tailors' patterns based on selected silhouette.
          </p>
          <button className="w-full h-10 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-lg shadow-violet-900/20 flex items-center justify-center gap-2 hover:bg-violet-500 transition-all">
            Reveal 2D Pattern
          </button>
        </div>
      )
    }
  ];

  return (
    <aside className="w-80 h-full border-r border-white/5 bg-neutral-900/40 backdrop-blur-xl flex flex-col z-30">
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-white/5 last:border-0 pb-4">
              <button
                onClick={() => setOpenTab(openTab === section.id ? null : section.id)}
                className="w-full flex items-center justify-between py-2 group"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    openTab === section.id ? "bg-violet-600/10 text-violet-400" : "bg-white/5 text-zinc-500 group-hover:text-zinc-300"
                  )}>
                    <section.icon className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-widest",
                    openTab === section.id ? "text-zinc-100" : "text-zinc-500"
                  )}>
                    {section.title}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-zinc-600 transition-transform duration-300",
                  openTab === section.id ? "rotate-180 text-violet-400" : ""
                )} />
              </button>
              
              <AnimatePresence initial={false}>
                {openTab === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 px-2 pb-2">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
