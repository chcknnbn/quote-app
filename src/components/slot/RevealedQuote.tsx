'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import type { Quote } from '@/types/quote'
import { useStoryShare } from '@/hooks/useStoryShare'
import { preloadStoryFonts } from '@/lib/storyFonts'

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

const SHARE_LABEL: Record<string, string> = {
  idle: '공유',
  generating: '생성 중',
  done: '완료',
  error: '오류',
}

const SHARE_ICON: Record<string, string> = {
  idle: '↑',
  generating: '···',
  done: '✓',
  error: '!',
}

export function RevealedQuote({ quote, onReset }: RevealedQuoteProps) {
  const { share, state: shareState } = useStoryShare(quote)

  // Preload fonts in the background as soon as the quote is revealed
  useEffect(() => {
    preloadStoryFonts().catch(() => undefined)
  }, [])

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
          {/* Share */}
          <button
            onClick={share}
            disabled={shareState === 'generating'}
            aria-label="스토리 카드 공유"
            className="flex flex-col items-center gap-1 text-muted hover:text-cream transition-colors duration-200 disabled:opacity-50 disabled:cursor-wait"
          >
            <span className={`text-xl transition-colors duration-200 ${shareState === 'done' ? 'text-gold' : shareState === 'error' ? 'text-red-400' : ''}`}>
              {SHARE_ICON[shareState]}
            </span>
            <span className="text-[9px] tracking-wider">
              {SHARE_LABEL[shareState]}
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
