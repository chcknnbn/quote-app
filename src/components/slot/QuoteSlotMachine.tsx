'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { RevealedQuote } from './RevealedQuote'
import type { Quote } from '@/types/quote'

type Phase = 'idle' | 'spinning' | 'revealed'

const SPIN_INTERVAL_MS = 80

interface Props {
  quotes: Quote[]
}

// ─── Idle View ───────────────────────────────
function IdleView({ empty }: { empty?: boolean }) {
  return (
    <motion.div
      key="idle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center px-8 select-none pointer-events-none"
    >
      {/* Top label */}
      <p className="text-[10px] text-gold/60 tracking-[0.35em] uppercase mb-10">
        오늘의 명언
      </p>

      {/* Decorative emblem */}
      <div className="animate-float mb-10">
        <div className="w-24 h-24 rounded-full border border-gold/15 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center">
            <span className="text-gold text-3xl leading-none">✦</span>
          </div>
        </div>
      </div>

      {empty ? (
        <p className="text-muted text-base font-light leading-relaxed">
          등록된 명언이 없습니다.
          <br />
          <span className="text-muted/60 text-sm">관리자 페이지에서 추가해주세요.</span>
        </p>
      ) : (
        <>
          <p className="text-cream/70 text-lg font-light leading-relaxed">
            화면을 터치하여
            <br />
            <span className="text-cream font-medium">오늘의 명언</span>을 뽑아보세요
          </p>
          <p className="text-muted/50 text-[10px] tracking-widest uppercase mt-8">
            tap anywhere
          </p>
        </>
      )}
    </motion.div>
  )
}

// ─── Spinning View ────────────────────────────
interface SpinningViewProps {
  textRef: React.RefObject<HTMLParagraphElement | null>
}

function SpinningView({ textRef }: SpinningViewProps) {
  return (
    <motion.div
      key="spinning"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center text-center px-8 select-none pointer-events-none"
    >
      <p className="text-[10px] text-gold/50 tracking-[0.35em] uppercase mb-10">
        터치하여 선택
      </p>

      {/* Spinning text — DOM updated directly via ref for performance */}
      <p
        ref={textRef}
        className="spinning-text font-serif italic text-cream/80 text-2xl leading-relaxed min-h-[4rem] max-w-[18rem]"
      />

      {/* Pulsing dots */}
      <div className="flex gap-1.5 mt-10">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full bg-gold/40 animate-glow-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── Main Container ───────────────────────────
export function QuoteSlotMachine({ quotes }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null)

  const textRef = useRef<HTMLParagraphElement | null>(null)
  const currentIndexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startSpinning = useCallback(() => {
    if (quotes.length === 0) return
    setPhase('spinning')
    if ('vibrate' in navigator) navigator.vibrate(20)

    intervalRef.current = setInterval(() => {
      const idx = Math.floor(Math.random() * quotes.length)
      currentIndexRef.current = idx
      if (textRef.current) {
        const q = quotes[idx]
        textRef.current.textContent =
          q.type === 'original' ? q.original : q.text
      }
    }, SPIN_INTERVAL_MS)
  }, [quotes])

  const stopSpinning = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if ('vibrate' in navigator) navigator.vibrate([40, 20, 40])
    setSelectedQuote(quotes[currentIndexRef.current])
    setPhase('revealed')
  }, [quotes])

  const reset = useCallback(() => {
    setPhase('idle')
    setSelectedQuote(null)
  }, [])

  const handleTap = useCallback(() => {
    if (phase === 'idle') startSpinning()
    else if (phase === 'spinning') stopSpinning()
  }, [phase, startSpinning, stopSpinning])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center bg-surface"
      onClick={phase !== 'revealed' ? handleTap : undefined}
      onTouchStart={
        phase !== 'revealed'
          ? (e) => {
              e.preventDefault()
              handleTap()
            }
          : undefined
      }
    >
      <AnimatePresence mode="wait">
        {phase === 'idle' && <IdleView empty={quotes.length === 0} />}
        {phase === 'spinning' && <SpinningView textRef={textRef} />}
        {phase === 'revealed' && selectedQuote && (
          <motion.div
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <RevealedQuote quote={selectedQuote} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
