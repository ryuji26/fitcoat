import { getSupabase } from "@/utils/supabase/client"
import Link from 'next/link'
import { MapPin, Phone, Image as ImageIcon } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'
import { StarRating } from '@/components/StarRating'

// サーバーコンポーネントで最新のSSRフェッチを行う設定（App Router）
export const dynamic = 'force-dynamic'

export default async function Home() {
  // Supabaseからデータを取得
  const supabase = getSupabase()
  const { data: shops, error } = await supabase
    .from('shops')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(12) // トップは直近の12件を取得

  if (error) {
    console.error('Fetch error:', error)
  }

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">

      {/* 意図駆動型検索（Intent-Driven Search）とSpotlightを実装したヒーローセクション */}
      <HeroSearch />

      {/* ショップ一覧セクション */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {shops?.map((shop) => (
            <div
              key={shop.id}
              className="group border border-gray-800/60 bg-[#161616] p-6 hover:border-gray-600 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                {/* テキストエリア */}
                <div className="space-y-3 flex-grow pr-4">
                  <h3 className="text-lg font-serif tracking-widest text-gray-200 leading-snug flex items-center gap-2">
                    {shop.name}
                    {shop.is_independent && (
                      <span className="text-[10px] tracking-widest px-2 py-0.5 border border-[#cda35e]/30 text-[#cda35e] bg-[#cda35e]/5 rounded-sm shrink-0 font-sans">
                        独立系専門店
                      </span>
                    )}
                  </h3>

                  {shop.address && (
                    <p className="text-xs text-gray-400 tracking-wider flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{shop.address}</span>
                    </p>
                  )}
                  {shop.phone && (
                    <p className="text-xs text-gray-400 tracking-wider flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>{shop.phone}</span>
                    </p>
                  )}

                  {/* 動的星評価 */}
                  <div className="pt-2">
                    <StarRating rating={shop.google_rating || 0} reviewCount={shop.google_review_count || 0} />
                  </div>
                </div>

                {/* サムネイル画像 */}
                <div className="w-20 h-20 bg-[#111] border border-gray-800 shrink-0 overflow-hidden flex items-center justify-center">
                  {shop.cover_image_url ? (
                    <img src={shop.cover_image_url} alt={shop.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-700">
                      <ImageIcon className="w-6 h-6 opacity-30" />
                      <span className="text-[8px] tracking-widest mt-1">NO IMAGE</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 詳細を見るボタン */}
              <Link
                href={`/shops/${shop.id}`}
                className="block w-full text-center py-3 text-xs tracking-widest text-gray-300 border border-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
              >
                詳細を見る
              </Link>
            </div>
          ))}

          {shops?.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500 font-light tracking-wider">
              店舗データが登録されていません。
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
