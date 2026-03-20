'use client'

import { motion } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import type { Quote } from '@/types/quote'

const FAVORITES_KEY = 'quote_favorites'

function getFavoriteIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? '[]')
  } catch {
    return []
  }
}

function toggleFavoriteId(id: string): boolean {
  const ids = getFavoriteIds()
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next))
  return next.includes(id)
}

interface RevealedQuoteProps {
  quote: Quote
  onReset: () => void
}

const EASE = [0.22, 1, 0.36, 1] as const

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: EASE, delay },
  }
}

function fadeIn(delay: number) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, delay },
  }
}

export function RevealedQuote({ quote, onReset }: RevealedQuoteProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setIsFavorite(getFavoriteIds().includes(quote.id))
  }, [quote.id])

  const shareText =
    quote.type === 'original'
      ? `"${quote.translation}"\n— ${quote.source}`
      : `"${quote.text}"\n— ${quote.source}`

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [shareText])

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 py-16 safe-bottom">
      <div className="w-full max-w-xs">
        {/* Header */}
        <motion.p
          {...fadeIn(0)}
          className="text-[10px] text-gold/50 tracking-[0.35em] uppercase text-center mb-10"
        >
          오늘의 명언
        </motion.p>

        {/* Quote Content */}
        {quote.type === 'original' ? (
          <>
            {/* Original Text */}
            <motion.p
              {...fadeUp(0.05)}
              className="font-serif italic text-cream text-[1.6rem] leading-snug text-center"
            >
              &ldquo;{quote.original}&rdquo;
            </motion.p>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
              className="gold-divider my-6 mx-auto w-16"
            />

            {/* Translation */}
            <motion.p
              {...fadeUp(0.45)}
              className="font-sans font-light text-cream/80 text-[1.05rem] leading-relaxed text-center"
            >
              {quote.translation}
            </motion.p>
          </>
        ) : (
          /* Custom text only */
          <motion.p
            {...fadeUp(0.05)}
            className="font-sans font-light text-cream text-[1.4rem] leading-relaxed text-center"
          >
            &ldquo;{quote.text}&rdquo;
          </motion.p>
        )}

        {/* Source */}
        <motion.p
          {...fadeIn(quote.type === 'original' ? 0.7 : 0.35)}
          className="text-gold text-xs tracking-widest text-center mt-6"
        >
          — {quote.source}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          {...fadeIn(quote.type === 'original' ? 0.9 : 0.55)}
          className="flex items-center justify-center gap-8 mt-14"
        >
          {/* Favorite */}
          <button
            onClick={() => setIsFavorite(toggleFavoriteId(quote.id))}
            aria-label="즐겨찾기"
            className="flex flex-col items-center gap-1 text-muted hover:text-gold transition-colors duration-200"
          >
            <span className={`text-xl ${isFavorite ? 'text-gold' : ''}`}>
              {isFavorite ? '♥' : '♡'}
            </span>
            <span className="text-[9px] tracking-wider">
              {isFavorite ? '저장됨' : '저장'}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            aria-label="공유"
            className="flex flex-col items-center gap-1 text-muted hover:text-cream transition-colors duration-200"
          >
            <span className="text-xl">↑</span>
            <span className="text-[9px] tracking-wider">
              {copied ? '복사됨' : '공유'}
            </span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="flex flex-col items-center gap-1 text-muted hover:text-cream transition-colors duration-200"
          >
            <span className="text-xl">↺</span>
            <span className="text-[9px] tracking-wider">다시 뽑기</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
