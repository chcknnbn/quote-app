'use client'

import type { Quote } from '@/types/quote'

interface DeleteConfirmProps {
  quote: Quote
  onConfirm: () => Promise<void>
  onCancel: () => void
  loading: boolean
}

export function DeleteConfirm({ quote, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  const preview =
    quote.type === 'original' ? quote.original : quote.text

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
      <div className="w-full max-w-xs bg-card border border-divider rounded-2xl p-6">
        <h2 className="text-cream text-base font-medium mb-2">명언 삭제</h2>
        <p className="text-muted text-xs mb-4">이 명언을 삭제하시겠습니까?</p>

        <div className="bg-surface rounded-lg p-3 mb-5 border border-divider">
          <p className="text-cream/70 text-sm leading-relaxed line-clamp-3">
            &ldquo;{preview}&rdquo;
          </p>
          <p className="text-gold text-xs mt-2">— {quote.source}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg border border-divider text-muted hover:text-cream text-sm transition-colors disabled:opacity-40"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-sm font-medium transition-colors disabled:opacity-40"
          >
            {loading ? '삭제 중…' : '삭제'}
          </button>
        </div>
      </div>
    </div>
  )
}
