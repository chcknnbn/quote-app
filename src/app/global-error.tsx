'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko">
      <body
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0A0A14',
          color: '#F0EDE4',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p style={{ color: '#8A8595', fontSize: '0.75rem', marginBottom: '1rem' }}>
          오류가 발생했습니다.
        </p>
        <button
          onClick={reset}
          style={{
            color: '#C9A84C',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.75rem',
          }}
        >
          다시 시도
        </button>
      </body>
    </html>
  )
}
