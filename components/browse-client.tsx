"use client"
import { useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { hydrateFromQuery } from "@/lib/slices/filters-slice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { events } from "@/data/events"
import { EventCard } from "./event-card"

function withinCalendar(startISO: string, cal: ReturnType<typeof selectCal>) {
  const now = new Date()
  const start = new Date(startISO)
  const day = 1000 * 60 * 60 * 24
  const diffDays = Math.floor(
    (start.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / day,
  )
  switch (cal) {
    case "today":
      return start.toDateString() === now.toDateString()
    case "tomorrow":
      return diffDays === 1
    case "this-weekend": {
      const dayIdx = now.getDay()
      const satOffset = (6 - dayIdx + 7) % 7
      const sunOffset = (7 - dayIdx + 7) % 7
      const sat = new Date(now)
      sat.setDate(now.getDate() + satOffset)
      const sun = new Date(now)
      sun.setDate(now.getDate() + sunOffset)
      return (
        start >= new Date(sat.toDateString()) &&
        start <= new Date(new Date(sun.toDateString()).getTime() + 86400000 - 1)
      )
    }
    case "this-week": {
      const dayIdx = now.getDay()
      const end = new Date(now)
      end.setDate(now.getDate() + (7 - dayIdx))
      return start <= end && start >= new Date(now.toDateString())
    }
    case "next-week": {
      const dayIdx = now.getDay()
      const startOfNext = new Date(now)
      startOfNext.setDate(now.getDate() + (7 - dayIdx))
      const endOfNext = new Date(startOfNext)
      endOfNext.setDate(startOfNext.getDate() + 7)
      return start >= startOfNext && start <= endOfNext
    }
    case "next-month": {
      const startMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59)
      return start >= startMonth && start <= endMonth
    }
    case "next-3-months": {
      const startMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const endMonth = new Date(now.getFullYear(), now.getMonth() + 4, 0, 23, 59, 59)
      return start >= startMonth && start <= endMonth
    }
    default:
      return true
  }
}
type Cal = "today" | "tomorrow" | "this-weekend" | "this-week" | "next-week" | "next-month" | "next-3-months" | null
const selectCal = (s: any): Cal => s.filters.calendar

export function BrowseClient({ images }: { images?: string[] }) {
  const params = useSearchParams()
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.filters)

  // Hydrate from query once
  useMemo(() => {
    const obj: Record<string, string> = {}
    params.forEach((v, k) => (obj[k] = v))
    dispatch(hydrateFromQuery(obj))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const list = useMemo(() => {
    const q = filters.keyword?.toLowerCase() || ""
    return events.filter((e) => {
      // quick collections via special tags in query: virtual, top100, network
      // handled via formats/tags/popularity thresholds routed from homepage links

      if (filters.calendar && !withinCalendar(e.startDate, filters.calendar)) return false

      if (filters.categories.length && !filters.categories.includes(e.category)) return false
      if (filters.formats.length && !filters.formats.includes(e.format)) return false
      if (filters.fees.length && !filters.fees.includes(e.entryFee)) return false
      if (filters.cities.length && !filters.cities.includes(e.city)) return false
      if (filters.countries.length && !filters.countries.includes(e.country)) return false

      if (filters.topic && !e.tags.some((t) => t.toLowerCase().includes(filters.topic.toLowerCase()))) return false
      if (filters.eventName && !e.name.toLowerCase().includes(filters.eventName.toLowerCase())) return false
      if (filters.location) {
        const loc = filters.location.toLowerCase()
        if (![e.city.toLowerCase(), e.country.toLowerCase(), e.venue.toLowerCase()].some((v) => v.includes(loc)))
          return false
      }
      if (q) {
        const hay = `${e.name} ${e.category} ${e.city} ${e.country} ${e.tags.join(" ")}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      // designation is a UI-only tag; simulate by accepting all
      return true
    })
  }, [filters])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((e, i) => (
        <EventCard
          key={e.id}
          e={{ ...e, coverImage: images && images.length ? images[(i * 7 + e.id.length) % images.length] : e.coverImage }}
        />
      ))}
      {list.length === 0 && <p className="text-muted-foreground">No events match the filters.</p>}
    </div>
  )
}
