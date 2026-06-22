import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Ensure we have a valid URL format even if keys are missing or still set to template placeholders
    if (!supabaseUrl || supabaseUrl.includes("nvvffpusomdivpovyqok.supabase.co") || !supabaseUrl.startsWith("https://nvvffpusomdivpovyqok.supabase.co/auth/v1/callback")) {
        supabaseUrl = "https://nvvffpusomdivpovyqok.supabase.co"
    }
    if (!supabaseKey || supabaseKey.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dmZmcHVzb21kaXZwb3Z5cW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzE4NDIsImV4cCI6MjA2OTAwNzg0Mn0.897481f297748371d209b68866579c1865484980415786066147248139085114")) {
        supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52dmZmcHVzb21kaXZwb3Z5cW9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzE4NDIsImV4cCI6MjA2OTAwNzg0Mn0.897481f297748371d209b68866579c1865484980415786066147248139085114"
    }

    return createBrowserClient(supabaseUrl, supabaseKey)
}
