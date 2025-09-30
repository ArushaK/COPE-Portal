import type { EventItem, EventFormat, EntryFee } from "@/lib/types"

const categories = [
  "Education & Training",
  "Medical & Pharma",
  "IT & Technology",
  "Banking & Finance",
  "Food & Beverage",
  "Automotive",
  "Travel & Tourism",
  "Construction",
  "Energy & Environment",
  "Fashion & Beauty",
]

const citiesByCountry: Record<string, string[]> = {
  USA: ["New York", "San Francisco", "Chicago", "Austin", "Seattle"],
  UK: ["London", "Manchester", "Birmingham"],
  Germany: ["Berlin", "Munich", "Frankfurt"],
  India: ["Mumbai", "Bengaluru", "Delhi"],
  UAE: ["Dubai", "Abu Dhabi"],
  Japan: ["Tokyo", "Osaka"],
  Brazil: ["Sao Paulo", "Rio de Janeiro"],
  Canada: ["Toronto", "Vancouver"],
}

const organizers = [
  "Global Expo Co.",
  "Prime Events Ltd.",
  "ExpoSphere",
  "SummitWorks",
  "TradeConnect",
  "World Fairs Group",
  "Eventify",
]

const formats: EventFormat[] = ["Trade Show", "Conference", "Workshop", "Virtual"]
const fees: EntryFee[] = ["Free", "Paid"]
const tags = ["networking", "innovation", "startup", "investors", "career", "health", "ai", "fintech", "cloud"]

// Sample cover images available in /public and rotated across events
const coverImages = ["/0ovv1.jpg", "/au7wu.jpg", "/placeholder.jpg"]

function pseudoRand(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function pick<T>(arr: T[], i: number) {
  return arr[Math.floor(pseudoRand(i) * arr.length)]
}

function makeDate(base: Date, offsetDays: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString()
}

export const allCategories = categories
export const allFormats = formats
export const allFees = fees
export const allCountries = Object.keys(citiesByCountry)
export const allCities = Object.values(citiesByCountry).flat()

const base = new Date()

export const events: EventItem[] = Array.from({ length: 220 }).map((_, i) => {
  const country = pick(allCountries, i + 11)
  const city = pick(citiesByCountry[country], i + 23)
  const category = pick(categories, i + 31)
  const format = pick(formats, i + 41)
  const fee = pick(fees, i + 53)
  const daysOffset = Math.floor(pseudoRand(i + 61) * 180) - 30 // from -30 to +150 days
  const duration = 1 + Math.floor(pseudoRand(i + 71) * 3)
  const startDate = makeDate(base, daysOffset)
  const endDate = makeDate(base, daysOffset + duration)
  const pop = Math.floor(pseudoRand(i + 83) * 1000)
  const rating = Math.round(pseudoRand(i + 97) * 50) / 10
  const name = `${category.split("&")[0].trim()} ${format} ${1900 + ((i * 7) % 125)}`
  const t1 = pick(tags, i + 101)
  const t2 = pick(tags, i + 109)
  const organizer = pick(organizers, i + 113)
  const cover = pick(coverImages, i + 127)
  return {
    id: `evt-${i + 1}`,
    name,
    category,
    organizer,
    description:
      "A premier gathering for professionals and enthusiasts. Expect world-class speakers, curated exhibitors, and vibrant networking opportunities.",
    startDate,
    endDate,
    city,
    country,
    venue: `${city} Expo Center`,
    format,
    entryFee: fee,
    rating,
    popularity: pop,
    tags: [t1, t2],
    coverImage: cover,
  }
})

export function getFeaturedEvents(count = 8): EventItem[] {
  return [...events].sort((a, b) => b.popularity - a.popularity).slice(0, count)
}

export function getTop100(): EventItem[] {
  return [...events].sort((a, b) => b.popularity - a.popularity).slice(0, 100)
}

export function getEventById(id: string): EventItem | undefined {
  return events.find((e) => e.id === id)
}

export const featuredOrganizers = Array.from(new Set(events.map((e) => e.organizer))).slice(0, 10)
