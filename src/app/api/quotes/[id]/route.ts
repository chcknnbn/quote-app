import { NextRequest, NextResponse } from 'next/server'
import { getQuotes, saveQuotes } from '@/lib/quotes'
import { isAdminAuthenticated } from '@/lib/auth'
import type { Quote } from '@/types/quote'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: NextRequest, { params }: Params) {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const quotes = await getQuotes()
    const index = quotes.findIndex((q) => q.id === id)

    if (index === -1) {
      return NextResponse.json({ error: '명언을 찾을 수 없습니다.' }, { status: 404 })
    }

    const existing = quotes[index]
    const now = new Date().toISOString()
    let updated: Quote

    if (body.type === 'original') {
      if (!body.original?.trim() || !body.translation?.trim() || !body.source?.trim()) {
        return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
      }
      updated = {
        id: existing.id,
        type: 'original',
        original: body.original.trim(),
        translation: body.translation.trim(),
        source: body.source.trim(),
        createdAt: existing.createdAt,
        updatedAt: now,
      }
    } else if (body.type === 'custom') {
      if (!body.text?.trim() || !body.source?.trim()) {
        return NextResponse.json({ error: '모든 필드를 입력해주세요.' }, { status: 400 })
      }
      updated = {
        id: existing.id,
        type: 'custom',
        text: body.text.trim(),
        source: body.source.trim(),
        createdAt: existing.createdAt,
        updatedAt: now,
      }
    } else {
      return NextResponse.json({ error: '유효하지 않은 타입입니다.' }, { status: 400 })
    }

    const updatedQuotes = [...quotes]
    updatedQuotes[index] = updated
    await saveQuotes(updatedQuotes)

    return NextResponse.json({ quote: updated })
  } catch {
    return NextResponse.json({ error: '명언을 수정할 수 없습니다.' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  try {
    const { id } = await params
    const quotes = await getQuotes()
    const filtered = quotes.filter((q) => q.id !== id)

    if (filtered.length === quotes.length) {
      return NextResponse.json({ error: '명언을 찾을 수 없습니다.' }, { status: 404 })
    }

    await saveQuotes(filtered)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: '명언을 삭제할 수 없습니다.' }, { status: 500 })
  }
}
