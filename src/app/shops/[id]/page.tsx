import { supabase } from "@/utils/supabase/client"
import Link from 'next/link'
import { MapPin, Phone, Globe, Navigation, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

// 1. 動的なSEOメタデータの生成（generateMetadata）
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const { data: shop } = await supabase
        .from('shops')
        .select('name, address')
        .eq('id', resolvedParams.id)
        .single()

    if (!shop) {
        return {
            title: '店舗が見つかりません | FitCoat',
        }
    }

    return {
        title: `${shop.name}のコーティング料金・評判 | FitCoat`,
        description: `${shop.address}にある高級カーコーティング専門店「${shop.name}」の詳細情報。至高の輝きと確かな技術力を持つFitCoat認定ショップです。`,
    }
}

export default async function ShopDetailPage({ params }: PageProps) {
    const resolvedParams = await params;

    // 指定されたIDの店舗データを取得
    const { data: shop, error } = await supabase
        .from('shops')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

    if (error || !shop) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a]">
            {/* パンくずリスト & 戻るボタン */}
            <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs tracking-widest text-gray-500 hover:text-[#cda35e] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>BACK TO LIST</span>
                </Link>
            </div>

            <article className="max-w-5xl mx-auto px-6 pb-32 space-y-24">
                {/* === ヘッダーエリア === */}
                <header className="relative pt-20 pb-16 px-8 md:px-16 border border-gray-800/60 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                    {/* 四隅のゴールドアクセント */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[#cda35e]/40"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[#cda35e]/40"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[#cda35e]/40"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[#cda35e]/40"></div>

                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="w-5 h-5 text-[#cda35e]" />
                        <span className="text-xs tracking-[0.3em] font-light text-[#cda35e]">AUTHORIZED DEALER</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif font-light tracking-wider text-gray-100 leading-tight mb-10">
                        {shop.name}
                    </h1>

                    <div className="flex flex-wrap gap-4 pt-10 border-t border-gray-800/40">
                        {shop.google_maps_url && (
                            <a
                                href={shop.google_maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-xs md:text-sm font-medium tracking-widest transition-all duration-300 hover:bg-gray-200 w-full sm:w-auto"
                            >
                                <Navigation className="w-4 h-4" />
                                <span>Google Mapsで開く</span>
                            </a>
                        )}

                        {shop.website_url && (
                            <a
                                href={shop.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center gap-3 bg-transparent text-gray-300 px-8 py-4 text-xs md:text-sm tracking-widest transition-all duration-300 border border-gray-700 hover:border-gray-400 hover:text-white w-full sm:w-auto"
                            >
                                <Globe className="w-4 h-4 text-gray-400 group-hover:text-white" />
                                <span>公式サイト</span>
                            </a>
                        )}
                    </div>
                </header>

                {/* === Interactive Proof (UI/UX) セクション === */}
                <section className="space-y-12 relative">
                    <div className="flex items-center gap-6 mb-12">
                        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-[0.2em] text-gray-100">
                            PROOF OF QUALITY
                        </h2>
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-800 to-transparent"></div>
                    </div>

                    <p className="text-sm text-gray-400 font-light tracking-wider leading-relaxed max-w-2xl">
                        研ぎ澄まされた技術がもたらす、圧倒的な被膜の艶と深み。
                        施工前と施工後の違いを、あなたの目で直接お確かめください。（※画像上のスライダーを左右に動かしてください）
                    </p>

                    <div className="border border-gray-800/60 p-2 md:p-4 bg-[#0c0c0c] shadow-2xl">
                        <BeforeAfterSlider />
                    </div>
                </section>

                {/* === 詳細情報セクション === */}
                <section className="space-y-12">
                    <div className="flex items-center gap-6 mb-12">
                        <h2 className="text-2xl md:text-3xl font-serif font-light tracking-[0.2em] text-gray-100">
                            INFORMATION
                        </h2>
                        <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-800 to-transparent"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 text-sm font-light tracking-wider">
                        {/* 所在地 */}
                        {shop.address && (
                            <div className="space-y-4">
                                <p className="text-xs text-[#cda35e] tracking-[0.1em] uppercase">Location</p>
                                <div className="text-gray-300 leading-relaxed flex items-start gap-3 bg-[#111] p-6 border border-gray-800/50">
                                    <MapPin className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                                    <span>{shop.address}</span>
                                </div>
                            </div>
                        )}

                        {/* 電話番号 */}
                        {shop.phone && (
                            <div className="space-y-4">
                                <p className="text-xs text-[#cda35e] tracking-[0.1em] uppercase">Phone</p>
                                <div className="text-gray-200 text-lg md:text-xl tracking-widest flex items-center gap-4 bg-[#111] p-6 border border-gray-800/50">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                    {shop.phone}
                                </div>
                            </div>
                        )}

                        {/* 審査ステータス */}
                        <div className="space-y-4 md:col-span-2">
                            <p className="text-xs text-[#cda35e] tracking-[0.1em] uppercase">Status</p>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] p-6 border border-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-gray-500" />
                                    <span className="text-gray-300">FitCoat 厳選ショップ</span>
                                </div>
                                <Link
                                    href={`/owner?shop_name=${encodeURIComponent(shop.name)}&shop_id=${shop.id}`}
                                    className="group inline-flex items-center justify-center gap-2 bg-transparent text-gray-400 border border-gray-700 hover:border-[#cda35e] hover:text-[#cda35e] px-6 py-2.5 text-xs tracking-widest transition-all duration-300"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>この店舗のオーナーですか？（登録申請）</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        </div>
    )
}
