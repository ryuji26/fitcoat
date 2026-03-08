'use server'

import { createClient } from '@supabase/supabase-js'

export async function submitSimpleClaim(formData: FormData) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Database configuration missing' }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const claimType = formData.get('claim_type') as string
    const shopName = formData.get('shop_name') as string
    const applicantName = formData.get('applicant_name') as string
    const shopId = formData.get('shop_id') as string // null許可
    const recaptchaToken = formData.get('recaptcha_token') as string

    // バリデーション
    if (!claimType || !shopName || !applicantName) {
        return { success: false, error: 'すべての項目を入力してください' }
    }

    // reCAPTCHA v3 トークンのサーバー側検証
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY
    if (recaptchaSecret && recaptchaToken) {
        try {
            const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
            })
            const verifyData = await verifyRes.json()

            if (!verifyData.success || verifyData.score < 0.5) {
                console.error('reCAPTCHA verification failed:', verifyData)
                return { success: false, error: 'スパム防止の検証に失敗しました。時間をおいて再度お試しください。' }
            }
        } catch (err) {
            console.error('reCAPTCHA API error:', err)
            // APIエラーの場合は続行（ユーザーをブロックしない）
        }
    }

    try {
        const { error } = await supabase
            .from('claim_requests_v3')
            .insert([
                {
                    claim_type: claimType, // 'claim' (権限申請) または 'remove' (取り下げ)
                    shop_name: shopName,
                    applicant_name: applicantName,
                    shop_id: shopId || null, // 店舗を検索して飛んできた場合は設定される
                }
            ])

        if (error) {
            console.error('Supabase Insert Error:', error.message)
            return { success: false, error: `エラー: ${error.message} (※SQLが実行されているか確認してください)` }
        }

        return { success: true }
    } catch (error) {
        console.error('Submission Error:', error)
        return { success: false, error: 'ネットワークエラーが発生しました' }
    }
}
