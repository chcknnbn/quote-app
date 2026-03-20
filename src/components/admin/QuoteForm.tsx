'use client'

import { useState, useEffect } from 'react'
import type { Quote, OriginalQuote, CustomQuote } from '@/types/quote'

type QuoteInput =
  | Omit<OriginalQuote, 'id' | 'createdAt' | 'updatedAt'>
  | Omit<CustomQuote, 'id' | 'createdAt' | 'updatedAt'>

interface QuoteFormProps {
  quote?: Quote
  onSave: (quote: QuoteInput) => Promise<void>
  onCancel: () => void
}

type FormType = 'original' | 'custom'

export function QuoteForm({ quote, onSave, onCancel }: QuoteFormProps) {
  const [type, setType] = useState<FormType>(quote?.type ?? 'original')
  const [original, setOriginal] = useState(
    quote?.type === 'original' ? quote.original : ''
  )
  const [translation, setTranslation] = useState(
    quote?.type === 'original' ? quote.translation : ''
  )
  const [text, setText] = useState(quote?.type === 'custom' ? quote.text : '')
  const [source, setSource] = useState(quote?.source ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (quote) {
      setType(quote.type)
      setSource(quote.source)
      if (quote.type === 'original') {
        setOriginal(quote.original)
        setTranslation(quote.translation)
      } else {
        setText(quote.text)
      }
    }
  }, [quote])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (type === 'original') {
        await onSave({ type: 'original', original, translation, source })
      } else {
        await onSave({ type: 'custom', text, source })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-surface border border-divider rounded-lg px-4 py-2.5 text-cream text-sm placeholder-muted/40 focus:outline-none focus:border-gold/40 transition-colors resize-none'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface/80 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-divider rounded-2xl p-6">
        <h2 className="text-cream text-base font-medium mb-5">
          {quote ? '명언 수정' : '명언 추가'}
        </h2>

        {/* Type Toggle */}
        <div className="flex rounded-lg border border-divider overflow-hidden mb-5">
          {(['original', 'custom'] as FormType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-xs font-medium transition-colors ${
                type === t
                  ? 'bg-gold/15 text-gold border-r border-divider last:border-r-0'
                  : 'text-muted hover:text-cream'
              }`}
            >
              {t === 'original' ? '원문 명언' : '커스텀 명언'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {type === 'original' ? (
            <>
              <textarea
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                placeholder="원문 (영어 등)"
                rows={2}
                className={inputClass}
                style={{ userSelect: 'text' }}
              />
              <textarea
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                placeholder="한국어 해석"
                rows={2}
                className={inputClass}
                style={{ userSelect: 'text' }}
              />
            </>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="명언 내용"
              rows={3}
              className={inputClass}
              style={{ userSelect: 'text' }}
            />
          )}

          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="출처 (인물명, 속담 등)"
            className={inputClass}
            style={{ userSelect: 'text' }}
          />

          {error && <p className="text-red-400/80 text-xs">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-lg border border-divider text-muted hover:text-cream text-sm transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-gold/15 border border-gold/30 text-gold hover:bg-gold/25 text-sm font-medium transition-colors disabled:opacity-40"
            >
              {loading ? '저장 중…' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
