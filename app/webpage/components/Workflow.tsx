"use client";

import React from "react";
import { motion } from "framer-motion";
import { Upload, Edit3, Eye } from "lucide-react";

const steps = [
  {
    title: "Input",
    description: "Upload raw fabric sketches or material textures directly into your workspace.",
    icon: Upload,
    delay: 0,
  },
  {
    title: "Refine",
    description: "Manipulate design templates inside an Apple-style minimalist workspace layer.",
    icon: Edit3,
    delay: 0.2,
  },
  {
    title: "Visualize",
    description: "Generate the rich, high-fidelity client expectation preview link in seconds.",
    icon: Eye,
    delay: 0.4,
  },
];

export function Workflow() {
  return (
    <section id="workflow" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold text-velvet mb-6"
          >
            Seamless <span className="italic font-serif">Workflow.</span>
          </motion.h2>
          <p className="text-lg text-velvet/60">From imagination to visualization in three simple steps.</p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-16 md:gap-8">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-velvet/0 via-velvet/10 to-velvet/0 -translate-x-1/2 md:left-0 md:right-0 md:top-1/2 md:bottom-auto md:w-full md:h-0.5 md:bg-linear-to-r md:-translate-y-12" />

          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center relative z-20 group"
            >
              <div className="w-28 h-28 rounded-full bg-cream border border-velvet/10 flex items-center justify-center mb-8 relative shadow-2xl shadow-velvet/5 group-hover:scale-110 group-hover:border-violet-500/30 transition-all duration-700">
                <div className="absolute inset-0 rounded-full bg-violet-500/0 group-hover:bg-violet-500/5 transition-colors duration-700" />
                <step.icon className="w-10 h-10 text-velvet transition-transform duration-700 group-hover:rotate-12" />
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-velvet text-cream flex items-center justify-center font-bold text-base shadow-lg group-hover:bg-violet-600 transition-colors duration-700">
                  {idx + 1}
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-velvet mb-4 group-hover:text-violet-600 transition-colors duration-700">{step.title}</h3>
              <p className="text-lg text-velvet/60 leading-relaxed max-w-[320px] mx-auto group-hover:text-velvet/80 transition-colors duration-700">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Background Decorative Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-linear-to-b from-transparent via-violet-50/30 to-transparent pointer-events-none" />
    </section>
  );
}
