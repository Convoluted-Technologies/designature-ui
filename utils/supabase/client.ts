import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Ensure we have a valid URL format even if keys are missing or still set to template placeholders
    if (!supabaseUrl || supabaseUrl.includes("your_supabase_project_url") || !supabaseUrl.startsWith("http")) {
        supabaseUrl = "https://placeholder-project.supabase.co"
    }
    if (!supabaseKey || supabaseKey.includes("your_supabase_anon_key")) {
        supabaseKey = "placeholder-key"
    }
    
    return createBrowserClient(supabaseUrl, supabaseKey)
}
