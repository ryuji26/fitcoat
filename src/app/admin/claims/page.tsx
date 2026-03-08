import { getSupabase } from '@/utils/supabase/client'
import AdminClaimsClient from './AdminClaimsClient'

// 常に最新データを取得するため
export const dynamic = 'force-dynamic'

export default async function AdminClaimsPage() {
    const supabase = getSupabase()

    // 'pending' (未処理) な申請のみを取得し、新しい順で表示
    const { data: claims, error } = await supabase
        .from('claim_requests_v3')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Failed to fetch claims:', error)
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-200 py-20 px-6">
            <div className="max-w-5xl mx-auto space-y-16">

                <header className="space-y-4 border-b border-gray-800/60 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-700 animate-pulse"></span>
                        <span className="text-xs tracking-[0.3em] font-light text-cyan-700">FITCOAT STAFF ONLY</span>
                    </div>
                    <h1 className="text-3xl font-serif font-light tracking-[0.15em] text-white">
                        ADMIN DASHBOARD
                    </h1>
                    <p className="text-sm tracking-wider text-gray-400 leading-relaxed max-w-2xl">
                        未対応のオーナー権限申請および掲載取り下げ依頼の一覧です。<br />
                        権限申請の場合、ここで発行した「24時間有効の認証URL」をコピーし、店舗のお問い合わせフォームや公式LINE等から手動で送信してください。
                    </p>
                </header>

                {/* クライアント側でインタラクティブなリスト表示を処理 */}
                <AdminClaimsClient initialClaims={claims || []} />

            </div>
        </div>
    )
}
