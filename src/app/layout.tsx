import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '오늘의 명언',
  description: '매일 당신에게 영감을 주는 명언 — 출퇴근길의 작은 동기부여',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '오늘의 명언',
  },
  openGraph: {
    title: '오늘의 명언',
    description: '매일 당신에게 영감을 주는 명언',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-surface text-cream antialiased">
        {children}
      </body>
    </html>
  )
}
