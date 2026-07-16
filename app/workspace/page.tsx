"use client";

import { useState, useEffect, Suspense } from "react";
import TopBar from "@/app/webpage/components/workspace/TopBar";
import LeftShelf from "@/app/webpage/components/workspace/LeftShelf";
import Canvas from "@/app/webpage/components/workspace/Canvas";
import RenderPanel from "@/app/webpage/components/workspace/RenderPanel";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

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

  // Core Vector States
  const [segments, setSegments] = useState<any[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);

  // Load custom project details if selected from local storage
  useEffect(() => {
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
            if (project.segments && project.segments.length > 0) {
              setSegments(project.segments);
            } else {
              // Fetch default segments for this template type
              const supabase = createClient();
              supabase.auth.getSession().then(({ data: { session } }) => {
                const headers: Record<string, string> = { "Content-Type": "application/json" };
                if (session?.access_token) {
                  headers["Authorization"] = `Bearer ${session.access_token}`;
                }

                fetch("/api/process-sketch", {
                  method: "POST",
                  headers,
                  body: JSON.stringify({ template: project.template || "Gown" })
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.success && data.segments) {
                      setSegments(data.segments);
                      // Update project in localStorage
                      project.segments = data.segments;
                      localStorage.setItem("designature_projects", JSON.stringify(parsed));
                    }
                  })
                  .catch(err => console.error("Error loading default segments:", err));
              });
            }
          }
        } catch (e) {
          console.error("Failed to parse projects from local storage:", e);
        }
      }
    }
  }, [projectId]);

  const handleSynthesizeFabricRender = async () => {
    setRenderStatus("generating");
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/render-fabrics", {
        method: "POST",
        headers,
        body: JSON.stringify({
          projectId,
          segments,
          background: activeBackground
        })
      });
      if (!response.ok) {
        throw new Error("Render pipeline error");
      }
      const data = await response.json();
      if (data.success) {
        setRenderedImageUrl(data.renderedImageUrl);
        setRenderStatus("complete");
      } else {
        throw new Error(data.error || "Synthesis failed");
      }
    } catch (e) {
      console.error("AI Render failed:", e);
      setRenderStatus("idle");
    }
  };

  // Sync segment changes to localStorage
  const handleUpdateSegments = (updatedSegments: any[]) => {
    setSegments(updatedSegments);
    if (typeof window !== "undefined" && projectId) {
      const stored = localStorage.getItem("designature_projects");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const index = parsed.findIndex((p: any) => p.id === projectId);
          if (index !== -1) {
            parsed[index].segments = updatedSegments;
            localStorage.setItem("designature_projects", JSON.stringify(parsed));
          }
        } catch (e) {
          console.error("Failed sync segments to storage:", e);
        }
      }
    }
  };

  return (
    <div className="h-screen w-full bg-[#FBF9F6] text-[#2A1B3D] flex flex-col overflow-hidden font-sans">
      {/* Top Bar */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Shelf - Tools & Assets */}
        <LeftShelf
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          activeFabric={activeFabric}
          setActiveFabric={setActiveFabric}
          segments={segments}
          setSegments={handleUpdateSegments}
          selectedSegmentId={selectedSegmentId}
          setSelectedSegmentId={setSelectedSegmentId}
        />

        {/* Center Canvas */}
        <Canvas
          activeTemplate={activeTemplate}
          activeFabric={activeFabric}
          renderStatus={renderStatus}
          sketchUrl={sketchUrl}
          segments={segments}
          setSegments={handleUpdateSegments}
          selectedSegmentId={selectedSegmentId}
          setSelectedSegmentId={setSelectedSegmentId}
        />

        {/* Right Render Pipeline Panel */}
        <RenderPanel
          renderStatus={renderStatus}
          setRenderStatus={setRenderStatus}
          activeBackground={activeBackground}
          setActiveBackground={setActiveBackground}
          onRender={handleSynthesizeFabricRender}
          renderedImageUrl={renderedImageUrl}
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

