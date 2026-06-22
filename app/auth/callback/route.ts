import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // next determines where to redirect the user after a successful login
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const cookieStore = await cookies()
        let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || supabaseUrl.includes("your_supabase_project_url") || !supabaseUrl.startsWith("http")) {
            supabaseUrl = "https://placeholder-project.supabase.co"
        }
        if (!supabaseKey || supabaseKey.includes("your_supabase_anon_key")) {
            supabaseKey = "placeholder-key"
        }
        
        const supabase = createServerClient(
            supabaseUrl,
            supabaseKey,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                        } catch {
                            // The `setAll` method can be called from a Server Component,
                            // which sometimes throws if cookies are modified after headers are sent.
                        }
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Return the user to an error page or home if something goes wrong
    return NextResponse.redirect(`${origin}/auth/auth-error`)
}