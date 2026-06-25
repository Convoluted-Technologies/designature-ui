"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { Mail, Lock, Globe, ArrowRight, Loader2, User } from "lucide-react";

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/workspace`,
      },
    });

    if (error) {
      setMessage({ type: "error", text: error.message });
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const { error } = mode === "signin" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              full_name: name,
            }
          }
        });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      if (mode === "signup") {
        setMessage({ type: "success", text: "Check your email for the confirmation link." });
      } else {
        window.location.href = "/workspace";
      }
    }
    setIsLoading(false);
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
          className="w-full h-12 flex items-center justify-center gap-3 rounded-full bg-white border border-velvet/10 text-velvet font-medium hover:bg-zinc-50 transition-all disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-5 h-5 text-violet-600" />}
          Continue with Google
        </button>

        <div className="relative py-4 flex items-center gap-4">
          <div className="flex-1 h-px bg-velvet/10" />
          <span className="text-[10px] font-bold text-velvet/30 uppercase tracking-widest leading-none">or email</span>
          <div className="flex-1 h-px bg-velvet/10" />
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-velvet/40" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={mode === "signup"}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/50 border border-velvet/10 focus:border-violet-500/50 outline-none transition-all text-sm"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-velvet/40" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/50 border border-velvet/10 focus:border-violet-500/50 outline-none transition-all text-sm"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-velvet/40" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/50 border border-velvet/10 focus:border-violet-500/50 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {message && (
            <div className={cn(
              "p-3 rounded-xl text-xs font-medium text-center",
              message.type === "error" ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
            )}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-velvet text-cream font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-velvet/20 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                {mode === "signin" ? "Enter Studio" : "Create Account"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 text-center">
          <button 
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="text-xs text-velvet/50 hover:text-velvet transition-colors"
          >
            {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
