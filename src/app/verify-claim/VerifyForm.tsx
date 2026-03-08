'use client'

import { useState, useTransition } from 'react'
import { verifyAndSetupAccount } from './actions'
import { Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function VerifyForm({ token }: { token: string }) {
    const [isPending, startTransition] = useTransition()
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    async function onSubmit(formData: FormData) {
        setErrorMsg(null)
        formData.append('token', token) // フォームデータに裏でトークンを追加

        startTransition(async () => {
            const result = await verifyAndSetupAccount(formData)
            if (result.success) {
                setIsSuccess(true)
            } else {
                setErrorMsg(result.error || '登録処理に失敗しました。')
            }
        })
    }

    if (isSuccess) {
        return (
            <div className="bg-cyan-950/20 border border-cyan-800/50 p-8 md:p-12 text-center space-y-6 animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-cyan-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-cyan-400" />
                </div>
                <h2 className="text-xl tracking-widest text-white font-light">本登録が完了しました</h2>
                <p className="text-sm tracking-wider text-gray-400 leading-relaxed max-w-sm mx-auto">
                    FitCoat（フィットコート）の店舗管理者用アカウントの作成が完了し、店舗ページとの権限紐付けを行いました。<br />
                    今後はこちらにご登録いただいたメールアドレスにてログインが可能です。
                </p>
                <div className="pt-8">
                    <Link
                        href="/"
                        className="inline-block border border-gray-600 px-10 py-4 text-xs tracking-widest hover:bg-white hover:text-black transition-colors"
                    >
                        マイページ（ダッシュボード）へ進む
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#111] border border-gray-800 p-8 md:p-12 relative overflow-hidden shadow-2xl">
            {/* 背景の光彩効果 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-900/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#cda35e] to-transparent opacity-50" />

            <form action={onSubmit} className="space-y-8 relative z-10 animate-in fade-in">
                {/* メールアドレス */}
                <div className="space-y-2 group">
                    <label htmlFor="email" className="text-xs text-[#cda35e] tracking-[0.1em]">
                        ログイン用 メールアドレス <span className="text-red-500/80">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="admin@yourshop.com"
                            className="w-full bg-[#161616] border border-gray-800 text-gray-200 text-sm py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:border-cyan-800 focus:ring-1 focus:ring-cyan-800/50 placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* パスワード */}
                <div className="space-y-2 group">
                    <label htmlFor="password" className="text-xs text-[#cda35e] tracking-[0.1em]">
                        ログイン用 パスワード（6文字以上） <span className="text-red-500/80">*</span>
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-colors group-focus-within:text-cyan-600" />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            minLength={6}
                            placeholder="••••••••"
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
                            アカウントを作成中...
                        </span>
                    ) : (
                        <span>パスワードを設定して本登録を完了する</span>
                    )}
                </button>
            </form>
        </div>
    )
}
