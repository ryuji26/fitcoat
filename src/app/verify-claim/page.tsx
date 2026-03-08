import { supabase } from '@/utils/supabase/client'
import VerifyForm from './VerifyForm'
import { Building2, XCircle } from 'lucide-react'

// URLパラメータに依存するため動的レンダリング
export const dynamic = 'force-dynamic'

export default async function VerifyClaimPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const token = typeof resolvedParams.token === 'string' ? resolvedParams.token : null

    if (!token) {
        return <ErrorPage message="有効なURLではありません。認証用リンクを確認してください。" />
    }

    // 1. サーバー側でレンダリング中にトークンを検証
    const { data: request, error: fetchErr } = await supabase
        .from('claim_requests_v3')
        .select('shop_name, token_expires_at, status')
        .eq('token', token)
        .single()

    if (fetchErr || !request) {
        return <ErrorPage message="無効なトークンです。送付されたURLがすべて正しくコピーされているかご確認ください。" />
    }

    // 2. 有効期限（24時間）のチェック
    if (new Date(request.token_expires_at) < new Date()) {
        return <ErrorPage message="このURLの有効期間（24時間）が切れています。再度、運営にお手続きをご申請ください。" />
    }

    // 3. ステータスの適格性チェック
    if (request.status !== 'pending') {
        return <ErrorPage message="このURLは既に使用され本登録が完了しているか、期限切れのため無効になっています。" />
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 px-6">
            <div className="w-full max-w-2xl space-y-12">

                <div className="text-center space-y-6">
                    <Building2 className="w-10 h-10 text-[#cda35e] mx-auto mb-6" />
                    <h1 className="text-2xl md:text-3xl font-serif font-light tracking-[0.15em] text-white">
                        オーナーアカウント（本登録）
                    </h1>
                    <p className="text-sm text-gray-400 tracking-wider leading-relaxed">
                        ようこそ。「{request.shop_name}」の管理者用アカウントを作成します。<br />
                        今後ログインに使用する<b>メールアドレス</b>と<b>パスワード</b>を入力してください。<br />
                    </p>
                </div>

                {/* クライアントコンポーネント（入力を受け付けるフォーム自体） */}
                <VerifyForm token={token} />

            </div>
        </div>
    )
}

function ErrorPage({ message }: { message: string }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-32 px-6">
            <div className="w-full max-w-xl text-center space-y-8 bg-[#111] border border-gray-800 p-12 shadow-2xl">
                <div className="w-16 h-16 bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-light tracking-[0.1em] text-white">リンクエラー</h1>
                <p className="text-sm text-gray-400 tracking-wider leading-relaxed pb-4">
                    {message}
                </p>
            </div>
        </div>
    )
}
