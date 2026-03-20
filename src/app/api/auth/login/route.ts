import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, COOKIE_MAX_AGE_SECONDS } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      // Constant-time comparison would be ideal, but for a simple admin app this suffices
      return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
    }

    const token = createSessionToken()
    const response = NextResponse.json({ success: true })

    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_SECONDS,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: '로그인 처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
