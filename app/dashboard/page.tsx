"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  Sparkles,
  Folder,
  Image as ImageIcon,
  Grid3X3,
  Camera,
  X,
  Check,
  ChevronRight,
  LogOut,
  Sliders,
  Scissors,
  Search,
  Bell,
  Settings,
  HelpCircle,
  Home,
  Briefcase,
  Layers,
  Edit2,
  Download,
  Menu,
  ChevronDown,
  ArrowLeft,
  FileText,
  Loader2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Logo from "@/public/Logo.png";

interface Project {
  id: string;
  name: string;
  template: string;
  fabric: string;
  lastModified: string;
  previewColor: string;
  sketchUrl?: string;
}

interface FinishedWork {
  id: string;
  title: string;
  template: string;
  fabric: string;
  image: string;
  date: string;
}

interface UserProfile {
  name: string;
  avatar: string | null;
  bio: string;
}

const PRESET_FINISHED_WORKS: FinishedWork[] = [
  {
    id: "fw1",
    title: "Crimson Silk Gala Gown",
    template: "Gown",
    fabric: "Silk",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=400",
    date: "2026-06-25",
  },
  {
    id: "fw2",
    title: "Golden Ankara Accent Skirt",
    template: "Skirt",
    fabric: "Ankara",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
    date: "2026-06-28",
  },
  {
    id: "fw3",
    title: "Sapphire Sari Blueprint",
    template: "Sari",
    fabric: "Satin",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
    date: "2026-06-30",
  }
];

