import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { getQuotes, saveQuotes } from '@/lib/quotes'
import { isAdminAuthenticated } from '@/lib/auth'
import type { Quote } from '@/types/quote'

export async function GET() {
  try {
    const quotes = await getQuotes()
    return NextResponse.json({ quotes, total: quotes.length })
  } catch {
    return NextResponse.json({ error: '명언을 불러올 수 없습니다.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const now = new Date().toISOString()

    let newQuote: Quote

    if (body.type === 'original') {
      if (!body.original?.trim() || !body.translation?.trim() || !body.source?.trim()) {
        return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
      }
      newQuote = {
        id: uuidv4(),
        type: 'original',
        original: body.original.trim(),
        translation: body.translation.trim(),
        source: body.source.trim(),
        createdAt: now,
        updatedAt: now,
      }
    } else if (body.type === 'custom') {
      if (!body.text?.trim() || !body.source?.trim()) {
        return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
      }
      newQuote = {
        id: uuidv4(),
        type: 'custom',
        text: body.text.trim(),
        source: body.source.trim(),
        createdAt: now,
        updatedAt: now,
      }
    } else {
      return NextResponse.json({ error: '유효하지 않은 타입입니다.' }, { status: 400 })
    }

    const quotes = await getQuotes()
    await saveQuotes([...quotes, newQuote])

    return NextResponse.json({ quote: newQuote }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '명언을 추가할 수 없습니다.' }, { status: 500 })
  }
}
