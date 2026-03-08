'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ChevronsLeftRight } from 'lucide-react'

export function BeforeAfterSlider() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isHovered, setIsHovered] = useState(false)

    // マウスのX座標（0 ~ 100%）を保持するMotionValue
    const mouseX = useMotionValue(50)

    // x座標をclip-pathのパーセンテージに変換
    const clipPath = useTransform(mouseX, (value) => `inset(0 ${100 - value}% 0 0)`)
    const handlePosition = useTransform(mouseX, (value) => `calc(${value}% - 2px)`)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        // コンテナ内のX座標の割合を計算 (0 ~ 100)
        const position = ((e.clientX - rect.left) / rect.width) * 100
        // 範囲を 0% 〜 100% に制限
        mouseX.set(Math.max(0, Math.min(100, position)))
    }

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const touch = e.touches[0]
        const position = ((touch.clientX - rect.left) / rect.width) * 100
        mouseX.set(Math.max(0, Math.min(100, position)))
    }

    // 初期時は中央にセット
    useEffect(() => {
        mouseX.set(50)
    }, [mouseX])

    return (
        <div className="space-y-4">
            <div
                ref={containerRef}
                className="relative w-full aspect-video bg-gray-900 overflow-hidden cursor-crosshair touch-none select-none"
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* === BEFORE 画像 (下敷き) === */}
                <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center grayscale opacity-80" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs tracking-widest text-[#cda35e] font-light border border-gray-700/50">
                    BEFORE
                </div>

                {/* === AFTER 画像 (上のレイヤー、マウス位置でクリップされる) === */}
                <motion.div
                    className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center saturate-200 contrast-125"
                    style={{ clipPath }}
                />
                <motion.div
                    className="absolute top-4 right-4 bg-cyan-950/80 backdrop-blur-md px-4 py-1.5 text-xs tracking-widest text-white font-light border border-cyan-800/50 mix-blend-screen"
                    style={{
                        opacity: useTransform(mouseX, [40, 60], [0, 1]) // スライダーが右にある時だけ表示
                    }}
                >
                    AFTER
                </motion.div>

                {/* === スライダーのハンドル（中央線とつまみ） === */}
                <motion.div
                    className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#cda35e] to-transparent pointer-events-none"
                    style={{ left: handlePosition }}
                >
                    {/* 中央のつまみアイコン */}
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-[#cda35e] bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-[0_0_20px_rgba(205,163,94,0.4)]"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronsLeftRight className="w-5 h-5 text-[#cda35e]" />
                    </motion.div>
                </motion.div>
            </div>

            <div className="flex justify-between items-center px-2 text-[10px] text-gray-500 tracking-widest uppercase">
                <span>Slide to Compare</span>
                <span>Premium Coating Result</span>
            </div>
        </div>
    )
}
