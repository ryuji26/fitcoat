'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { MapPin, X } from 'lucide-react'

// 日本地図のブロックレイアウト（4行x4列のCSS gridに配置）
const REGIONS = [
    { id: 'hokkaido', name: '北海道', prefs: ['北海道'], col: 'col-start-4', row: 'row-start-1' },
    { id: 'tohoku', name: '東北', prefs: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'], col: 'col-start-4', row: 'row-start-2' },
    { id: 'kanto', name: '関東', prefs: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'], col: 'col-start-4', row: 'row-start-3' },
    { id: 'hokushinetsu', name: '北信越', prefs: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県'], col: 'col-start-3', row: 'row-start-2' },
    { id: 'tokai', name: '東海', prefs: ['岐阜県', '静岡県', '愛知県', '三重県'], col: 'col-start-3', row: 'row-start-3' },
    { id: 'kansai', name: '関西', prefs: ['滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'], col: 'col-start-2', row: 'row-start-3' },
    { id: 'chugoku', name: '中国', prefs: ['鳥取県', '島根県', '岡山県', '広島県', '山口県'], col: 'col-start-1', row: 'row-start-3' },
    { id: 'shikoku', name: '四国', prefs: ['徳島県', '香川県', '愛媛県', '高知県'], col: 'col-start-2', row: 'row-start-4' },
    { id: 'kyushu', name: '九州・沖縄', prefs: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'], col: 'col-start-1', row: 'row-start-4' },
]

export function JapanMapSelector({ isIndependentOnly }: { isIndependentOnly: boolean }) {
    const router = useRouter()
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null)

    const selectedRegion = REGIONS.find(r => r.id === selectedRegionId)

    const handlePrefClick = (pref: string) => {
        const query = new URLSearchParams()
        query.set('area', pref)
        if (isIndependentOnly) {
            query.set('independent_only', 'true')
        }
        router.push(`/search?${query.toString()}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl mx-auto mt-16 flex flex-col items-center"
        >
            <h3 className="text-gray-400 tracking-[0.2em] text-sm mb-8 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#cda35e]" />
                エリアから探す
            </h3>

            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md">
                <div className="grid grid-cols-4 grid-rows-4 gap-2 sm:gap-3 p-2">
                    {REGIONS.map(region => (
                        <button
                            key={region.id}
                            onClick={() => setSelectedRegionId(region.id === selectedRegionId ? null : region.id)}
                            className={`
                                ${region.col} ${region.row}
                                flex items-center justify-center
                                py-4 sm:py-5 px-1
                                text-xs sm:text-sm tracking-widest font-serif
                                border transition-all duration-300
                                ${selectedRegionId === region.id
                                    ? 'border-[#cda35e] text-[#cda35e] bg-[#cda35e]/10 shadow-[0_0_15px_rgba(205,163,94,0.15)] scale-[1.02]'
                                    : 'border-gray-800 text-gray-400 bg-[#161616] hover:border-gray-500 hover:text-gray-200'}
                            `}
                        >
                            {region.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* 都道府県プロンプト */}
            <AnimatePresence>
                {selectedRegion && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full mt-8 overflow-hidden"
                    >
                        <div className="border border-gray-800 bg-[#111] p-6 relative">
                            <button
                                onClick={() => setSelectedRegionId(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h4 className="text-gray-300 tracking-widest mb-6 font-serif border-b border-gray-800 pb-3 flex items-center gap-2">
                                <span className="w-2 h-2 bg-[#cda35e] rounded-full" />
                                {selectedRegion.name}の都道府県
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                {selectedRegion.prefs.map(pref => (
                                    <button
                                        key={pref}
                                        onClick={() => handlePrefClick(pref)}
                                        className="text-sm tracking-widest text-gray-400 hover:text-[#cda35e] border border-gray-800 bg-[#161616] hover:border-[#cda35e]/50 hover:bg-[#cda35e]/5 py-3 transition-colors"
                                    >
                                        {pref}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
