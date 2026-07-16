"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, Share2, Sparkles } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { syncUserWithBackend } from "@/lib/api";

export default function TopBar() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("Design Canvas");
  const [projectName, setProjectName] = useState("Untitled Project_01");
  const supabase = createClient();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const templateName = searchParams.get("template");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        syncUserWithBackend();
      }
    });

    if (projectId) {
      const storedProjects = localStorage.getItem("designature_projects");
      if (storedProjects) {
        const projects = JSON.parse(storedProjects);
        const matchingProject = projects.find((p: any) => p.id === projectId);
        if (matchingProject) {
          setProjectName(matchingProject.name);
        }
      }
    } else if (templateName) {
      setProjectName(`Creative ${templateName} Project`);
    }
  }, [supabase, projectId, templateName]);

  const tabs = ["Design Canvas", "Pattern Draft", "Client Preview"];

  return (
    <header className="h-16 w-full border-b border-velvet/10 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 z-40 relative">
      <div className="flex items-center gap-6">
        <Link 
          href="/dashboard" 
          className="p-2 hover:bg-velvet/5 rounded-full transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 text-zinc-600 group-hover:text-velvet transition-colors" />
        </Link>
        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-widest text-velvet flex items-center gap-2 font-sans uppercase">
            DESIGNATURE <span className="text-zinc-300 font-medium">//</span> 
            <span className="text-violet-655">STUDIO</span>
          </h1>
          <span className="text-[10px] text-zinc-500 uppercase tracking-tighter font-sans">{projectName}</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center bg-velvet/5 rounded-full p-1 border border-velvet/5">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-1.5 rounded-full text-xs font-bold font-sans tracking-wide transition-all relative cursor-pointer ${
              activeTab === tab ? "text-white" : "text-zinc-500 hover:text-velvet"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="topbar-active"
                className="absolute inset-0 bg-velvet rounded-full shadow-[0_4px_12px_rgba(42,27,61,0.2)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-900/10 hover:scale-105 active:scale-95 transition-all group cursor-pointer">
          <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Share Review
        </button>
        
        <div className="h-8 w-8 rounded-full bg-zinc-100 border border-velvet/10 flex items-center justify-center overflow-hidden hover:border-violet-500/50 transition-colors cursor-pointer">
          {user?.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-zinc-650" />
          )}
        </div>
      </div>
    </header>
  );
}
