import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Sparkles, Search, Menu, User } from "lucide-react";

// 洗練された細身のゴシック・明朝体を読み込み
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerifJP = Noto_Serif_JP({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
});

export const metadata: Metadata = {
  title: "FitCoat | 至高のカーコーティング・ポータル",
  description: "全国の輝きを集めた、完全審査制の高級カーコーティング専門店ポータルサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSerifJP.variable} font-sans bg-[#0a0a0a] text-gray-200 antialiased min-h-screen flex flex-col`}
      >
        {/* ラグジュアリーなヘッダー */}
        <header className="sticky top-0 z-50 bg-[#161616]/95 backdrop-blur-md border-b border-gray-700/50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex flex-col justify-center">
              <span className="font-serif text-3xl tracking-widest text-gray-200">
                FitCoat
              </span>
              <span className="text-[10px] tracking-[0.2em] text-gray-500 mt-0.5">
                フィットコート
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#" className="flex items-center gap-2 text-sm tracking-widest text-gray-300 hover:text-white hover:text-[#cda35e] transition-colors duration-300">
                <Search className="w-4 h-4" />
                <span>検索</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm tracking-widest text-gray-300 hover:text-white hover:text-[#cda35e] transition-colors duration-300">
                <Menu className="w-4 h-4" />
                <span>ショップ一覧</span>
              </Link>
              <Link href="/owner" className="flex items-center gap-2 text-sm tracking-widest text-gray-300 hover:text-white hover:text-[#cda35e] transition-colors duration-300">
                <User className="w-4 h-4" />
                <span>オーナー様へ</span>
              </Link>
            </nav>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-grow">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-gray-900 bg-black pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Sparkles className="w-4 h-4 text-gray-600" />
              <span className="font-serif text-xl tracking-[0.3em] font-light text-gray-500">
                FitCoat
              </span>
            </div>
            <p className="text-gray-600 text-sm tracking-widest font-light">
              &copy; {new Date().getFullYear()} FitCoat. ALL RIGHTS RESERVED.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
