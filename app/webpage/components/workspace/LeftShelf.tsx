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

interface CustomFabric {
  name: string;
  dataUrl: string;
}

interface ShelfProps {
  activeTemplate: string;
  setActiveTemplate: (t: string) => void;
  activeFabric: string | null;
  setActiveFabric: (f: string | null) => void;
  segments: any[];
  setSegments: (segs: any[]) => void;
  selectedSegmentId: string | null;
  setSelectedSegmentId: (id: string | null) => void;
  customFabrics?: CustomFabric[];
  setCustomFabrics?: (fabs: CustomFabric[]) => void;
}

export default function LeftShelf({ 
  activeTemplate, 
  setActiveTemplate, 
  activeFabric, 
  setActiveFabric,
  segments = [],
  setSegments,
  selectedSegmentId,
  setSelectedSegmentId,
  customFabrics = [],
  setCustomFabrics = () => {}
}: ShelfProps) {
  const [openTab, setOpenTab] = useState<string | null>("design");

  const handleSelectFabric = (fabricName: string) => {
    if (selectedSegmentId) {
      // Apply fabric specifically to selected segment
      const updated = segments.map(seg => {
        if (seg.id === selectedSegmentId) {
          const isToggled = seg.fabric === fabricName;
          return {
            ...seg,
            fabric: isToggled ? undefined : fabricName
          };
        }
        return seg;
      });
      setSegments(updated);
    } else {
      // Global fallback
      setActiveFabric(selectedSegmentId === null && activeFabric === fabricName ? null : fabricName);
    }
  };

  const handleSelectColor = (colorHex: string) => {
    if (selectedSegmentId) {
      const updated = segments.map(seg => {
        if (seg.id === selectedSegmentId) {
          return {
            ...seg,
            fill: colorHex
          };
        }
        return seg;
      });
      setSegments(updated);
    }
  };

  const selectedSegment = segments.find(s => s.id === selectedSegmentId);

  const sections = [
    {
      id: "design",
      title: "Design Layers",
      icon: Layers,
      content: (
        <div className="space-y-4">

          {/* Render Active Segments Outlines as Layers */}
          {segments.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-widest block font-sans">Vector Layers</span>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 select-none">
                {segments.map((seg) => {
                  const isLayerSelected = selectedSegmentId === seg.id;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => setSelectedSegmentId(isLayerSelected ? null : seg.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider cursor-pointer flex items-center justify-between transition-all font-sans",
                        isLayerSelected 
                          ? "bg-violet-650/10 border-violet-500 text-violet-750" 
                          : "bg-velvet/5 border-velvet/10 text-zinc-650 hover:bg-velvet/10 hover:text-velvet"
                      )}
                    >
                      <span className="truncate max-w-[120px]">{seg.label}</span>
                      <div className="flex items-center gap-2">
                        {seg.fabric && (
                          <span className="text-[8px] bg-violet-650/20 text-violet-750 px-1 py-0.5 rounded tracking-wide font-medium">
                            {seg.fabric}
                          </span>
                        )}
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-velvet/10 shadow-inner" 
                          style={{ backgroundColor: seg.id === "freehand_drawings" ? "transparent" : (seg.fill || seg.defaultFill) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 p-6 rounded-2xl border-2 border-dashed border-velvet/10 bg-velvet/2 flex flex-col items-center justify-center gap-2 group hover:border-violet-500/30 transition-colors cursor-pointer">
            <ImageIcon className="w-6 h-6 text-zinc-400 group-hover:text-violet-600 transition-colors" />
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider group-hover:text-velvet transition-colors font-sans">Image to Sketch</span>
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
          <div className="p-4 rounded-xl bg-velvet/5 border border-velvet/10 flex flex-col gap-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-sans">Active Mannequin</span>
            <div className="h-40 rounded-lg bg-zinc-200 animate-pulse overflow-hidden relative border border-velvet/5">
               <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
            </div>
            <button className="w-full py-2 rounded-lg bg-velvet/5 border border-velvet/10 text-[10px] font-bold uppercase hover:bg-velvet/10 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans text-velvet">
              <Plus className="w-3 h-3" /> Create New Twin
            </button>
          </div>
        </div>
      )
    },
    {
      id: "fabric",
      title: "Fabric & Color Styling",
      icon: Grid2X2,
      content: (
        <div className="space-y-4">
          {/* Layer Selector Context Indicator */}
          <div className="p-3 bg-velvet/5 rounded-xl border border-velvet/10 text-center">
            {selectedSegment ? (
              <div className="flex flex-col gap-1 font-sans">
                <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">Styling Element</span>
                <span className="text-xs font-black text-violet-750 uppercase tracking-widest">{selectedSegment.label}</span>
              </div>
            ) : (
              <span className="text-[10px] text-zinc-550 font-medium italic block font-sans">Select a vector layer on canvas to style it</span>
            )}
          </div>

          {/* Color Palletes (Click to Fill Selected Layer) */}
          {selectedSegment && selectedSegment.id !== "freehand_drawings" && (
            <div className="space-y-2 pt-2">
              <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-sans">Palette Injector</span>
              <div className="flex flex-wrap gap-1.5">
                {["#fafaf9", "#ef4444", "#3b82f6", "#10b981", "#fbbf24", "#8b5cf6", "#f43f5e", "#2a1b3d"].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleSelectColor(c)}
                    className={cn(
                      "w-6 h-6 rounded-full border border-velvet/10 cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-md",
                      selectedSegment.fill === c ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-neutral-900" : ""
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fabric Library */}
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-sans">Fabric Library</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  ...["Silk", "Lace", "Ankara", "Velvet", "Satin", "Cotton"],
                  ...customFabrics.map((f) => f.name)
                ].map((f) => {
                  const isActive = selectedSegment 
                    ? selectedSegment.fabric === f 
                    : activeFabric === f;

                  const customFabRef = customFabrics.find(cf => cf.name === f);
                  const previewUrl = customFabRef ? customFabRef.dataUrl : "/presets/fabric_texture_samples_1782147104328.png";

                  return (
                    <button
                      key={f}
                      onClick={() => handleSelectFabric(f)}
                      className={cn(
                        "aspect-square rounded-lg border transition-all relative overflow-hidden group cursor-pointer",
                        isActive ? "border-violet-600 ring-2 ring-violet-600" : "border-velvet/10 bg-velvet/5"
                      )}
                    >
                      <img src={previewUrl} alt={f} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      <span className="absolute bottom-1 left-1 right-1 text-[8px] font-extrabold bg-velvet/90 px-1 rounded uppercase tracking-wider text-center text-cream truncate">
                        {f}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Pattern Upload Slot */}
            {selectedSegment && selectedSegment.id !== "freehand_drawings" && (
              <div className="pt-2 border-t border-velvet/5">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-sans mb-2">Upload Attire Fabric</span>
                <label className="flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-velvet/15 bg-velvet/2 cursor-pointer hover:bg-velvet/5 hover:border-violet-500/20 transition-all text-center">
                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-sans">Import Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const rawName = file.name.split(".")[0];
                          const cleanName = rawName.substring(0, 10).replace(/[^a-zA-Z0-9]/g, "");
                          const newFabric = {
                            name: cleanName || "Custom",
                            dataUrl: reader.result as string
                          };
                          setCustomFabrics([...customFabrics, newFabric]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            )}
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
          <p className="text-[10px] text-zinc-500 leading-relaxed italic font-sans">
            Automated generation of 2D flat geometric tailors' patterns based on selected silhouette.
          </p>
          <button className="w-full h-10 rounded-xl bg-violet-650 text-white text-xs font-bold shadow-lg shadow-violet-900/10 flex items-center justify-center gap-2 hover:bg-violet-600 transition-all cursor-pointer font-sans">
            Reveal 2D Pattern
          </button>
        </div>
      )
    }
  ];

  return (
    <aside className="w-80 h-full border-r border-velvet/10 bg-white/70 backdrop-blur-xl flex flex-col z-30">
      <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-velvet/5 last:border-0 pb-4">
              <button
                onClick={() => setOpenTab(openTab === section.id ? null : section.id)}
                className="w-full flex items-center justify-between py-2 group cursor-pointer"
              >
                <div className="flex items-center gap-3 animate-fade-in">
                  <div className={cn(
                    "p-2 rounded-lg transition-all",
                    openTab === section.id ? "bg-violet-650/10 text-violet-750" : "bg-velvet/5 text-zinc-550 group-hover:text-velvet"
                  )}>
                    <section.icon className="w-4 h-4" />
                  </div>
                  <span className={cn(
                    "text-[11px] font-bold uppercase tracking-widest font-sans",
                    openTab === section.id ? "text-velvet" : "text-zinc-650"
                  )}>
                    {section.title}
                  </span>
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-zinc-600 transition-transform duration-300",
                  openTab === section.id ? "rotate-180 text-violet-750" : ""
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
