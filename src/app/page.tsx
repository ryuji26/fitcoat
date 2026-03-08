import { getSupabase } from "@/utils/supabase/client"
import Link from 'next/link'
import { MapPin, Phone } from 'lucide-react'
import { HeroSearch } from '@/components/HeroSearch'

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
                  <h3 className="text-lg font-serif tracking-widest text-gray-200 leading-snug">
                    {shop.name}
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

                  {/* 星評価（モックアップ） */}
                  <div className="flex text-gray-400 gap-1 pt-1 text-xs">
                    ★ ★ ★ ★ ☆
                  </div>
                </div>

                {/* サムネイル画像（プレースホルダー） */}
                <div className="w-20 h-20 bg-gray-900 border border-gray-800 shrink-0 overflow-hidden">
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=200')] bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" />
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
