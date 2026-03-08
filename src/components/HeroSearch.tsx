'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export function HeroSearch() {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden bg-black px-6 py-32">
            {/* Spotlight & Glide (かすかなシルバー/アイシーブルーのラジアルグラデーション) */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(200, 220, 240, 0.05) 0%, rgba(0,0,0,0) 65%)'
                }}
            />

            {/* 車のボディの艶・エッジを表現する繊細な光のライン */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-gray-500/20 to-transparent" />

            {/* コンテンツエリア (贅沢な余白と幅の制御) */}
            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center space-y-24">

                {/* キャッチコピー */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} // 高級感のある滑らかなイージング
                    className="space-y-6"
                >
                    <h1 className="text-3xl md:text-[44px] font-serif font-light tracking-[0.15em] text-gray-200 leading-[1.8]">
                        <span className="block mb-2">全国の輝きを集めた、</span>
                        <span className="block text-white">至高のコーティング・ポータル。</span>
                    </h1>
                </motion.div>

                {/* Intent-Driven Search Form */}
                <motion.form
                    action="/search"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-2xl relative space-y-4"
                >
                    <div className="relative">
                        {/* フォーカス時の上品な光彩（リング状のグロウエフェクト） */}
                        <motion.div
                            className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-gray-500/0 via-gray-300/40 to-gray-500/0 blur-md pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isFocused ? 1 : 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        />

                        {/* ミニマルな検索入力エリア */}
                        <div className="relative flex items-center w-full bg-[#0a0a0a] border border-gray-800 rounded-full overflow-hidden transition-colors duration-500 hover:border-gray-600 focus-within:border-gray-400 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                            <div className="pl-6 pr-3 text-gray-500 flex items-center gap-2 border-r border-gray-800">
                                <Search className="w-5 h-5 shrink-0" />
                                <select
                                    name="area"
                                    className="bg-transparent text-gray-300 outline-none text-sm tracking-widest cursor-pointer py-6 appearance-none pr-4 [&>option]:bg-[#111] [&>option]:text-gray-300"
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                >
                                    <option value="">全国</option>
                                    <option value="北海道">北海道</option>
                                    <option value="青森県">青森県</option>
                                    <option value="岩手県">岩手県</option>
                                    <option value="宮城県">宮城県</option>
                                    <option value="秋田県">秋田県</option>
                                    <option value="山形県">山形県</option>
                                    <option value="福島県">福島県</option>
                                    <option value="茨城県">茨城県</option>
                                    <option value="栃木県">栃木県</option>
                                    <option value="群馬県">群馬県</option>
                                    <option value="埼玉県">埼玉県</option>
                                    <option value="千葉県">千葉県</option>
                                    <option value="東京都">東京都</option>
                                    <option value="神奈川県">神奈川県</option>
                                    <option value="新潟県">新潟県</option>
                                    <option value="富山県">富山県</option>
                                    <option value="石川県">石川県</option>
                                    <option value="福井県">福井県</option>
                                    <option value="山梨県">山梨県</option>
                                    <option value="長野県">長野県</option>
                                    <option value="岐阜県">岐阜県</option>
                                    <option value="静岡県">静岡県</option>
                                    <option value="愛知県">愛知県</option>
                                    <option value="三重県">三重県</option>
                                    <option value="滋賀県">滋賀県</option>
                                    <option value="京都府">京都府</option>
                                    <option value="大阪府">大阪府</option>
                                    <option value="兵庫県">兵庫県</option>
                                    <option value="奈良県">奈良県</option>
                                    <option value="和歌山県">和歌山県</option>
                                    <option value="鳥取県">鳥取県</option>
                                    <option value="島根県">島根県</option>
                                    <option value="岡山県">岡山県</option>
                                    <option value="広島県">広島県</option>
                                    <option value="山口県">山口県</option>
                                    <option value="徳島県">徳島県</option>
                                    <option value="香川県">香川県</option>
                                    <option value="愛媛県">愛媛県</option>
                                    <option value="高知県">高知県</option>
                                    <option value="福岡県">福岡県</option>
                                    <option value="佐賀県">佐賀県</option>
                                    <option value="長崎県">長崎県</option>
                                    <option value="熊本県">熊本県</option>
                                    <option value="大分県">大分県</option>
                                    <option value="宮崎県">宮崎県</option>
                                    <option value="鹿児島県">鹿児島県</option>
                                    <option value="沖縄県">沖縄県</option>
                                </select>
                            </div>
                            <input
                                type="text"
                                name="q"
                                placeholder="地名・キーワードでショップを探す"
                                className="w-full bg-transparent text-gray-200 py-6 px-4 outline-none font-light tracking-[0.1em] placeholder:text-gray-600 text-sm md:text-base"
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                            <button type="submit" className="pr-6 pl-4 py-6 text-sm tracking-widest text-[#cda35e] hover:text-white transition-colors shrink-0">
                                検索
                            </button>
                        </div>
                    </div>

                    {/* フィルタオプション（独立系のみ表示） */}
                    <div className="flex justify-center items-center gap-2 pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    name="independent_only"
                                    value="true"
                                    className="peer appearance-none w-4 h-4 border border-gray-600 rounded-sm bg-[#111] checked:bg-[#cda35e] checked:border-[#cda35e] transition-colors cursor-pointer"
                                    defaultChecked
                                />
                                <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <span className="text-xs text-gray-400 tracking-wider group-hover:text-gray-300 transition-colors mt-0.5">
                                チェーン店を除外（独立系専門店のみ表示）
                            </span>
                        </label>
                    </div>
                </motion.form>
            </div>
        </section>
    )
}
