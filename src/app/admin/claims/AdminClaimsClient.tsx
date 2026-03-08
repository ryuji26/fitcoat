'use client'

import { useState, useEffect } from 'react'
import { generateAuthToken, markClaimAsResolved, deleteClaimRequest } from './actions'
import { Copy, CheckCircle2, Loader2, Building2, Trash2, XCircle } from 'lucide-react'

// DBから取得する型の簡易定義
type Claim = {
    id: string
    shop_name: string
    applicant_name: string
    claim_type: string
    status: string
    created_at: string
    token?: string
}

export default function AdminClaimsClient({ initialClaims }: { initialClaims: Claim[] }) {
    const [claims, setClaims] = useState(initialClaims)
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [isMounted, setIsMounted] = useState(false)

    // URL組み立てのため、クライアントサイドでのマウント後にドメインを取得
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true)
    }, [])

    const currentOrigin = isMounted ? window.location.origin : ''

    const handleGenerateURL = async (id: string) => {
        setLoadingId(id)
        const res = await generateAuthToken(id)
        setLoadingId(null)

        if (res.success && res.token) {
            // 画面上のリストを更新してトークン発行済み状態にする
            setClaims(claims.map(c => c.id === id ? { ...c, token: res.token } : c))
        } else {
            alert(res.error || 'エラーが発生しました')
        }
    }

    const handleCopy = (token: string) => {
        const url = `${currentOrigin}/verify-claim?token=${token}`
        navigator.clipboard.writeText(url)
        setCopiedToken(token)
        setTimeout(() => setCopiedToken(null), 3000)
    }

    const handleResolveRemoveRequest = async (id: string, shopName: string) => {
        if (!window.confirm(`「${shopName}」の掲載取り下げ対応は完了しましたか？\n（※一覧から削除されますが、店舗データ本体は別途お持ちの管理画面などで非掲載処理を行ってください）`)) {
            return
        }

        setLoadingId(id)
        const res = await markClaimAsResolved(id)
        setLoadingId(null)

        if (res.success) {
            // 画面上のリストから該当の依頼を削除（完了扱い）
            setClaims(claims.filter(c => c.id !== id))
        } else {
            alert(res.error || 'エラーが発生しました')
        }
    }

    const handleDeleteClaim = async (id: string, shopName: string) => {
        if (!window.confirm(`「${shopName}」からの申請を本当に削除しますか？\n（この操作は元に戻せません）`)) {
            return
        }

        setLoadingId(id)
        const res = await deleteClaimRequest(id)
        setLoadingId(null)

        if (res.success) {
            // 画面上のリストから該当の依頼を物理削除
            setClaims(claims.filter(c => c.id !== id))
        } else {
            alert(res.error || 'エラーが発生しました')
        }
    }

    if (claims.length === 0) {
        return (
            <div className="bg-[#111] border border-gray-800 p-12 text-center text-gray-400 tracking-wider font-light">
                現在、対応待ちの申請はありません。
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {claims.map((claim) => (
                <div key={claim.id} className="relative bg-[#111] border border-gray-800 p-8 flex flex-col lg:flex-row gap-8 justify-between lg:items-center transition-all hover:border-gray-700">

                    {/* ゴミ箱（削除）ボタンを右上に配置 */}
                    <button
                        onClick={() => handleDeleteClaim(claim.id, claim.shop_name)}
                        disabled={loadingId === claim.id}
                        className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="この申請を削除する"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>

                    <div className="space-y-4 flex-grow">
                        <div className="flex items-center gap-4 mb-2">
                            <span className={`text-[10px] px-3 py-1.5 tracking-widest uppercase ${claim.claim_type === 'remove' ? 'bg-red-950/40 text-red-500 border border-red-900/50' : 'bg-[#cda35e]/10 text-[#cda35e] border border-[#cda35e]/30'}`}>
                                {claim.claim_type === 'remove' ? 'Remove Request' : 'Claim Request'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                                {new Date(claim.created_at).toLocaleString('ja-JP')}
                            </span>
                        </div>
                        <h3 className="text-2xl text-white font-serif font-light tracking-[0.1em] flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-gray-600" />
                            {claim.shop_name}
                        </h3>
                        <p className="text-sm text-gray-400 tracking-wider flex items-center gap-2">
                            <span className="text-gray-600">申請者:</span> {claim.applicant_name}
                        </p>
                    </div>

                    <div className="w-full lg:w-auto shrink-0">
                        {claim.claim_type === 'remove' ? (
                            // ▼ 取り下げ依頼の場合のUI
                            <button
                                onClick={() => handleResolveRemoveRequest(claim.id, claim.shop_name)}
                                disabled={loadingId === claim.id}
                                className="w-full lg:w-auto px-8 py-4 border border-red-900/50 bg-red-950/20 text-red-500 text-sm tracking-widest hover:bg-red-950/40 hover:border-red-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex gap-2 items-center justify-center"
                            >
                                {loadingId === claim.id ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        更新中...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        対応済みにする (一覧から消去)
                                    </>
                                )}
                            </button>
                        ) : (
                            // ▼権限申請の場合のUI
                            claim.token ? (
                                <div className="bg-[#161616] border border-gray-800 p-5 space-y-4 w-full lg:min-w-[420px]">
                                    <p className="text-xs text-[#cda35e] tracking-widest flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        24時間有効 URL発行完了
                                    </p>
                                    <div className="bg-black border border-gray-800 px-4 py-3 text-xs text-gray-400 font-mono break-all line-clamp-2">
                                        {`${currentOrigin}/verify-claim?token=${claim.token}`}
                                    </div>
                                    <button
                                        onClick={() => handleCopy(claim.token!)}
                                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-gray-200 to-white text-black py-3 text-xs tracking-widest font-medium hover:scale-[1.02] transition-transform"
                                    >
                                        {copiedToken === claim.token ? (
                                            <><CheckCircle2 className="w-4 h-4 text-green-600" /> コピー完了しました</>
                                        ) : (
                                            <><Copy className="w-4 h-4" /> URLをコピーして送信する</>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleGenerateURL(claim.id)}
                                    disabled={loadingId === claim.id}
                                    className="w-full lg:w-auto px-8 py-4 border border-[#cda35e]/60 bg-transparent text-[#cda35e] text-sm tracking-widest hover:bg-[#cda35e]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex gap-2 items-center justify-center"
                                >
                                    {loadingId === claim.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            発行中...
                                        </>
                                    ) : (
                                        <>
                                            <span className="w-2 h-2 rounded-full bg-[#cda35e] group-hover:scale-150 transition-transform hidden lg:block" />
                                            24時間認証URLを発行する
                                        </>
                                    )}
                                </button>
                            )
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
