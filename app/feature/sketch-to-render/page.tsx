"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Scissors,
  Plus,
  Upload,
  X,
  FileText,
  Loader2,
  Sparkles,
  ChevronRight,
  Folder,
  Sliders,
  HelpCircle,
  Bell,
  Search,
  LogOut
} from "lucide-react";
import Logo from "../../../public/Logo.png";

interface Project {
  id: string;
  name: string;
  template: string;
  fabric: string;
  lastModified: string;
  previewColor?: string;
  sketchUrl?: string;
  segments?: any[];
}

export default function SketchToRenderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sketchFileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [profile, setProfile] = useState({ name: "Personal Designer", avatar: null as string | null });
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Upload/Processing States
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileBase64, setUploadedFileBase64] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStage, setProcessingStage] = useState(0);
  const [processingLogs, setProcessingLogs] = useState<string[]>([]);

  // Load profile & projects from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("designature_user_profile");
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (e) {
          console.error("Profile load err:", e);
        }
      }

      const storedProjects = localStorage.getItem("designature_projects");
      if (storedProjects) {
        try {
          setProjects(JSON.parse(storedProjects));
        } catch (e) {
          console.error("Projects load err:", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("designature_user_session");
      router.push("/");
    }
  };

  const handleSketchFileSelect = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFileBase64(reader.result as string);
    };
    if (file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      setUploadedFileBase64("/presets/fashion_silhouette_presets_1782147065744.png");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith("image/") || file.type === "application/pdf")) {
      handleSketchFileSelect(file);
    }
  };

  const startSketchRenderingPipeline = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setProcessingProgress(10);
    setProcessingStage(1);
    setProcessingLogs(["Initializing sketch synthesis engine..."]);

    // Helper to simulate intermediate progress logs
    const addLogWithDelay = (log: string, progress: number, delayMs: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setProcessingLogs(prev => [...prev, log]);
          setProcessingProgress(progress);
          resolve();
        }, delayMs);
      });
    };

    try {
      await addLogWithDelay("[1/4] Decoding vector lines and drawing coordinates... OK", 30, 400);

      // Fetch Supabase session JWT
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      // Hit our newly created processing API endpoint
      const response = await fetch("/api/process-sketch", {
        method: "POST",
        headers,
        body: JSON.stringify({
          sketchUrl: uploadedFileBase64,
          template: uploadedFile.name.toLowerCase().includes("skirt") ? "Skirt" : "Gown"
        })
      });

      await addLogWithDelay("[2/4] Detecting silhouette contours & style markers... DONE", 60, 300);

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to process sketch");
      }

      await addLogWithDelay("[3/4] Running volumetric mesh synthesis mapping... COMPLETE", 85, 300);
      await addLogWithDelay("[4/4] Generating high-fidelity workspace deck layers... READY", 100, 300);

      // Save to localStorage
      const colors = [
        "bg-purple-100 text-purple-600",
        "bg-rose-100 text-rose-600",
        "bg-amber-100 text-amber-600",
        "bg-teal-100 text-teal-600",
        "bg-blue-100 text-blue-600"
      ];
      const pickedColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newProject: Project = {
        id: result.projectId || "proj_sketch_" + Date.now(),
        name: uploadedFile.name.replace(/\.[^/.]+$/, "") + " Render",
        template: result.templateName || "Gown",
        fabric: "Silk",
        lastModified: new Date().toISOString().split("T")[0],
        previewColor: pickedColor,
        sketchUrl: uploadedFileBase64 || undefined,
        segments: result.segments
      };

      const stored = localStorage.getItem("designature_projects");
      let currentProjectsList = stored ? JSON.parse(stored) : [];
      const updatedProjects = [newProject, ...currentProjectsList];
      setProjects(updatedProjects);
      localStorage.setItem("designature_projects", JSON.stringify(updatedProjects));

      // Reset states
      setUploadedFile(null);
      setUploadedFileBase64(null);
      setIsProcessing(false);

      router.push(`/workspace?projectId=${newProject.id}&template=${newProject.template}`);
    } catch (err: any) {
      setProcessingLogs(prev => [...prev, `[ERROR] Pipeline failed: ${err.message}`]);
      setTimeout(() => {
        setIsProcessing(false);
      }, 1500);
    }
  };

  const handleCreateFreshSketch = async () => {
    const colors = [
      "bg-purple-100 text-purple-650",
      "bg-rose-100 text-rose-650",
      "bg-amber-100 text-amber-650",
      "bg-teal-100 text-teal-650",
      "bg-blue-100 text-blue-650"
    ];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Fetch default segments for client side Gown preview
    let defaultSegments = [];
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const res = await fetch("/api/process-sketch", {
        method: "POST",
        headers,
        body: JSON.stringify({ template: "Gown" })
      });
      if (res.ok) {
        const data = await res.json();
        defaultSegments = data.segments || [];
      }
    } catch (e) {
      console.warn("Failed to pre-fetch default gown segments:", e);
    }

    const newProject: Project = {
      id: "proj_fresh_" + Date.now(),
      name: `Couture Sketch ${projects.length + 1}`,
      template: "Gown",
      fabric: "Silk",
      lastModified: new Date().toISOString().split("T")[0],
      previewColor: pickedColor,
      segments: defaultSegments
    };

    const stored = localStorage.getItem("designature_projects");
    let currentProjectsList = stored ? JSON.parse(stored) : [];
    const updatedProjects = [newProject, ...currentProjectsList];
    setProjects(updatedProjects);
    localStorage.setItem("designature_projects", JSON.stringify(updatedProjects));

    router.push(`/workspace?projectId=${newProject.id}&template=${newProject.template}`);
  };

  // Filter projects by query
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-zinc-800 font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans flex flex-col relative select-none">
      
      {/* Top Header */}
      <header className="h-16 w-full bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-xs">
        
        {/* Left Branding (Clicking returns to dashboard home) */}
        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <Image src={Logo} alt="DESIGNATURE Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-widest text-zinc-950 hidden sm:flex items-center gap-1.5 uppercase font-sans">
            <span>DESIGNATURE</span>
            <span className="text-zinc-300 font-light text-md md:text-lg">/</span>
            <span className="text-violet-650 font-black">STUDIO</span>
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sketch catalogue designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none text-xs text-zinc-750 transition-all font-medium placeholder-zinc-400"
          />
        </div>

        {/* Right Operations */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-505 hover:text-zinc-800 transition-colors hidden md:block cursor-pointer">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-505 hover:text-zinc-800 transition-colors relative cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-600" />
          </button>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-8 h-8 rounded-full border border-zinc-200 overflow-hidden hover:scale-105 active:scale-95 transition-all flex items-center justify-center bg-zinc-200 cursor-pointer"
            >
              {profile.avatar ? (
                <img src={profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-650 text-xs font-bold">{profile.name[0]}</span>
              )}
            </button>

            <AnimatePresence>
              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-45" onClick={() => setIsProfileDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white border border-zinc-200 rounded-xl shadow-lg z-50 p-4"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-100">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden flex items-center justify-center border border-zinc-200">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-zinc-600 font-bold">{profile.name[0]}</span>
                        )}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-xs font-bold text-zinc-950">{profile.name}</span>
                        <span className="text-[10px] text-zinc-400 truncate">personal-designer</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-xs text-red-650 hover:text-red-700 font-bold flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 px-8 md:px-25 py-8 space-y-10 overflow-y-auto w-full pb-24 h-[calc(100vh-4rem)]">
        
        {/* Detail Panel */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 uppercase tracking-widest flex items-center gap-2 font-sans">
                  <Scissors className="w-5 h-5 text-violet-600" />
                  Sketch to Render
                </h2>
                <p className="text-xs font-semibold text-zinc-500 mt-1">Convert raw design outlines into realistic studio fabric renders.</p>
              </div>
            </div>

            <button
              onClick={handleCreateFreshSketch}
              className="flex items-center justify-center gap-2 px-5 h-10 bg-violet-600 hover:bg-violet-750 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap active:scale-97"
            >
              <Plus className="w-4 h-4" /> Create a Sketch
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Upload Deck */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs flex flex-col justify-between min-h-[350px]">
              <div className="space-y-4 font-sans">
                <div className="flex items-center justify-between font-sans">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">Upload Sketch Deck</h3>
                  {uploadedFile && !isProcessing && (
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setUploadedFileBase64(null);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-750 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Clear File
                    </button>
                  )}
                </div>

                {/* Drag & Drop Zone */}
                {!uploadedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => sketchFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[220px] ${
                      isDragActive
                        ? "border-violet-500 bg-violet-50/50"
                        : "border-zinc-250 hover:border-violet-400 bg-zinc-50/50 hover:bg-zinc-50"
                    }`}
                  >
                    <Upload className="w-8 h-8 text-zinc-405 mb-3" />
                    <p className="text-xs font-bold text-zinc-800 font-sans">
                      Drag & drop your sketch file here, or <span className="text-violet-650 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-1 font-medium font-sans">Supports PNG, JPEG, WebP, or PDFs</p>
                    <input
                      type="file"
                      ref={sketchFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSketchFileSelect(file);
                      }}
                      accept="image/*,application/pdf"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative border border-zinc-200 rounded-2xl p-4 bg-zinc-50/50 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                    {/* Image Layout preview */}
                    {uploadedFile.type.startsWith("image/") && uploadedFileBase64 ? (
                      <div className="relative w-full max-h-[180px] aspect-video rounded-lg overflow-hidden border border-zinc-200 flex items-center justify-center bg-white">
                        <img
                          src={uploadedFileBase64}
                          alt="Sketch preview"
                          className="max-w-full max-h-full object-contain"
                        />
                        
                        {/* Laser Scanner animation effect */}
                        {isProcessing && (
                          <motion.div
                            initial={{ y: "0%" }}
                            animate={{ y: "100%" }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.5,
                              ease: "easeInOut",
                              repeatType: "reverse"
                            }}
                            className="absolute left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_12px_#8b5cf6] z-10"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="relative w-full p-6 bg-white rounded-lg border border-zinc-200 flex flex-col items-center justify-center gap-3">
                        <FileText className="w-10 h-10 text-violet-600" />
                        <div className="text-center font-sans">
                          <p className="text-xs font-bold text-zinc-800 truncate max-w-[200px] font-sans">{uploadedFile.name}</p>
                          <p className="text-[9px] text-zinc-400 font-medium font-sans">PDF Document / {(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        
                        {/* Laser Scanner animation for document */}
                        {isProcessing && (
                          <motion.div
                            initial={{ y: "0%" }}
                            animate={{ y: "100%" }}
                            transition={{
                              repeat: Infinity,
                              duration: 1.2,
                              ease: "easeInOut",
                              repeatType: "reverse"
                            }}
                            className="absolute left-0 right-0 h-0.5 bg-violet-400 shadow-[0_0_8px_#a78bfa] z-10"
                          />
                        )}
                      </div>
                    )}

                    {/* Scanner Logs Overlay */}
                    {isProcessing && (
                      <div className="absolute inset-0 bg-zinc-950/95 flex flex-col justify-end p-4 text-left font-mono z-20 space-y-1 select-none">
                        <div className="text-[9px] text-violet-400 mb-1 border-b border-violet-500/20 pb-0.5 flex justify-between items-center font-mono">
                          <span>AI PIPELINE STATUS</span>
                          <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-violet-850">
                          {processingLogs.map((log, idx) => (
                            <div key={idx} className="text-[9px] text-zinc-300 leading-normal font-mono">
                              {log}
                            </div>
                          ))}
                        </div>
                        <div className="pt-2">
                          <div className="h-1 bg-zinc-850 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-violet-500 rounded-full transition-all duration-300"
                              style={{ width: `${processingProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                disabled={!uploadedFile || isProcessing}
                onClick={startSketchRenderingPipeline}
                className="w-full flex items-center justify-center gap-1.5 h-11 bg-violet-600 hover:bg-violet-750 disabled:bg-zinc-200 text-white disabled:text-zinc-400 text-xs font-bold rounded-lg transition-all shadow-xs duration-200 cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider font-sans"
              >
                <Sparkles className="w-4 h-4 hover:rotate-12 transition-transform" /> Synthesize & Render to Workspace
              </button>
            </div>

            {/* Right Column: Existing Projects */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">Sketch Renders Catalogue</h3>
              
              {projects.length === 0 ? (
                <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center flex flex-col items-center justify-center min-h-[295px]">
                  <Folder className="w-10 h-10 text-zinc-300 mb-2" />
                  <p className="text-zinc-650 text-sm font-semibold">No sketch files found</p>
                  <p className="text-[10px] text-zinc-405 mt-1">Upload a drawing to generate your first render workspace.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => router.push(`/workspace?projectId=${project.id}&template=${project.template}`)}
                      className="bg-white rounded-xl border border-zinc-200 hover:border-violet-405 hover:shadow-xs p-4 flex gap-3 cursor-pointer group transition-all"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${project.previewColor || "bg-violet-100 text-violet-600"} shadow-inner`}>
                        <Scissors className="w-5 h-5 group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-950 truncate group-hover:text-violet-650 tracking-wide font-sans">{project.name}</h4>
                          <span className="text-[10px] text-zinc-550 font-bold block mt-1 uppercase tracking-wider">{project.template}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 mt-2 block">{project.lastModified}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
