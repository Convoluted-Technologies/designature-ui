"use client";

import { useState, Suspense } from "react";
import TopBar from "@/app/webpage/components/workspace/TopBar";
import LeftShelf from "@/app/webpage/components/workspace/LeftShelf";
import Canvas from "@/app/webpage/components/workspace/Canvas";
import RenderPanel from "@/app/webpage/components/workspace/RenderPanel";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

export type RenderStatus = "idle" | "generating" | "complete";

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const templateFromUrl = searchParams.get("template") || "Gown";
  const [activeTemplate, setActiveTemplate] = useState(templateFromUrl);
  const [sketchUrl, setSketchUrl] = useState<string | null>(null);
  const [activeFabric, setActiveFabric] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [activeBackground, setActiveBackground] = useState("Studio");

  // Load custom project details if selected from local storage
  useState(() => {
    if (typeof window !== "undefined" && projectId) {
      const stored = localStorage.getItem("designature_projects");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const project = parsed.find((p: any) => p.id === projectId);
          if (project) {
            if (project.sketchUrl) {
              setSketchUrl(project.sketchUrl);
            }
            if (project.template) {
              setActiveTemplate(project.template);
            }
          }
        } catch (e) {
          console.error("Failed to parse projects from local storage:", e);
        }
      }
    }
  });

  return (
    <div className="h-screen w-full bg-[#0F0F11] text-zinc-300 flex flex-col overflow-hidden font-inter">
      {/* Top Bar */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Shelf - Tools & Assets */}
        <LeftShelf
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          activeFabric={activeFabric}
          setActiveFabric={setActiveFabric}
        />

        {/* Center Canvas */}
        <Canvas
          activeTemplate={activeTemplate}
          activeFabric={activeFabric}
          renderStatus={renderStatus}
          sketchUrl={sketchUrl}
        />

        {/* Right Render Pipeline Panel */}
        <RenderPanel
          renderStatus={renderStatus}
          setRenderStatus={setRenderStatus}
          activeBackground={activeBackground}
          setActiveBackground={setActiveBackground}
        />
      </div>

      {/* Global Grain Texture */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay grain-texture" />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-[#0F0F11] flex items-center justify-center">
        <span className="text-sm font-bold tracking-widest text-zinc-500 animate-pulse uppercase">Loading Studio...</span>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}

