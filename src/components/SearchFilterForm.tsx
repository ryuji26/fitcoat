'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'

interface SearchFilterFormProps {
    initialKeyword: string
    initialArea: string
    initialIndependentOnly: boolean
}

export function SearchFilterForm({ initialKeyword, initialArea, initialIndependentOnly }: SearchFilterFormProps) {
    const router = useRouter()
    const [keyword, setKeyword] = useState(initialKeyword)
    const [area, setArea] = useState(initialArea)
    const [isIndependentOnly, setIsIndependentOnly] = useState(initialIndependentOnly)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const query = new URLSearchParams()
        if (keyword) query.set('q', keyword)
        if (area) query.set('area', area)
        if (isIndependentOnly) query.set('independent_only', 'true')

        router.push(`/search?${query.toString()}`)
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col md:flex-row gap-4 items-center">
            {/* エリア入力 */}
            <div className="relative w-full md:w-48 bg-[#161616] border border-gray-800 rounded-md overflow-hidden focus-within:border-gray-500 transition-colors">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="都道府県・エリア"
                    className="w-full bg-transparent text-gray-200 py-3 pl-10 pr-4 outline-none text-sm placeholder:text-gray-600"
                />
            </div>

            {/* キーワード入力 */}
            <div className="relative w-full md:flex-grow bg-[#161616] border border-gray-800 rounded-md overflow-hidden focus-within:border-gray-500 transition-colors">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <Search className="w-4 h-4" />
                </div>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="ショップ名やキーワード"
                    className="w-full bg-transparent text-gray-200 py-3 pl-10 pr-4 outline-none text-sm placeholder:text-gray-600"
                />
            </div>

            {/* 独立系トグル & 検索ボタン */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-end gap-6 shrink-0">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                        <input
                            type="checkbox"
                            checked={isIndependentOnly}
                            onChange={(e) => setIsIndependentOnly(e.target.checked)}
                            className="peer appearance-none w-4 h-4 border border-gray-600 rounded-sm bg-[#111] checked:bg-[#cda35e] checked:border-[#cda35e] transition-colors cursor-pointer"
                        />
                        <svg className="absolute w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <span className="text-xs text-gray-400 tracking-wider group-hover:text-gray-300 transition-colors">
                        独立系専門店のみ
                    </span>
                </label>

                <button
                    type="submit"
                    className="bg-[#cda35e] hover:bg-[#b08945] text-black text-sm font-bold tracking-widest py-3 px-6 rounded-md transition-colors"
                >
                    再検索
                </button>
            </div>
        </form>
    )
}
