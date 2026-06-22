"use client";

import { useState } from "react";
import TopBar from "@/components/workspace/TopBar";
import LeftShelf from "@/components/workspace/LeftShelf";
import Canvas from "@/components/workspace/Canvas";
import RenderPanel from "@/components/workspace/RenderPanel";
import { AnimatePresence, motion } from "framer-motion";

export type RenderStatus = "idle" | "generating" | "complete";

export default function WorkspacePage() {
  const [activeTemplate, setActiveTemplate] = useState("Gown");
  const [activeFabric, setActiveFabric] = useState<string | null>(null);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [activeBackground, setActiveBackground] = useState("Studio");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
