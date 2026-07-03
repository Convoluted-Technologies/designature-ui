"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Layers, HelpCircle, Bell } from "lucide-react";
import Logo from "../../../public/Logo.png";

export default function VirtualTryOnPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({ name: "Personal Designer", avatar: null as string | null });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("designature_user_profile");
      if (storedProfile) {
        try {
          setProfile(JSON.parse(storedProfile));
        } catch (e) {}
      }
    }
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-zinc-800 font-sans flex flex-col relative select-none">
      
      {/* Top Header */}
      <header className="h-16 w-full bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-xs">
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

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-505 hover:text-zinc-800 transition-colors cursor-pointer">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button className="p-2 hover:bg-zinc-100 rounded-full text-zinc-550 relative cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
          </button>
          <div className="w-8 h-8 rounded-full border border-zinc-200 overflow-hidden bg-zinc-200 flex items-center justify-center">
            {profile.avatar ? (
              <img src={profile.avatar} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-zinc-650 text-xs font-bold">{profile.name[0]}</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 md:px-25 py-8 space-y-10 overflow-y-auto w-full pb-24 h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        
        <div className="max-w-md w-full bg-white border border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center shadow-xs space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500 shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold text-zinc-900 uppercase tracking-wide font-sans">Virtual Try-On</h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-zinc-200 text-zinc-600 tracking-wider">Coming Soon</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans max-w-xs mx-auto">
              Simulate draping behaviors, lighting, and elasticity mappings on models during virtual try-on runs.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
          </button>
        </div>

      </main>
    </div>
  );
}