const TEMPLATES = [
  { id: "Gown", name: "Runway Gown", description: "Elegant flowing silhouette for couture dresses", count: "12 Styles", color: "from-purple-500/20 to-indigo-500/10", iconBg: "bg-purple-100 text-purple-600" },
  { id: "Skirt", name: "Tailored Skirt", description: "Structured, pleated, and pencil cuts", count: "8 Styles", color: "from-rose-500/20 to-orange-500/10", iconBg: "bg-rose-100 text-rose-600" },
  { id: "Ankara", name: "Ankara Silhouette", description: "Traditional African fashion silhouette geometries", count: "15 Styles", color: "from-amber-500/20 to-yellow-500/10", iconBg: "bg-amber-100 text-amber-600" },
  { id: "Sari", name: "Modern Sari", description: "Graceful South-Asian drapes and pleats", count: "10 Styles", color: "from-teal-500/20 to-cyan-500/10", iconBg: "bg-teal-100 text-teal-600" },
  { id: "Blazer", name: "Structured Blazer", description: "Double-breasted lapel jacket blueprint", count: "6 Styles", color: "from-blue-500/20 to-indigo-500/10", iconBg: "bg-blue-100 text-blue-600" },
  { id: "Hoodie", name: "Oversized Hoodie", description: "Casual everyday streetwear outerwear drop-shoulder", count: "4 Styles", color: "from-zinc-500/20 to-neutral-500/10", iconBg: "bg-zinc-100 text-zinc-600" },
];

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile>({ name: "", avatar: null, bio: "" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [finishedWorks, setFinishedWorks] = useState<FinishedWork[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Active Tab View: "home" | "projects" | "renders" | "settings" | "sketch-to-render"
  const [activeTab, setActiveTab] = useState("home");

  // Sketch states removed (now managed via dedicated page router `/feature/sketch-to-render`)

  // Modals & UI controls
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("Gown");

  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Lightbox

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Renaming state
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  // Load Auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        const defaultName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Designer Studio";

        const storedProfile = localStorage.getItem("designature_user_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          setProfile(parsed);
          setEditName(parsed.name);
          setEditBio(parsed.bio);
        } else {
          const initProfile = { name: defaultName, avatar: user.user_metadata?.avatar_url || null, bio: "Creative Haute Couture Tailor & Designer" };
          setProfile(initProfile);
          setEditName(initProfile.name);
          setEditBio(initProfile.bio);
          localStorage.setItem("designature_user_profile", JSON.stringify(initProfile));
        }
      } else {
        const storedProfile = localStorage.getItem("designature_user_profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          setProfile(parsed);
          setEditName(parsed.name);
          setEditBio(parsed.bio);
        } else {
          const initProfile = { name: "Creative Designer", avatar: null, bio: "Haute Couture & Digital Twin Expert" };
          setProfile(initProfile);
          setEditName(initProfile.name);
          setEditBio(initProfile.bio);
          localStorage.setItem("designature_user_profile", JSON.stringify(initProfile));
        }
      }
    });

    const storedProjects = localStorage.getItem("designature_projects");
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      const initialProjects: Project[] = [
        { id: "p1", name: "Summer Runway Gown", template: "Gown", fabric: "Silk", lastModified: "2026-06-30", previewColor: "bg-purple-100 text-purple-600" },
        { id: "p2", name: "Ankara African Print Skirt", template: "Ankara", fabric: "Ankara", lastModified: "2026-06-29", previewColor: "bg-amber-100 text-amber-600" }
      ];
      setProjects(initialProjects);
      localStorage.setItem("designature_projects", JSON.stringify(initialProjects));
    }

    const storedFinished = localStorage.getItem("designature_finished_works");
    if (storedFinished) {
      setFinishedWorks(JSON.parse(storedFinished));
    } else {
      setFinishedWorks(PRESET_FINISHED_WORKS);
      localStorage.setItem("designature_finished_works", JSON.stringify(PRESET_FINISHED_WORKS));
    }
  }, [supabase]);

  // Handle Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // Profile Save
  const saveProfile = () => {
    if (!editName.trim()) return;
    const updated = { ...profile, name: editName, bio: editBio };
    setProfile(updated);
    localStorage.setItem("designature_user_profile", JSON.stringify(updated));
    setSettingsSuccessMessage(true);
    setTimeout(() => {
      setSettingsSuccessMessage(false);
    }, 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        const updated = { ...profile, avatar: base64Url };
        setProfile(updated);
        localStorage.setItem("designature_user_profile", JSON.stringify(updated));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    const updated = { ...profile, avatar: null };
    setProfile(updated);
    localStorage.setItem("designature_user_profile", JSON.stringify(updated));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Projects CRUD
  const createProject = (templateId?: string) => {
    const templateToUse = templateId || selectedTemplate;
    const nameToUse = newProjectName.trim() || `Untitled ${templateToUse} Project`;

    const colors = [
      "bg-purple-100 text-purple-600",
      "bg-rose-100 text-rose-600",
      "bg-amber-100 text-amber-600",
      "bg-teal-100 text-teal-600",
      "bg-blue-100 text-blue-600"
    ];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];

    const newProject: Project = {
      id: "proj_" + Date.now(),
      name: nameToUse,
      template: templateToUse,
      fabric: "Silk",
      lastModified: new Date().toISOString().split("T")[0],
      previewColor: pickedColor
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem("designature_projects", JSON.stringify(updatedProjects));

    setNewProjectName("");
    setIsNewProjectModalOpen(false);

    router.push(`/workspace?projectId=${newProject.id}&template=${newProject.template}`);
  };

  // Sketch rendering pipeline handlers moved to `/app/feature/sketch-to-render/page.tsx`

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem("designature_projects", JSON.stringify(updated));
    }
  };

  const startRenameProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingProjectId(project.id);
    setRenameValue(project.name);
  };

  const saveRenameProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!renameValue.trim()) return;
    const updated = projects.map(p => p.id === id ? { ...p, name: renameValue, lastModified: new Date().toISOString().split("T")[0] } : p);
    setProjects(updated);
    localStorage.setItem("designature_projects", JSON.stringify(updated));
    setRenamingProjectId(null);
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingProjectId(null);
  };

  const openProject = (project: Project) => {
    if (renamingProjectId === project.id) return;
    router.push(`/workspace?projectId=${project.id}&template=${project.template}`);
  };

  // Filter projects & works
  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFinished = finishedWorks.filter(w =>
    w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.template.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-zinc-800 font-sans [&_h1]:font-sans [&_h2]:font-sans [&_h3]:font-sans [&_h4]:font-sans [&_h5]:font-sans [&_h6]:font-sans flex flex-col relative select-none">

      {/* Search Header (Canva Bar Style) */}
      <header className="h-16 w-full bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-xs">

        {/* Left branding */}
        <div
          onClick={() => {
            setActiveTab("home");
          }}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <Image src={Logo} alt="DESIGNATURE Logo" className="w-9 h-9 object-contain" />
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-[0.1em] text-zinc-950 hidden sm:flex items-center gap-1.5 uppercase font-sans">
            <span>DESIGNATURE</span>
            <span className="text-zinc-300 font-light text-md md:text-lg">/</span>
            <span className="text-violet-650 font-black">STUDIO</span>
          </h1>
        </div>

        {/* Center search element */}
        <div className="flex-1 max-w-xl mx-8 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === "projects"
                ? "Search active workspace designs..."
                : activeTab === "renders"
                  ? "Search exported designs..."
                  : "Search anything in your studio..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-md border border-zinc-300 bg-zinc-50 focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 outline-none text-xs text-zinc-750 transition-all font-medium placeholder-zinc-400"
          />
        </div>

        {/* Right operations */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-505 hover:text-zinc-800 transition-colors hidden md:block cursor-pointer">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`p-2 hover:bg-zinc-100 rounded-full transition-colors hidden md:block cursor-pointer ${activeTab === "settings" ? "text-violet-600 bg-zinc-100" : "text-zinc-505 hover:text-zinc-800"
              }`}
          >
            <Settings className="w-4.5 h-4.5" />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-505 hover:text-zinc-800 transition-colors relative cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-violet-600" />
          </button>

          <button
            onClick={() => {
              setNewProjectName("");
              setSelectedTemplate("Gown");
              setIsNewProjectModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1.5 px-4 h-9 bg-violet-600 hover:bg-violet-700 active:scale-97 text-white text-xs font-bold rounded-md shadow-sm transition-all cursor-pointer"
          >
            Create a Design
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
                        <span className="text-[10px] text-zinc-400 truncate">{user?.email || "personal-designer"}</span>
                      </div>
                    </div>

                    <div className="py-2 space-y-1">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setActiveTab("settings");
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-50 text-xs text-zinc-705 hover:text-zinc-950 font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setActiveTab("projects");
                        }}
                        className="w-full text-left px-3 py-2 rounded-md hover:bg-zinc-50 text-xs text-zinc-705 hover:text-zinc-950 font-medium flex items-center gap-2 cursor-pointer"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        Your Projects
                      </button>
                    </div>

                    <div className="pt-2 border-t border-zinc-100">
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

      {/* Main shell */}
      <div className="flex-1 flex w-full relative">


        {/* Main Content Workspace Panel */}
        <main className="flex-1 px-8 md:px-25 py-8 space-y-10 overflow-y-auto w-full pb-24 h-[calc(100vh-4rem)]">

          <AnimatePresence mode="wait">

            {/* HOME VIEW TAB */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-10"
              >
                {/* Canva Banner Section */}
                <section className="rounded-2xl bg-gradient-to-r from-violet-300 via-indigo-60 to-purple-600 p-8 shadow-md relative overflow-hidden flex flex-col justify-center items-center text-center text-white h-52">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-60 pointer-events-none" />

                  <div className="relative z-10 space-y-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-sans uppercase">Welcome to DESIGNATURE Studio, {profile.name.split(" ")[0]}</h2>
                    <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto hidden sm:block font-medium">Select our active feature suite below to synthesize your designs in real-time.</p>
                  </div>
                </section>

                {/* Creative Feature Suites Grid */}
                <section className="space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-sans">Creative Feature Suites</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Sketch to Render (Active Feature) */}
                    <div
                      onClick={() => router.push("/feature/sketch-to-render")}
                      className="group relative bg-white rounded-2xl border border-zinc-200 hover:border-violet-400 hover:shadow-lg p-6 flex flex-col justify-between h-56 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-radial from-violet-500/20 to-transparent blur-2xl pointer-events-none group-hover:scale-125 transition-all duration-500" />

                      <div>
                        <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4 text-violet-600 shadow-inner">
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-zinc-950 group-hover:text-violet-650 uppercase tracking-wide transition-colors font-sans">Sketch to Render</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-violet-100 text-violet-755 tracking-widest">Active</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed max-w-sm">
                          Upload hand-drawn sketches or PDF vectors to map photorealistic fabric drapes to mannequins automatically in our workspace.
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-end text-xs font-bold text-violet-655 group-hover:translate-x-1 transition-transform">
                        Launch Suite <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Digital Twin Generation (Locked) */}
                    <div 
                      onClick={() => router.push("/feature/digital-twin")}
                      className="group relative bg-[#FCFCFD] rounded-2xl border border-zinc-205 hover:border-violet-400 hover:shadow-lg p-6 flex flex-col justify-between h-56 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-500 shadow-inner">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-zinc-700 uppercase tracking-wide font-sans">Digital Twin Gen</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-zinc-200 text-zinc-650 tracking-widest">Preview</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed max-w-sm">
                          Synthesize photorealistic 3D clients adjusting shoulder drape, bust ratio, waist line, and hip dimensions in real time.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-end text-xs font-bold text-zinc-400">
                        Launch Preview <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Virtual Try-On (Locked) */}
                    <div 
                      onClick={() => router.push("/feature/virtual-try-on")}
                      className="group relative bg-[#FCFCFD] rounded-2xl border border-zinc-205 hover:border-violet-400 hover:shadow-lg p-6 flex flex-col justify-between h-56 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-500 shadow-inner">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-zinc-705 uppercase tracking-wide font-sans">Virtual Try-On</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-zinc-200 text-zinc-655 tracking-widest">Preview</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed max-w-sm">
                          Visualize drape behavior, fit simulations, and textile elasticity directly on virtual models in studio lighting modes.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-end text-xs font-bold text-zinc-400">
                        Launch Preview <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                    {/* HD Render Gallery Suite (Locked) */}
                    <div 
                      onClick={() => router.push("/feature/pattern-generation")}
                      className="group relative bg-[#FCFCFD] rounded-2xl border border-zinc-205 hover:border-violet-405 hover:shadow-lg p-6 flex flex-col justify-between h-56 transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-4 text-zinc-500 shadow-inner">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-bold text-zinc-705 uppercase tracking-wide font-sans">Automated Patterns</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-zinc-200 text-zinc-655 tracking-widest">Preview</span>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed max-w-sm">
                          Automatically compute flat pattern cuts and sewing diagrams based on drape textures mapped to the target 3D mannequin.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-end text-xs font-bold text-zinc-400">
                        Launch Preview <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                </section>

                {/* Home - Recent Designs Preview Panel (Limits to 4 items) */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4.5 h-4.5 text-violet-600" />
                      <h3 className="text-sm md:text-base font-extrabold text-zinc-950 uppercase tracking-widest font-sans">Recent Designs</h3>
                    </div>
                    {projects.length > 4 && (
                      <button
                        onClick={() => setActiveTab("projects")}
                        className="text-sm text-violet-600 hover:text-violet-750 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                      >
                        See All <ChevronRight className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>

                  {filteredProjects.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center flex flex-col items-center justify-center h-48">
                      <Folder className="w-8 h-8 text-zinc-300 mb-1 stroke-[1.5]" />
                      <p className="text-zinc-700 text-sm font-bold">No recent designs found</p>
                      <button
                        onClick={() => setIsNewProjectModalOpen(true)}
                        className="mt-2.5 px-5 py-2 h-9 bg-zinc-100 hover:bg-zinc-250 border border-zinc-300 text-zinc-800 text-xs font-bold rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Create Project
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                      {filteredProjects.slice(0, 4).map((project) => (
                        <div
                          key={project.id}
                          onClick={() => openProject(project)}
                          className="bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all flex flex-col group overflow-hidden cursor-pointer"
                        >
                          <div className="h-32 bg-zinc-50 border-b border-zinc-200 flex items-center justify-center relative p-3">
                            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${project.previewColor || "bg-violet-100 text-violet-600"} shadow-inner`}>
                              <Scissors className="w-5 h-5" />
                            </div>
                            <div className="absolute inset-0 bg-zinc-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              <span className="bg-white/95 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-zinc-900 shadow-sm flex items-center gap-1">
                                Open Design <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            </div>
                          </div>

                          <div className="p-4 flex flex-col justify-between flex-1 bg-white min-w-0">
                            <h4 className="text-base font-extrabold text-zinc-950 truncate group-hover:text-violet-600 transition-colors font-sans">{project.name}</h4>
                            <div className="flex flex-wrap justify-between items-center gap-1.5 mt-2.5 pt-2 border-t border-zinc-100">
                              <span className="text-xs font-bold text-zinc-600 uppercase truncate max-w-[130px]">{project.template}</span>
                              <span className="text-xs text-zinc-500 font-medium shrink-0">{project.lastModified}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Home - Renders Preview Panel (Limits to 3 items) */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4.5 h-4.5 text-violet-600" />
                      <h3 className="text-sm md:text-base font-extrabold text-zinc-950 uppercase tracking-widest font-sans">Recent Finished Renders</h3>
                    </div>
                    {finishedWorks.length > 3 && (
                      <button
                        onClick={() => setActiveTab("renders")}
                        className="text-sm text-violet-600 hover:text-violet-750 font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                      >
                        See All <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredFinished.slice(0, 3).map((work) => (
                      <div
                        key={work.id}
                        onClick={() => setSelectedImage(work.image)}
                        className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all flex flex-col cursor-pointer group shadow-xs"
                      >
                        <div className="h-44 relative overflow-hidden bg-zinc-100 border-b border-zinc-200">
                          <img src={work.image} alt={work.title} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                          <div className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full border border-zinc-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-3 h-3 text-zinc-700" />
                          </div>
                        </div>
                        <div className="p-4 bg-white flex flex-col justify-between flex-1 min-w-0">
                          <h4 className="text-base font-extrabold text-zinc-950 truncate uppercase font-sans">{work.title}</h4>
                          <span className="text-xs font-bold text-zinc-500 uppercase mt-2 tracking-wider truncate block w-full">{work.template} / {work.fabric}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}



            {/* PROJECTS VIEW TAB */}
            {activeTab === "projects" && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <div>
                    <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 uppercase tracking-widest flex items-center gap-2 font-sans">
                      <Briefcase className="w-5 h-5 text-violet-600" />
                      Design Projects Catalog
                    </h2>
                    <p className="text-sm font-medium text-zinc-500 mt-1">Manage and edit your saved projects.</p>
                  </div>

                  <button
                    onClick={() => {
                      setNewProjectName("");
                      setSelectedTemplate("Gown");
                      setIsNewProjectModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-5 h-10 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create Design
                  </button>
                </div>

                {filteredProjects.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center flex flex-col items-center justify-center">
                    <Folder className="w-12 h-12 text-zinc-305 mb-2 stroke-[1.5]" />
                    <p className="text-zinc-650 text-sm font-semibold">No design files found</p>
                    {searchQuery && <p className="text-zinc-400 text-xs mt-1">Try search criteria matching template silhouettes.</p>}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => openProject(project)}
                        className="bg-white rounded-xl border border-zinc-200 hover:border-zinc-350 hover:shadow-md transition-all flex flex-col group overflow-hidden cursor-pointer"
                      >
                        <div className="h-32 bg-zinc-50 border-b border-zinc-200 flex items-center justify-center relative p-3">
                          <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${project.previewColor || "bg-violet-100 text-violet-600"} shadow-inner`}>
                            <Scissors className="w-5 h-5" />
                          </div>
                          <div className="absolute inset-0 bg-zinc-950/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <span className="bg-white/95 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider text-zinc-900 shadow-sm flex items-center gap-1">
                              Open Workspace <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>

                        <div className="p-4 flex flex-col justify-between flex-1 gap-2 bg-white min-w-0">
                          {renamingProjectId === project.id ? (
                            <div className="flex items-center gap-1 mt-1 z-20">
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-zinc-50 border border-zinc-300 rounded px-2 py-0.5 text-xs text-zinc-800 outline-none min-w-0"
                                autoFocus
                              />
                              <button
                                onClick={(e) => saveRenameProject(project.id, e)}
                                className="p-1 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-350 text-emerald-700 transition shrink-0"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelRename}
                                className="p-1 rounded bg-rose-50 hover:bg-rose-100 border border-rose-350 text-rose-700 transition shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start gap-2 min-w-0">
                              <h4 className="text-base font-extrabold text-zinc-950 truncate group-hover:text-violet-600 transition-colors uppercase font-sans min-w-0 flex-1">{project.name}</h4>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  onClick={(e) => startRenameProject(project, e)}
                                  className="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => deleteProject(project.id, e)}
                                  className="p-1 rounded hover:bg-red-50 text-zinc-400 hover:text-red-600 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="flex flex-wrap justify-between items-center gap-1.5 mt-2 pt-2 border-t border-zinc-100">
                            <span className="text-xs font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-wider truncate max-w-[140px]">{project.template}</span>
                            <span className="text-xs text-zinc-500 font-medium shrink-0">{project.lastModified}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* TEMPLATES VIEW TAB */}
            {activeTab === "templates" && (
              <motion.div
                key="templates"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-zinc-200 pb-3">
                  <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 uppercase tracking-widest flex items-center gap-2 font-sans">
                    <Grid3X3 className="w-5 h-5 text-violet-600" />
                    Creative Silhouette Blueprints
                  </h2>
                  <p className="text-sm font-medium text-zinc-500 mt-1">Pick a template to initialize your fashion design canvas studio.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {TEMPLATES.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplate(tmpl.id);
                        setNewProjectName(`Canva ${tmpl.name}`);
                        setIsNewProjectModalOpen(true);
                      }}
                      className="bg-white rounded-xl border border-zinc-200 hover:border-violet-300 hover:shadow-md p-5 flex flex-col justify-between min-h-[230px] h-auto cursor-pointer transition-all group relative overflow-hidden min-w-0"
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-radial ${tmpl.color} blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500`} />

                      <div className="min-w-0">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 shadow-inner bg-zinc-50 border border-zinc-200 font-bold uppercase tracking-widest text-xs text-zinc-600 shrink-0">
                          {tmpl.id.slice(0, 2)}
                        </div>
                        <h3 className="text-base font-extrabold text-zinc-950 group-hover:text-violet-600 transition-colors uppercase tracking-wider font-sans truncate">{tmpl.name}</h3>
                        <p className="text-xs text-zinc-600 mt-2 font-medium leading-relaxed line-clamp-3">
                          {tmpl.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-500 capitalize shrink-0">{tmpl.count} combinations</span>
                        <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider group-hover:text-violet-600 border border-zinc-200 group-hover:border-violet-600/20 px-2.5 py-1 rounded bg-zinc-50 transition-colors flex items-center gap-1 shrink-0">
                          Use Blueprint <Plus className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RENDERS VIEW TAB */}
            {activeTab === "renders" && (
              <motion.div
                key="renders"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="border-b border-zinc-200 pb-3">
                  <h2 className="text-xl md:text-2xl font-extrabold text-zinc-950 uppercase tracking-widest flex items-center gap-2 font-sans">
                    <ImageIcon className="w-5 h-5 text-violet-600" />
                    HD Render Gallery
                  </h2>
                  <p className="text-sm font-medium text-zinc-500 mt-1">High-definition AI visual synthesis outputs of your fashion drafts.</p>
                </div>

                {filteredFinished.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-zinc-200 p-16 text-center text-zinc-600 text-sm font-semibold">
                    No exported finished designs detected. Visit the Workspace to render.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredFinished.map((work) => (
                      <div
                        key={work.id}
                        onClick={() => setSelectedImage(work.image)}
                        className="bg-white rounded-xl border border-zinc-200 overflow-hidden hover:shadow-md transition-all flex flex-col cursor-pointer group shadow-xs min-w-0"
                      >
                        <div className="h-56 relative overflow-hidden bg-zinc-50 border-b border-zinc-200 shrink-0">
                          <img
                            src={work.image}
                            alt={work.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 z-20 p-2 bg-white/95 rounded-full border border-zinc-250 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-zinc-700" />
                          </div>
                        </div>

                        <div className="p-4 flex flex-col justify-between flex-1 bg-white min-w-0">
                          <h4 className="text-base font-extrabold text-zinc-950 truncate group-hover:text-violet-600 transition-colors uppercase tracking-wider font-sans">{work.title}</h4>
                          <div className="flex flex-wrap justify-between items-center gap-2 mt-3 pt-2 border-t border-zinc-100">
                            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider truncate max-w-[65%]">{work.template} / {work.fabric}</span>
                            <span className="text-xs text-zinc-500 font-medium shrink-0">{work.date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SETTINGS VIEW TAB */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 max-w-xl"
              >
                <div className="border-b border-zinc-200 pb-3">
                  <h2 className="text-lg font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-2 font-sans">
                    <Sliders className="w-5 h-5 text-violet-600" />
                    Designer Account Settings
                  </h2>
                  <p className="text-xs text-zinc-450 mt-1">Configure your public style, display name, and avatar details.</p>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-xs">

                  {/* Photo management */}
                  <div className="flex items-center gap-6">
                    <div className="relative group/settings-avatar shrink-0 duration-200">
                      <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden uppercase font-bold text-xl relative shadow-inner">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-zinc-600 text-2xl">{profile.name[0]}</span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center gap-1.5 opacity-0 group-hover/settings-avatar:opacity-100 transition-opacity">
                        <label className="p-1.5 bg-white/10 rounded-full hover:bg-white/20 cursor-pointer text-white">
                          <Camera className="w-3.5 h-3.5" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                            ref={fileInputRef}
                          />
                        </label>
                        {profile.avatar && (
                          <button
                            onClick={removeAvatar}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-300 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs font-bold text-zinc-800 font-sans">Profile Picture</h4>
                      <p className="text-[10px] text-zinc-400 leading-normal max-w-xs">Supports JPG, PNG formats. Photos are stored locally inside security buffers.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Display Name</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Designer Display Name"
                        className="w-full h-10 bg-zinc-50 border border-zinc-300 rounded-lg px-3 text-xs text-zinc-800 focus:bg-white focus:border-violet-600 outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Biography / Design Mantra</label>
                      <textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="Briefly state your fashion style patterns..."
                        rows={3}
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-800 focus:bg-white focus:border-violet-600 outline-none transition-all resize-none h-20"
                      />
                    </div>
                  </div>

                  {settingsSuccessMessage && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Account Details Updated Successfully!
                    </div>
                  )}

                  <div className="pt-2 flex justify-start gap-4">
                    <button
                      onClick={saveProfile}
                      className="px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      Save Configuration
                    </button>
                    <button
                      onClick={() => {
                        setEditName(profile.name);
                        setEditBio(profile.bio);
                        setActiveTab("home");
                      }}
                      className="px-5 py-2.5 rounded-lg border border-zinc-350 hover:bg-zinc-50 text-xs font-semibold text-zinc-70 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>

      {/* New Project Dialog Modal */}
      <AnimatePresence>
        {isNewProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setIsNewProjectModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-zinc-200 w-full max-w-md rounded-2xl p-6 relative z-10 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  Create a New Design
                </h3>
                <button
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="p-1 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-405 uppercase tracking-widest">Document Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Autumn Gala Dress"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full h-10 bg-zinc-50 border border-zinc-300 rounded-lg px-3 text-xs text-zinc-800 focus:bg-white focus:border-violet-600 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-405 uppercase tracking-widest">Template Silhouette</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setSelectedTemplate(tmpl.id)}
                        className={`px-2 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border truncate transition-all ${selectedTemplate === tmpl.id
                          ? "bg-violet-50 border-violet-500 text-violet-700 ring-1 ring-violet-500"
                          : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100"
                          }`}
                      >
                        {tmpl.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-350 hover:bg-zinc-50 text-xs font-semibold text-zinc-70 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => createProject()}
                  className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Create Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox / Zoom Dialog Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80"
              onClick={() => setSelectedImage(null)}
            />

            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 bg-zinc-900/60 hover:bg-zinc-900 text-white rounded-full z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-h-[85vh] max-w-[85vw] z-10 flex items-center justify-center rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl bg-zinc-950"
            >
              <img
                src={selectedImage || undefined}
                alt="High Definition Render Preview"
                className="max-h-[85vh] max-w-[85vw] object-contain"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
