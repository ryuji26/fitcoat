import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase() {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase URL and Anon Key must be defined in environment variables')
        }

        _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _supabase
}

// 後方互換: 既存の import { supabase } を利用するコード向け
// ※ビルド時（SSG）には呼び出されないように注意
export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
        return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop]
    },
})
