import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import AuthForm from "./AuthForm";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative group px-6 py-2.5 rounded-full bg-velvet text-cream text-sm font-medium transition-all duration-300 shadow-md hover:bg-[#3d2957] overflow-hidden",
          className
        )}
      >
        <span className="relative z-10">Enter Studio</span>
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-100 flex items-center justify-center p-6 md:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-velvet/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md z-10 mx-auto"
              >
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute -top-12 right-0 p-2 text-cream/60 hover:text-cream transition-colors bg-white/10 rounded-full md:bg-transparent"
                >
                  <X className="w-6 h-6" />
                </button>
                <AuthForm />
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
