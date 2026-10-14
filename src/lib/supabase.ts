import { createClient } from '@supabase/supabase-js'

// Clean URL in case /rest/v1 or trailing slashes are appended
const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eaupnggxhmkadixnvxyw.supabase.co'
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase Anon Key is missing! Please add VITE_SUPABASE_ANON_KEY to your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
