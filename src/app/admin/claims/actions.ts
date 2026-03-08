'use server'

import { createClient } from '@supabase/supabase-js'

export async function generateAuthToken(claimId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Database configuration missing' }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Token (UUID) と有効期限(24時間後)を生成
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    try {
        const { error } = await supabase
            .from('claim_requests_v3')
            .update({ token, token_expires_at: expiresAt })
            .eq('id', claimId)

        if (error) {
            console.error('Supabase Update Error:', error.message)
            return { success: false, error: 'トークン発行に失敗しました' }
        }

        return { success: true, token }
    } catch (error) {
        console.error('Submission Error:', error)
        return { success: false, error: 'ネットワークエラーが発生しました' }
    }
}

// 掲載取り下げ依頼を「対応済み（削除完了）」としてマークするアクション
export async function markClaimAsResolved(claimId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Database configuration missing' }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
        const { error } = await supabase
            .from('claim_requests_v3')
            .update({ status: 'approved' }) // 取り下げ完了としてマーク
            .eq('id', claimId)

        if (error) {
            console.error('Supabase Update Error:', error.message)
            return { success: false, error: '状態の更新に失敗しました' }
        }

        return { success: true }
    } catch (error) {
        console.error('Submission Error:', error)
        return { success: false, error: 'ネットワークエラーが発生しました' }
    }
}

// 許可しない（間違った申請等）をデータベースから完全に削除するアクション
export async function deleteClaimRequest(claimId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Database configuration missing' }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    try {
        const { error } = await supabase
            .from('claim_requests_v3')
            .delete()
            .eq('id', claimId)

        if (error) {
            console.error('Supabase Delete Error:', error.message)
            return { success: false, error: '削除に失敗しました' }
        }

        return { success: true }
    } catch (error) {
        console.error('Delete Error:', error)
        return { success: false, error: 'ネットワークエラーが発生しました' }
    }
}
