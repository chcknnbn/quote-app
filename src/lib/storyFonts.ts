let promise: Promise<void> | null = null

/**
 * Ensures EB Garamond Italic and Noto Sans KR Light are loaded into
 * document.fonts so Canvas can render them. The CSS @import in globals.css
 * registers the fonts; this call forces them to be downloaded and parsed.
 */
export function preloadStoryFonts(): Promise<void> {
  if (promise) return promise
  promise = Promise.all([
    document.fonts.load("italic 400 60px 'EB Garamond'"),
    document.fonts.load("300 36px 'Noto Sans KR'"),
  ]).then(() => undefined)
  return promise
}
