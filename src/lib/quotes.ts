import { Quote } from '@/types/quote'
import { redis } from './redis'

const REDIS_KEY = 'quotes'

const DEFAULT_QUOTES: Quote[] = [
  {
    id: '1', type: 'original',
    original: 'Be the change you wish to see in the world.',
    translation: '당신이 세상에서 보고 싶은 변화가 되어라.',
    source: '마하트마 간디',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '2', type: 'original',
    original: 'In the middle of every difficulty lies opportunity.',
    translation: '모든 어려움의 한가운데에 기회가 있다.',
    source: '알베르트 아인슈타인',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '3', type: 'original',
    original: 'The only way to do great work is to love what you do.',
    translation: '위대한 일을 하는 유일한 방법은 자신이 하는 일을 사랑하는 것이다.',
    source: '스티브 잡스',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '4', type: 'original',
    original: 'It does not matter how slowly you go as long as you do not stop.',
    translation: '멈추지만 않는다면, 얼마나 천천히 가는지는 중요하지 않다.',
    source: '공자',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '5', type: 'original',
    original: 'The future belongs to those who believe in the beauty of their dreams.',
    translation: '미래는 자신의 꿈이 아름답다고 믿는 자들의 것이다.',
    source: '엘리노어 루즈벨트',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '6', type: 'original',
    original: "It always seems impossible until it's done.",
    translation: '무언가를 이루기 전까지는 항상 불가능해 보인다.',
    source: '넬슨 만델라',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '7', type: 'original',
    original: "Whether you think you can or you think you can't, you're right.",
    translation: '할 수 있다고 생각하든, 할 수 없다고 생각하든, 당신이 옳다.',
    source: '헨리 포드',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '8', type: 'original',
    original: 'Happiness is not something ready-made. It comes from your own actions.',
    translation: '행복은 이미 만들어진 것이 아니다. 그것은 당신의 행동에서 비롯된다.',
    source: '달라이 라마',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '9', type: 'original',
    original: "Life is what happens when you're busy making other plans.",
    translation: '인생이란 다른 계획을 세우느라 바쁠 때 일어나는 일이다.',
    source: '존 레논',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '10', type: 'original',
    original: 'The journey of a thousand miles begins with one step.',
    translation: '천 리 길도 한 걸음부터 시작된다.',
    source: '노자',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '11', type: 'original',
    original: 'Not all those who wander are lost.',
    translation: '방황하는 모든 이가 길을 잃은 것은 아니다.',
    source: 'J.R.R. 톨킨',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '12', type: 'original',
    original: 'You miss 100% of the shots you don\'t take.',
    translation: '시도하지 않은 샷은 100% 빗나간다.',
    source: '웨인 그레츠키',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '13', type: 'custom',
    text: '지금 이 순간에 집중하라. 이것이 삶의 전부이다.',
    source: '법정 스님',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '14', type: 'custom',
    text: '열 번 찍어 안 넘어가는 나무 없다.',
    source: '한국 속담',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '15', type: 'custom',
    text: '가장 어두운 밤도 끝나고, 해는 다시 뜬다.',
    source: '빅토르 위고',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '16', type: 'custom',
    text: '오늘 최선을 다하면 내일은 더 나은 하루가 된다.',
    source: '격언',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '17', type: 'custom',
    text: '배움에는 끝이 없고, 노력에는 한계가 없다.',
    source: '격언',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '18', type: 'custom',
    text: '남과 비교하지 말고, 어제의 나와 비교하라.',
    source: '격언',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '19', type: 'custom',
    text: '용기란 두려움이 없는 것이 아니라, 두려움보다 더 중요한 것이 있다는 것을 아는 것이다.',
    source: '넬슨 만델라',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
  {
    id: '20', type: 'custom',
    text: '작은 친절이 세상을 바꾼다.',
    source: '격언',
    createdAt: '2026-03-20T00:00:00.000Z', updatedAt: '2026-03-20T00:00:00.000Z',
  },
]

// In-memory fallback for local development without Redis
let devStore: Quote[] | null = null

export async function getQuotes(): Promise<Quote[]> {
  if (redis) {
    const quotes = await redis.get<Quote[]>(REDIS_KEY)
    if (!quotes || quotes.length === 0) {
      await redis.set(REDIS_KEY, DEFAULT_QUOTES)
      return DEFAULT_QUOTES
    }
    return quotes
  }

  if (devStore === null) {
    devStore = [...DEFAULT_QUOTES]
  }
  return devStore
}

export async function saveQuotes(quotes: Quote[]): Promise<void> {
  if (redis) {
    await redis.set(REDIS_KEY, quotes)
    return
  }
  devStore = quotes
}
