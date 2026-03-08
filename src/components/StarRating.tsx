import { Star, StarHalf } from 'lucide-react'

interface StarRatingProps {
    rating: number
    reviewCount?: number
    className?: string
    iconSize?: number
}

export function StarRating({ rating = 0, reviewCount, className = "", iconSize = 14 }: StarRatingProps) {
    const renderStars = () => {
        const stars = []
        const wholeStars = Math.floor(rating)
        // 0.5以上の余りがあれば半星を1つ追加
        const hasHalfStar = rating % 1 >= 0.5
        // 残りを空星で埋める
        const emptyStars = 5 - wholeStars - (hasHalfStar ? 1 : 0)

        for (let i = 0; i < wholeStars; i++) {
            stars.push(<Star key={`full-${i}`} size={iconSize} className="text-[#cda35e] fill-[#cda35e]" />)
        }

        if (hasHalfStar) {
            stars.push(<StarHalf key="half" size={iconSize} className="text-[#cda35e] fill-[#cda35e]" />)
        }

        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} size={iconSize} className="text-gray-600" />)
        }

        return stars
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex items-center gap-0.5" aria-label={`評価: ${rating}`}>
                {renderStars()}
            </div>
            {/* スコアの数値 */}
            <span className="text-[#cda35e] font-sans font-bold text-sm tracking-widest pl-1">
                {rating.toFixed(1)}
            </span>
            {/* レビュー件数 */}
            {reviewCount !== undefined && (
                <span className="text-gray-500 font-sans text-xs tracking-wider">
                    ({reviewCount})
                </span>
            )}
        </div>
    )
}
