export type EventFormat = "Trade Show" | "Conference" | "Workshop" | "Virtual"
export type EntryFee = "Free" | "Paid"

export interface EventItem {
  id: string
  name: string
  category: string
  organizer: string
  description: string
  startDate: string // ISO
  endDate: string // ISO
  city: string
  country: string
  venue: string
  format: EventFormat
  entryFee: EntryFee
  rating: number // 0-5
  popularity: number // for Top 100
  tags: string[]
  coverImage: string
}

export interface Exhibitor {
  id: string
  name: string
  city: string
  country: string
  booth: string
  products: string[]
  description: string
}

export interface Speaker {
  id: string
  name: string
  title: string
  organization: string
  city: string
  country: string
  image: string
}

export interface LeadPayload {
  eventId: string
  selection: {
    package?: "Standard Booth (9 sq.m)" | "Custom-built (per sq.m)"
    customSqm?: number
    items: { id: string; label: string; qty: number; unitPrice: number }[]
    total: number
    contactEmail: string
  }
}
