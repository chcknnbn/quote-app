'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { QuoteTable } from '@/components/admin/QuoteTable'
import { QuoteForm } from '@/components/admin/QuoteForm'
import { DeleteConfirm } from '@/components/admin/DeleteConfirm'
import type { Quote, OriginalQuote, CustomQuote } from '@/types/quote'

type QuoteInput =
  | Omit<OriginalQuote, 'id' | 'createdAt' | 'updatedAt'>
  | Omit<CustomQuote, 'id' | 'createdAt' | 'updatedAt'>

type Modal =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; quote: Quote }
  | { type: 'delete'; quote: Quote }

export default function AdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [modal, setModal] = useState<Modal>({ type: 'none' })
  const router = useRouter()

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch('/api/quotes')
      const data = await res.json()
      setQuotes(data.quotes ?? [])
    } catch {
      // silently fail — table shows empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuotes()
  }, [fetchQuotes])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const handleSave = async (body: QuoteInput) => {
    if (modal.type === 'add') {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '저장 실패')
      }
    } else if (modal.type === 'edit') {
      const res = await fetch(`/api/quotes/${modal.quote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '수정 실패')
      }
    }
    await fetchQuotes()
    setModal({ type: 'none' })
  }

  const handleDeleteConfirm = async () => {
    if (modal.type !== 'delete') return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/quotes/${modal.quote.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '삭제 실패')
      }
      await fetchQuotes()
      setModal({ type: 'none' })
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-surface admin-scroll">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/95 border-b border-divider backdrop-blur-sm px-5 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-[9px] text-gold/50 tracking-[0.3em] uppercase">
              오늘의 명언
            </p>
            <h1 className="text-cream text-sm font-medium">명언 관리</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted text-xs">{quotes.length}개</span>
            <button
              onClick={() => setModal({ type: 'add' })}
              className="bg-gold/10 border border-gold/30 text-gold text-xs px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-colors"
            >
              + 추가
            </button>
            <button
              onClick={handleLogout}
              className="text-muted hover:text-cream text-xs transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-lg mx-auto px-5 py-6">
        {loading ? (
          <div className="text-center py-16 text-muted text-sm">불러오는 중…</div>
        ) : (
          <QuoteTable
            quotes={quotes}
            onEdit={(q) => setModal({ type: 'edit', quote: q })}
            onDelete={(q) => setModal({ type: 'delete', quote: q })}
          />
        )}
      </main>

      {/* Modals */}
      {(modal.type === 'add' || modal.type === 'edit') && (
        <QuoteForm
          quote={modal.type === 'edit' ? modal.quote : undefined}
          onSave={handleSave}
          onCancel={() => setModal({ type: 'none' })}
        />
      )}

      {modal.type === 'delete' && (
        <DeleteConfirm
          quote={modal.quote}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setModal({ type: 'none' })}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}
