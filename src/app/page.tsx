import { getQuotes } from '@/lib/quotes'
import { QuoteSlotMachine } from '@/components/slot/QuoteSlotMachine'

// Always render fresh quotes from the store on each request
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const quotes = await getQuotes()
  return <QuoteSlotMachine quotes={quotes} />
}
