'use client'

import { useState, useTransition, use } from 'react'
import Link from 'next/link'
import { submitClaimRequest } from './actions'
import { ChevronLeft, Building2, User, Mail, Phone, Loader2, CheckCircle2 } from 'lucide-react'

interface ClaimPageProps {
    params: Promise<{ id: string }>
}

export default function ClaimPage(props: ClaimPageProps) {
    // Next.js 15+の仕様対応: paramsは非同期解決する
    const params = use(props.params)

    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function onSubmit(formData: FormData) {
        setErrorMsg(null)
        startTransition(async () => {
            const result = await submitClaimRequest(formData)
            if (result.success) {
                setIsSuccess(true)
            } else {
                setErrorMsg(result.error || '送信に失敗しました')
            }
        })
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 pb-32 pt-20">

            {/* 戻るリンク */}
            <div className="w-full max-w-2xl mb-12">
                <Link
                    href={`/shops/${params.id}`}
                    className="inline-flex items-center gap-2 text-xs tracking-widest text-gray-500 hover:text-[#cda35e] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>店舗詳細へ戻る</span>
                </Link>
            </div>

            <div className="w-full max-w-2xl bg-[#111] border border-gray-800 p-8 md:p-16 relative overflow-hidden">
                {/* 背景のほのかな光彩効果 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* トップのアクセントライン */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#cda35e] to-transparent opacity-50" />

                <div className="relative z-10 space-y-12">

                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-serif font-light tracking-[0.15em] text-white flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-[#cda35e]" />
                            店舗管理者 登録申請
                        </h1>
                        <p className="text-sm font-light text-gray-400 tracking-wider leading-relaxed">
                            ご自身の店舗情報の管理・更新をご希望の方は、下記フォームより申請を行ってください。<br />
                            （※ご本人確認後、正式に管理権限を付与いたします）
                        </p>
                    </div>

                    {isSuccess ? (
                        /* 送信成功メッセージ */
                        <div className="bg-cyan-950/20 border border-cyan-800/50 p-8 text-center space-y-6 animate-in fade-in duration-700">
                            <div className="w-16 h-16 bg-cyan-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h2 className="text-xl tracking-widest text-white font-light">申請を受け付けました</h2>
                            <p className="text-sm tracking-wider text-gray-400 leading-relaxed max-w-sm mx-auto">
                                内容を確認し、運営スタッフよりご入力いただいた連絡先へご案内メールをお送りいたします。
                            </p>
                            <div className="pt-8">
                                <Link
                                    href="/"
                                    className="inline-block border border-gray-600 px-8 py-3 text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                                >
                                    トップページへ戻る
                                </Link>
                            </div>
                        </div>
                    ) : (
                        /* 申請フォーム */
                        <form action={onSubmit} className="space-y-8">
                            <input type="hidden" name="shop_id" value={params.id} />

                            {/* お名前 */}
                            <div className="space-y-2 group">
                                <label htmlFor="applicant_name" className="text-xs text-[#cda35e] tracking-[0.1em]">
                                    お名前 <span className="text-red-500/80">*</span>
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                                    <input
                                        type="text"
                                        id="applicant_name"
                                        name="applicant_name"
                                        required
                                        placeholder="山田 太郎"
                                        className="w-full bg-[#161616] border border-gray-800 text-gray-200 text-sm py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800/50 placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* メールアドレス */}
                            <div className="space-y-2 group">
                                <label htmlFor="email" className="text-xs text-[#cda35e] tracking-[0.1em]">
                                    メールアドレス <span className="text-red-500/80">*</span>
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        placeholder="info@yourshop.com"
                                        className="w-full bg-[#161616] border border-gray-800 text-gray-200 text-sm py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800/50 placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            {/* 電話番号 */}
                            <div className="space-y-2 group">
                                <label htmlFor="phone" className="text-xs text-[#cda35e] tracking-[0.1em]">
                                    電話番号 <span className="text-red-500/80">*</span>
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        required
                                        placeholder="090-1234-5678"
                                        className="w-full bg-[#161616] border border-gray-800 text-gray-200 text-sm py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800/50 placeholder:text-gray-600"
                                    />
                                </div>
                            </div>

                            {errorMsg && (
                                <div className="p-4 bg-red-950/30 border border-red-900/50 text-red-400 text-sm tracking-widest text-center animate-in fade-in">
                                    {errorMsg}
                                </div>
                            )}

                            {/* 送信ボタン */}
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full relative overflow-hidden group bg-gradient-to-r from-gray-200 to-white text-black font-medium tracking-widest py-4 text-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {/* ボタン内のツヤ（ホバー時の光沢）効果 */}
                                <div className="absolute inset-0 w-1/4 h-full bg-white/40 skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-out_infinite] -translate-x-[150%]" />

                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        送信中...
                                    </span>
                                ) : (
                                    <span>登録申請を送信する</span>
                                )}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    )
}
