"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Globe, Loader2 } from "lucide-react";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-3xl glass shadow-2xl border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-velvet mb-2">Welcome to Designature</h2>
        <p className="text-sm text-velvet/60">Choose your preferred way to enter the studio</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-12 flex items-center justify-center gap-3 rounded-full bg-white border border-velvet/10 text-velvet font-medium hover:bg-zinc-50 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-5 h-5 text-violet-600" />}
          Continue with Google
        </button>

        {message && (
          <div className={cn(
            "p-3 rounded-xl text-xs font-medium text-center",
            message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          )}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
