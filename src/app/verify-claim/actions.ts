'use server'

import { createClient } from '@supabase/supabase-js'

export async function verifyAndSetupAccount(formData: FormData) {
    const token = formData.get('token') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!token || !email || !password) {
        return { success: false, error: 'すべての項目を入力してください' }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

    // NOTE: RLSをバイパスして確実かつ安全に `shops` や `claim_requests_v3` を更新するため、
    // 運用時は .env.local に `SUPABASE_SERVICE_ROLE_KEY` を設定してください。
    // なければパブリックキーでフォールバックしますが、RLSポリシーにより更新処理が弾かれる場合があります。
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false // サーバー側でのセッション永続化を無効化（DB操作専用）
        }
    })

    try {
        // 1. トークンの再検証
        const { data: request, error: fetchErr } = await supabase
            .from('claim_requests_v3')
            .select('*')
            .eq('token', token)
            .single()

        if (fetchErr || !request) {
            return { success: false, error: '無効なトークンです。' }
        }

        if (new Date(request.token_expires_at) < new Date() || request.status !== 'pending') {
            return { success: false, error: 'このURLの有効期限が切れているか、すでに使用されています。' }
        }

        // 2. アカウントの作成 (Supabase Auth)
        const { error: authErr } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authErr) {
            console.error('Supabase Auth Info:', authErr)
            return { success: false, error: 'アカウント作成に失敗しました: ' + authErr.message }
        }

        // 3. 申請ステータスの更新 (approved へ変更、トークンの無効化)
        const { error: updateClaimErr } = await supabase
            .from('claim_requests_v3')
            .update({
                status: 'approved',
                token_expires_at: new Date().toISOString() // 即座に期限切れに設定
            })
            .eq('id', request.id)

        if (updateClaimErr) {
            console.error('Claim Status Update ERROR (RLS may apply):', updateClaimErr.message)
        }

        // 4. shopsテーブルの is_claimed を true に更新
        if (request.shop_id) {
            const { error: updateShopErr } = await supabase
                .from('shops')
                .update({ is_claimed: true })
                .eq('id', request.shop_id)

            if (updateShopErr) {
                console.error('Shops Update ERROR (RLS may apply):', updateShopErr.message)
            }
        }

        return { success: true }
    } catch (err) {
        console.error('Exception in verifyAndSetupAccount:', err)
        return { success: false, error: '予期せぬネットワークエラーが発生しました。' }
    }
}
