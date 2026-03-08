import { getSupabase } from "@/utils/supabase/client"
import Link from 'next/link'
import { MapPin, Phone, Search, SlidersHorizontal, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchParams {
    q?: string
    area?: string
    independent_only?: string
    page?: string
}

const ITEMS_PER_PAGE = 30

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<SearchParams>
}) {
    const params = await searchParams
    const keyword = params.q || ''
    const area = params.area || ''
    const independentOnly = params.independent_only === 'true'
    const currentPage = Math.max(1, parseInt(params.page || '1', 10))

    const supabase = getSupabase()

    // 1. 全体の件数を取得するクエリ
    let countQuery = supabase.from('shops').select('*', { count: 'exact', head: true })

    if (area) {
        countQuery = countQuery.ilike('address', `%${area}%`)
    }
    if (keyword) {
        countQuery = countQuery.or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
    }
    if (independentOnly) {
        countQuery = countQuery.eq('is_independent', true)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
        console.error('Count error:', countError)
    }

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    // 2. データの取得クエリ (rangeでページネーション)
    let query = supabase.from('shops').select('*')

    if (area) {
        query = query.ilike('address', `%${area}%`)
    }
    if (keyword) {
        query = query.or(`name.ilike.%${keyword}%,address.ilike.%${keyword}%`)
    }
    if (independentOnly) {
        query = query.eq('is_independent', true)
    }

    const from = (currentPage - 1) * ITEMS_PER_PAGE
    const to = from + ITEMS_PER_PAGE - 1

    const { data: shops, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('Search error:', error)
    }

    // ページネーション用リンク生成関数
    const createPageUrl = (pageNumber: number) => {
        const queryParams = new URLSearchParams()
        if (area) queryParams.set('area', area)
        if (keyword) queryParams.set('q', keyword)
        if (independentOnly) queryParams.set('independent_only', 'true')
        queryParams.set('page', pageNumber.toString())
        return `/search?${queryParams.toString()}`
    }

    return (
        <div className="w-full bg-[#0a0a0a] min-h-screen pb-20">
            {/* 上部の検索バー */}
            <div className="border-b border-gray-800 bg-[#111] pt-24 pb-8 px-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    <Link href="/#search" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        トップページへ戻る
                    </Link>
                    <h1 className="text-2xl font-serif text-white tracking-wider flex items-center gap-3">
                        <Search className="w-6 h-6 text-[#cda35e]" />
                        検索結果
                    </h1>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                        {area && <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">エリア: {area}</span>}
                        {keyword && <span className="bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">キーワード: {keyword}</span>}
                        {independentOnly && <span className="text-[#cda35e] bg-[#cda35e]/10 px-3 py-1 rounded-full border border-[#cda35e]/30 flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5" /> 独立系専門店のみ</span>}
                        {(!area && !keyword && !independentOnly) && <span>すべての店舗</span>}
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8 flex justify-between items-center text-sm text-gray-400">
                    <p>{totalCount} 件のショップが見つかりました</p>
                </div>

                <div className="space-y-6">
                    {shops?.map((shop) => (
                        <Link
                            href={`/shops/${shop.id}`}
                            key={shop.id}
                            className="block group bg-[#161616] border border-gray-800/60 hover:border-gray-600 transition-all duration-300 p-6 sm:p-8"
                        >
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* サムネイル画像（プレースホルダー） */}
                                <div className="w-full sm:w-48 h-32 bg-gray-900 border border-gray-800 shrink-0 overflow-hidden">
                                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=200')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" />
                                </div>

                                {/* テキスト情報 */}
                                <div className="space-y-4 flex-grow">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-xl font-serif tracking-widest text-gray-200 group-hover:text-white transition-colors">
                                                {shop.name}
                                            </h2>
                                            {shop.is_independent && (
                                                <span className="text-[10px] tracking-widest px-2 py-0.5 border border-[#cda35e]/30 text-[#cda35e] bg-[#cda35e]/5 rounded-sm shrink-0">
                                                    独立系専門店
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex text-[#cda35e] gap-1 text-xs">
                                            ★ ★ ★ ★ ☆
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {shop.address && (
                                            <p className="text-sm text-gray-400 tracking-wider flex items-start gap-2">
                                                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{shop.address}</span>
                                            </p>
                                        )}
                                        {shop.phone && (
                                            <p className="text-sm text-gray-400 tracking-wider flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-gray-500" />
                                                <span>{shop.phone}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {shops?.length === 0 && (
                        <div className="py-20 text-center space-y-4">
                            <p className="text-gray-400 tracking-widest">条件に一致する店舗が見つかりませんでした。</p>
                            <p className="text-sm text-gray-600">検索条件を変更して再度お試しください。</p>
                        </div>
                    )}
                </div>

                {/* ページネーションUI */}
                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2">
                        {/* 前へボタン */}
                        {currentPage > 1 && (
                            <Link
                                href={createPageUrl(currentPage - 1)}
                                className="w-10 h-10 flex items-center justify-center border border-gray-800 bg-[#111] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                        )}

                        {/* ページ番号ボタン */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // 現在のページの周辺5ページを表示する簡易ロジック
                            let pageNum = currentPage - 2 + i;
                            if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;

                            // ページ数が5ページ未満の場合への対応
                            if (totalPages < 5) pageNum = i + 1;

                            if (pageNum > 0 && pageNum <= totalPages) {
                                return (
                                    <Link
                                        key={pageNum}
                                        href={createPageUrl(pageNum)}
                                        className={`w-10 h-10 flex items-center justify-center border transition-colors ${currentPage === pageNum
                                                ? 'bg-[#cda35e]/10 text-[#cda35e] border-[#cda35e]/50'
                                                : 'border-gray-800 bg-[#111] text-gray-400 hover:text-white hover:border-gray-500'
                                            }`}
                                    >
                                        {pageNum}
                                    </Link>
                                )
                            }
                            return null;
                        })}

                        {/* 次へボタン */}
                        {currentPage < totalPages && (
                            <Link
                                href={createPageUrl(currentPage + 1)}
                                className="w-10 h-10 flex items-center justify-center border border-gray-800 bg-[#111] text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
