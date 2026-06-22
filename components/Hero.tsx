"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import LoginButton from "./LoginButton";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col items-center justify-center pt-40 pb-20 px-6 overflow-hidden bg-cream"
    >
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(42, 27, 61, 0.08), transparent 80%)`
        }}
      />

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-velvet/5 border border-velvet/10 text-velvet text-[10px] font-bold tracking-[0.3em] uppercase mb-10"
          >
            <span className="w-1 h-1 rounded-full bg-violet-500 animate-ping" />
            Fashion At It's Best
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-velvet leading-[1.05] mb-10"
          >
            From Sketch <br />
            <span className="italic font-serif text-violet-600/80">to 3D Reality.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-velvet/70 max-w-xl mb-14 leading-relaxed"
          >
            Design, drape, and preview women's haute couture on digital twins before the first stitch is ever placed. Say goodbye to expectation gaps.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <LoginButton className="px-8 py-4 text-base shadow-xl shadow-velvet/20 hover:scale-105 active:scale-95" />


          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative aspect-square md:aspect-4/3 lg:aspect-4/5 w-full max-w-2xl mx-auto group"
        >
          {/* Glass frame for the canvas */}
          <div className="absolute inset-0 rounded-4xl bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-10 bg-white/30 backdrop-blur-md border-b border-white/20 flex items-center px-6 gap-2 z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
              <div className="ml-4 text-[10px] font-bold text-velvet/40 tracking-widest uppercase">3D Viewport — Digital Twin v2.0</div>
            </div>

            <div className="relative w-full h-full pt-10">
              {/* Replace with generated image path when available */}
              <Image
                src="/fashion_digital_twin.png"
                alt="Digital Twin Interface"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay elements to make it look like a workspace */}
              <div className="absolute top-16 right-6 flex flex-col gap-3 z-10">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-lg bg-white/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-velvet/60 hover:bg-velvet hover:text-white transition-all cursor-pointer">
                    <div className="w-4 h-4 border-2 border-current rounded-sm opacity-60" />
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-6 right-6 h-20 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 z-10 flex items-center px-6 gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-velvet/10 backdrop-blur-md" />
                  ))}
                </div>
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 2, delay: 1 }}
                    className="h-full bg-velvet shadow-[0_0_10px_rgba(42,27,61,0.5)]"
                  />
                </div>
                <div className="text-[10px] font-bold text-velvet/60 uppercase tracking-tighter">Rendering... 65%</div>
              </div>
            </div>
          </div>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 w-32 h-32 rounded-3xl bg-linear-to-br from-violet-200/20 to-transparent border border-white/20 backdrop-blur-md z-0"
          />
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-10 -left-10 w-48 h-48 rounded-4xl bg-linear-to-tr from-cream to-transparent border border-white/20 backdrop-blur-md z-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
