import { createHmac } from 'crypto'

const COOKIE_NAME = 'admin_session'
const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
export const COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60

function getSecret(): string {
  const password = process.env.ADMIN_PASSWORD ?? 'dev-password'
  const secret = process.env.AUTH_SECRET ?? 'dev-secret-change-in-production'
  return `${password}:${secret}`
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function createSessionToken(): string {
  const timestamp = Date.now().toString()
  const signature = sign(timestamp)
  return `${timestamp}.${signature}`
}

export function verifySessionToken(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [timestamp, signature] = parts
  const age = Date.now() - parseInt(timestamp, 10)
  if (age > TOKEN_MAX_AGE_MS) return false

  const expectedSignature = sign(timestamp)
  return signature === expectedSignature
}

export async function isAdminAuthenticated(): Promise<boolean> {
  // Lazy import — avoids module-level cookies() access during static prerendering
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifySessionToken(token)
}
