'use client'

import type { Quote } from '@/types/quote'

interface QuoteTableProps {
  quotes: Quote[]
  onEdit: (quote: Quote) => void
  onDelete: (quote: Quote) => void
}

export function QuoteTable({ quotes, onEdit, onDelete }: QuoteTableProps) {
  if (quotes.length === 0) {
    return (
      <div className="text-center py-16 text-muted text-sm">
        등록된 명언이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {quotes.map((quote, idx) => {
        const preview = quote.type === 'original' ? quote.original : quote.text
        const typeBadge = quote.type === 'original' ? '원문' : '한국어'
        const badgeColor =
          quote.type === 'original'
            ? 'text-gold/80 border-gold/25 bg-gold/8'
            : 'text-cream/60 border-divider bg-card'

        return (
          <div
            key={quote.id}
            className="flex items-start gap-3 bg-card border border-divider rounded-xl p-4 hover:border-gold/20 transition-colors"
          >
            {/* Index */}
            <span className="text-muted/40 text-xs w-6 flex-shrink-0 pt-0.5 text-right">
              {idx + 1}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border tracking-wider ${badgeColor}`}
                >
                  {typeBadge}
                </span>
                <span className="text-gold text-[10px] truncate">{quote.source}</span>
              </div>
              <p className="text-cream/70 text-sm leading-snug line-clamp-2">
                {preview}
              </p>
              {quote.type === 'original' && (
                <p className="text-muted text-xs mt-1 line-clamp-1">
                  {quote.translation}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button
                onClick={() => onEdit(quote)}
                className="text-muted hover:text-cream text-xs px-2 py-1 rounded border border-divider hover:border-cream/20 transition-colors"
              >
                수정
              </button>
              <button
                onClick={() => onDelete(quote)}
                className="text-muted hover:text-red-400 text-xs px-2 py-1 rounded border border-divider hover:border-red-400/30 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
