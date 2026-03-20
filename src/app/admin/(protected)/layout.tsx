import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'

// Dynamic rendering required — uses cookies() for auth
export const dynamic = 'force-dynamic'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) redirect('/admin/login')
  return <>{children}</>
}
