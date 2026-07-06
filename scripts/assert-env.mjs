// Single source of truth for env vars every environment (main, live, Render) must provide.
// CI runs this before `next build` so a missing variable fails loudly instead of
// shipping a build with an inlined undefined value.
const REQUIRED = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
]

const missing = REQUIRED.filter((name) => !process.env[name]?.trim())

if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(', ')}`)
    process.exit(1)
}

console.log(`All ${REQUIRED.length} required env vars present.`)
