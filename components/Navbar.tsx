"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "../public/Logo.png"
import Image from "next/image";


import LoginButton from "./LoginButton";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit min-w-[90%] md:min-w-[700px] px-8 py-3 sm:py-4 rounded-full transition-all duration-500 glass shadow-2xl shadow-velvet/5",
        scrolled ? "top-3 opacity-100" : "top-5 opacity-90"
      )}
    >
      <div className="flex items-center justify-between gap-12">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative">
            <Image src={Logo} alt="Logo" className="w-7 h-7" loading="lazy" />
            {/* <span className="absolute -top-1 -right-4 w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" /> */}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.2em] text-velvet leading-none">DESIGNATURE</span>
            <span className="text-[8px] tracking-widest text-velvet/40 mt-0.5 uppercase">Fashion at its best</span>
          </div>
        </Link>


        <LoginButton className="hidden sm:block" />
      </div>
    </motion.nav>
  );
}
