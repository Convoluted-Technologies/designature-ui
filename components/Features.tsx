"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  UserCircle, 
  PenTool, 
  Layers, 
  Maximize, 
  Download,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Digital Twin Generation",
    description: "Upload or generate a perfect digital canvas of any client profile with millimeter precision.",
    icon: UserCircle,
    size: "lg",
    color: "bg-violet-100/50",
  },
  {
    title: "Sketch to Render",
    description: "Convert rough pen-and-paper lines into hyper-realistic fabrics seamlessly.",
    icon: PenTool,
    size: "sm",
    color: "bg-blue-100/50",
  },
  {
    title: "Virtual Try-On",
    description: "Instantly map premium lace, silk, or ankara textures onto 3D-proportioned silhouettes.",
    icon: Layers,
    size: "md",
    color: "bg-amber-100/50",
  },
  {
    title: "HD Artifacts",
    description: "Download flawless, studio-grade client previews with automated context backdrops.",
    icon: Download,
    size: "sm",
    color: "bg-emerald-100/50",
  },
  {
    title: "Automated Pattern Generation",
    description: "Turn digital finalized concepts into accurate blueprint proportions automatically.",
    icon: Maximize,
    size: "md",
    color: "bg-rose-100/50",
  },
  {
    title: "Instant Sync",
    description: "Your workspace is always in sync with your mobile studio for on-the-go adjustments.",
    icon: Zap,
    size: "sm",
    color: "bg-purple-100/50",
  }
];

export function Features() {
  return (
    <section id="features" className="py-32 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-velvet mb-6"
          >
            The Canva for <span className="italic font-serif">Tailors.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-velvet/60 max-w-2xl mx-auto"
          >
            Every tool you need to bridge the gap between imagination and physical masterpiece.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[280px]">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "group relative rounded-4xl p-10 overflow-hidden border border-velvet/5 bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-500 shadow-xl shadow-velvet/2 hover:shadow-velvet/5",
                feature.size === "lg" ? "md:col-span-2 lg:row-span-2" : "",
                feature.size === "md" ? "lg:row-span-2" : ""
              )}
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner", feature.color)}>
                <feature.icon className="w-7 h-7 text-velvet" />
              </div>
              
              <h3 className="text-2xl font-bold text-velvet mb-4 group-hover:translate-x-1 transition-transform duration-500">{feature.title}</h3>
              <p className="text-velvet/60 leading-relaxed group-hover:translate-x-1 transition-transform duration-500 delay-75">{feature.description}</p>
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-velvet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Glass decorative elements */}
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-white/30 blur-3xl group-hover:scale-150 transition-transform duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
