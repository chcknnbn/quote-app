export interface OriginalQuote {
  id: string
  type: 'original'
  original: string       // 원문 (영어 등 외국어)
  translation: string    // 한국어 해석
  source: string         // 인물명
  createdAt: string      // ISO 8601
  updatedAt: string
}

export interface CustomQuote {
  id: string
  type: 'custom'
  text: string           // 한국어 명언 원문
  source: string         // 출처
  createdAt: string
  updatedAt: string
}

export type Quote = OriginalQuote | CustomQuote

export type QuoteType = Quote['type']
