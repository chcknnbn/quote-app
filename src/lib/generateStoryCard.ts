import type { Quote } from '@/types/quote'
import { preloadStoryFonts } from './storyFonts'

const W = 1080
const H = 1920
const PAD = 140 // horizontal padding for text

const GOLD = '#C9A84C'
const GOLD_50 = 'rgba(201, 168, 76, 0.5)'
const GOLD_30 = 'rgba(201, 168, 76, 0.3)'
const CREAM = '#F0EDE4'
const CREAM_75 = 'rgba(240, 237, 228, 0.75)'
const BG = '#0A0A14'

/** Splits text into lines that fit within maxWidth pixels. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

/** Draws an L-shaped corner ornament. */
function drawCorner(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dirX: 1 | -1,
  dirY: 1 | -1
) {
  const SIZE = 72
  ctx.strokeStyle = GOLD_30
  ctx.lineWidth = 2
  ctx.lineCap = 'square'
  ctx.beginPath()
  ctx.moveTo(x + dirX * SIZE, y)
  ctx.lineTo(x, y)
  ctx.lineTo(x, y + dirY * SIZE)
  ctx.stroke()
}

/** Draws the gold gradient horizontal divider. */
function drawDivider(ctx: CanvasRenderingContext2D, cy: number) {
  const divW = 220
  const x0 = (W - divW) / 2
  const grad = ctx.createLinearGradient(x0, cy, x0 + divW, cy)
  grad.addColorStop(0, 'transparent')
  grad.addColorStop(0.5, GOLD)
  grad.addColorStop(1, 'transparent')
  ctx.fillStyle = grad
  ctx.fillRect(x0, cy, divW, 1.5)
}

export async function generateStoryCard(quote: Quote): Promise<Blob> {
  await preloadStoryFonts()

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── Background ──────────────────────────────────────────────
  ctx.fillStyle = BG
  ctx.fillRect(0, 0, W, H)

  // Subtle top/bottom gold edge glow
  const topGlow = ctx.createLinearGradient(0, 0, 0, 200)
  topGlow.addColorStop(0, 'rgba(201, 168, 76, 0.06)')
  topGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = topGlow
  ctx.fillRect(0, 0, W, 200)

  const botGlow = ctx.createLinearGradient(0, H - 200, 0, H)
  botGlow.addColorStop(0, 'transparent')
  botGlow.addColorStop(1, 'rgba(201, 168, 76, 0.06)')
  ctx.fillStyle = botGlow
  ctx.fillRect(0, H - 200, W, 200)

  // ── Corner ornaments ─────────────────────────────────────────
  const M = 70
  drawCorner(ctx, M, M, 1, 1)
  drawCorner(ctx, W - M, M, -1, 1)
  drawCorner(ctx, M, H - M, 1, -1)
  drawCorner(ctx, W - M, H - M, -1, -1)

  // ── Header ───────────────────────────────────────────────────
  ctx.fillStyle = GOLD_50
  ctx.font = "300 22px 'Noto Sans KR'"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✦  오늘의 명언  ✦', W / 2, 190)

  // ── Quote text block ─────────────────────────────────────────
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  let contentY: number

  if (quote.type === 'original') {
    // Measure original text
    ctx.font = "italic 400 62px 'EB Garamond'"
    const origLines = wrapText(ctx, `\u201C${quote.original}\u201D`, W - PAD * 2)
    const origLineH = 86

    // Measure translation
    ctx.font = "300 36px 'Noto Sans KR'"
    const transLines = wrapText(ctx, quote.translation, W - PAD * 2)
    const transLineH = 56

    // Total content block height
    const origH = origLines.length * origLineH
    const transH = transLines.length * transLineH
    const dividerSection = 100 // gap + divider + gap
    const sourceH = 60
    const totalH = origH + dividerSection + transH + 48 + sourceH

    // Center block vertically between header (y=280) and watermark (y=H-200)
    const availTop = 300
    const availBot = H - 220
    contentY = availTop + (availBot - availTop - totalH) / 2

    // Draw original (EB Garamond Italic)
    ctx.fillStyle = CREAM
    ctx.font = "italic 400 62px 'EB Garamond'"
    let y = contentY
    for (const line of origLines) {
      ctx.fillText(line, W / 2, y)
      y += origLineH
    }

    // Divider
    y += 44
    drawDivider(ctx, y)
    y += 56

    // Translation (Noto Sans KR Light)
    ctx.fillStyle = CREAM_75
    ctx.font = "300 36px 'Noto Sans KR'"
    for (const line of transLines) {
      ctx.fillText(line, W / 2, y)
      y += transLineH
    }

    // Source
    y += 52
    ctx.fillStyle = GOLD
    ctx.font = "400 26px 'Noto Sans KR'"
    ctx.fillText(`\u2014 ${quote.source}`, W / 2, y)
  } else {
    // custom type — Korean text only, vertically centered
    ctx.font = "300 48px 'Noto Sans KR'"
    const textLines = wrapText(ctx, `\u201C${quote.text}\u201D`, W - PAD * 2)
    const lineH = 72

    const availTop = 300
    const availBot = H - 220
    const totalH = textLines.length * lineH + 60 + 36 // text + gap + source
    contentY = availTop + (availBot - availTop - totalH) / 2

    ctx.fillStyle = CREAM
    let y = contentY
    for (const line of textLines) {
      ctx.fillText(line, W / 2, y)
      y += lineH
    }

    y += 60
    ctx.fillStyle = GOLD
    ctx.font = "400 26px 'Noto Sans KR'"
    ctx.fillText(`\u2014 ${quote.source}`, W / 2, y)
  }

  // ── Watermark ────────────────────────────────────────────────
  ctx.fillStyle = GOLD_30
  ctx.font = "300 20px 'Noto Sans KR'"
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('오늘의 명언', W / 2, H - 120)

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Canvas toBlob failed'))
    }, 'image/png')
  })
}
