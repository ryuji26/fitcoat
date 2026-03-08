'use server'

import { createClient } from '@supabase/supabase-js'

export async function submitClaimRequest(formData: FormData) {
    // 環境変数がサーバーサイドで利用可能か確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return { success: false, error: 'Database configuration missing' }
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const shopId = formData.get('shop_id') as string
    const applicantName = formData.get('applicant_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    // 簡単なバリデーション
    if (!shopId || !applicantName || !email || !phone) {
        return { success: false, error: 'すべての項目を入力してください' }
    }

    try {
        const { error } = await supabase
            .from('claim_requests')
            .insert([
                {
                    shop_id: shopId,
                    applicant_name: applicantName,
                    email: email,
                    phone: phone,
                    // status はDB側でデフォルト 'pending'
                }
            ])

        if (error) {
            console.error('Supabase Insert Error:', error.message)
            return { success: false, error: '予期せぬエラーが発生しました' }
        }

        return { success: true }
    } catch (error) {
        console.error('Submission Error:', error)
        return { success: false, error: 'ネットワークエラーが発生しました' }
    }
}
