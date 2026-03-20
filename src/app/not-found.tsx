import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-8 text-center">
      <p className="text-[10px] text-gold/50 tracking-[0.3em] uppercase mb-6">
        오늘의 명언
      </p>
      <p className="text-muted text-sm mb-8">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="text-gold/70 hover:text-gold text-xs tracking-widest underline underline-offset-4 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}
