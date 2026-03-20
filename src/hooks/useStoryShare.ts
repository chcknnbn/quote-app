'use client'

import { useState, useCallback } from 'react'
import type { Quote } from '@/types/quote'
import { generateStoryCard } from '@/lib/generateStoryCard'

export type ShareState = 'idle' | 'generating' | 'done' | 'error'

function downloadBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  // iOS Safari: <a download> is ignored — open in new tab so user can long-press to save
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.open(url)
  } else {
    const a = document.createElement('a')
    a.href = url
    a.download = 'quote.png'
    a.click()
  }
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function useStoryShare(quote: Quote) {
  const [state, setState] = useState<ShareState>('idle')

  const share = useCallback(async () => {
    if (state === 'generating') return
    setState('generating')

    try {
      const blob = await generateStoryCard(quote)
      const file = new File([blob], 'quote.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] })
      } else {
        downloadBlob(blob)
      }

      setState('done')
      setTimeout(() => setState('idle'), 2000)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // User dismissed the share sheet — treat as idle
        setState('idle')
      } else {
        setState('error')
        setTimeout(() => setState('idle'), 2000)
      }
    }
  }, [quote, state])

  return { share, state }
}
