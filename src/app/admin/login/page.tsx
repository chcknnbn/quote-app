'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? '로그인에 실패했습니다.')
      }
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-10">
          <p className="text-[10px] text-gold/60 tracking-[0.3em] uppercase mb-3">
            오늘의 명언
          </p>
          <h1 className="text-cream text-xl font-light">관리자 로그인</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            autoFocus
            className="w-full bg-card border border-divider rounded-lg px-4 py-3 text-cream placeholder-muted/50 text-sm focus:outline-none focus:border-gold/50 transition-colors user-select-text"
            style={{ userSelect: 'text' }}
          />

          {error && (
            <p className="text-red-400/80 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-gold/10 hover:bg-gold/20 border border-gold/30 text-gold rounded-lg px-4 py-3 text-sm font-medium tracking-wide transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? '확인 중…' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
