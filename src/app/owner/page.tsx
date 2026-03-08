'use client'

import { useState, useTransition, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { submitSimpleClaim } from './actions'
import { Building2, User, Loader2, CheckCircle2, Search } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import ReCaptchaProvider from '@/components/ReCaptchaProvider'

// URLパラメータを読み取るためのクライアントコンポーネント
function ClaimForm() {
    const searchParams = useSearchParams()
    const initialShopName = searchParams?.get('shop_name') || ''
    const initialShopId = searchParams?.get('shop_id') || ''

    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [claimType, setClaimType] = useState('claim') // 'claim' or 'remove'
    const { executeRecaptcha } = useGoogleReCaptcha()

    const onSubmit = useCallback(async (formData: FormData) => {
        setErrorMsg(null)

        // reCAPTCHA v3 トークンを取得
        let recaptchaToken = ''
        if (executeRecaptcha) {
            try {
                recaptchaToken = await executeRecaptcha('submit_claim')
            } catch {
                setErrorMsg('reCAPTCHAの検証に失敗しました。ページを再読み込みしてください。')
                return
            }
        }
        formData.append('recaptcha_token', recaptchaToken)

        startTransition(async () => {
            const result = await submitSimpleClaim(formData)
            if (result.success) {
                setIsSuccess(true)
            } else {
                setErrorMsg(result.error || '送信に失敗しました')
            }
        })
    }, [executeRecaptcha])

    if (isSuccess) {
        return (
            <div className="bg-cyan-950/20 border border-cyan-800/50 p-8 md:p-12 text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-cyan-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-xl tracking-widest text-white font-light">申請を受け付けました</h2>
                <p className="text-sm tracking-wider text-gray-400 leading-relaxed max-w-sm mx-auto">
                    内容を確認し、運営事務局よりご本人様確認および本登録（認証URL）のご案内をご連絡いたします。<br />
                    しばらくお待ちください。
                </p>
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto border border-gray-600 px-8 py-3 text-xs tracking-widest text-white hover:bg-white hover:text-black transition-colors"
                    >
                        トップページへ戻る
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <form action={onSubmit} className="space-y-8 animate-in fade-in">
            {/* 店舗からの遷移時に保持するshop_id */}
            <input type="hidden" name="shop_id" value={initialShopId} />

            {/* ご要望の種別 (ラジオボタン) */}
            <div className="space-y-3">
                <label className="text-xs text-[#cda35e] tracking-[0.1em]">
                    ご要望の種別 <span className="text-red-500/80">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label
                        className={`relative flex items-center justify-center gap-3 p-4 border cursor-pointer transition-all duration-300 ${claimType === 'claim' ? 'border-[#cda35e] bg-[#cda35e]/10 text-white' : 'border-gray-800 bg-[#161616] text-gray-400 hover:border-gray-600'}`}
                        onClick={() => setClaimType('claim')}
                    >
                        <input type="radio" name="claim_type" value="claim" className="sr-only" checked={claimType === 'claim'} readOnly />
                        <span className="text-sm tracking-widest font-medium">管理権限の申請</span>
                    </label>
                    <label
                        className={`relative flex items-center justify-center gap-3 p-4 border cursor-pointer transition-all duration-300 ${claimType === 'remove' ? 'border-red-500/50 bg-red-950/20 text-white' : 'border-gray-800 bg-[#161616] text-gray-400 hover:border-gray-600'}`}
                        onClick={() => setClaimType('remove')}
                    >
                        <input type="radio" name="claim_type" value="remove" className="sr-only" checked={claimType === 'remove'} readOnly />
                        <span className="text-sm tracking-widest font-medium">掲載の取り下げ</span>
                    </label>
                </div>
            </div>

            {/* ショップ名 */}
            <div className="space-y-2 group">
                <label htmlFor="shop_name" className="text-xs text-[#cda35e] tracking-[0.1em]">
                    ショップ名 <span className="text-red-500/80">*</span>
                </label>
                <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                    <input
                        type="text"
                        id="shop_name"
                        name="shop_name"
                        defaultValue={initialShopName}
                        required
                        placeholder="例：匠コーティング 東京本店"
                        className="w-full bg-[#161616] border border-gray-800 text-gray-200 text-sm py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800/50 placeholder:text-gray-600"
                    />
                </div>
                <p className="text-[10px] text-gray-500 tracking-wider pt-1 pl-1">
                    ※正式名称でのご入力をお願いいたします。
                </p>
            </div>

            {/* お名前 */}
            <div className="space-y-2 group">
                <label htmlFor="applicant_name" className="text-xs text-[#cda35e] tracking-[0.1em]">
                    お名前 (ご担当者様) <span className="text-red-500/80">*</span>
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                    <input
                        type="text"
                        id="applicant_name"
                        name="applicant_name"
                        required
                        placeholder="例：山田 太郎"
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
                className="w-full relative overflow-hidden group bg-gradient-to-r from-gray-200 to-white text-black font-medium tracking-widest py-4 text-sm disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
            >
                <div className="absolute inset-0 w-1/4 h-full bg-white/40 skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-out_infinite] -translate-x-[150%]" />

                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        送信中...
                    </span>
                ) : (
                    <span>{claimType === 'claim' ? '登録申請を送信する' : '掲載取り下げを依頼する'}</span>
                )}
            </button>

            <div className="text-center pt-6">
                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 text-xs tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                    <Search className="w-3.5 h-3.5" />
                    <span>店舗を検索して事前に入力する</span>
                </Link>
            </div>
        </form>
    )
}

// メインページコンポーネント
export default function OwnerEntryPage() {
    return (
        <ReCaptchaProvider>
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center py-20 px-6">
                <div className="w-full max-w-2xl space-y-12">

                    <div className="text-center space-y-6">
                        <Building2 className="w-10 h-10 text-[#cda35e] mx-auto mb-6" />
                        <h1 className="text-2xl md:text-3xl font-serif font-light tracking-[0.15em] text-white">
                            店舗管理者 登録・ お問い合わせ
                        </h1>
                        <p className="text-sm text-gray-400 tracking-wider leading-relaxed">
                            ご自身の店舗ページの管理・更新や、掲載に関するお問い合わせフォームです。<br />
                            申請内容を確認でき次第、運営よりご案内をご連絡いたします。<br />
                        </p>
                    </div>

                    <div className="bg-[#111] border border-gray-800 p-8 md:p-12 relative overflow-hidden shadow-2xl">
                        {/* 背景のほのかな光彩効果 */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#cda35e] to-transparent opacity-50" />

                        <div className="relative z-10">
                            {/* SuspenseでラップしてuseSearchParamsの静的ビルドエラーを防ぐ */}
                            <Suspense fallback={
                                <div className="py-20 flex justify-center text-gray-500">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            }>
                                <ClaimForm />
                            </Suspense>
                        </div>
                    </div>

                </div>
            </div>
        </ReCaptchaProvider>
    )
}
