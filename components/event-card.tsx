"use client"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EventItem } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"

export function EventCard({ e, i, imgBase }: { e: EventItem; i?: number; imgBase?: string }) {
  const start = new Date(e.startDate)
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  const candidates = useMemo(() => {
    if (!imgBase) return [e.coverImage || "/placeholder.svg"]
    const exts = [
      ".jpg",
      ".jpeg",
      ".png",
      ".jfif",
      ".jiff",
      ".gif",
      ".webp",
      ".svg",
      ".JPG",
      ".JPEG",
      ".PNG",
      ".JFIF",
      ".JIFF",
      ".GIF",
      ".WEBP",
      ".SVG",
    ]
    return exts.map((ext) => `${imgBase}${ext}`)
  }, [imgBase, e.coverImage])

  const [srcIdx, setSrcIdx] = useState(0)
  useEffect(() => setSrcIdx(0), [candidates.join("|")])
  const currentSrc = candidates[srcIdx] || e.coverImage || "/placeholder.svg"
  return (
    <Link
      href={`/events/${e.id}`}
      className="block group will-change-transform"
      style={i != null ? { animationDelay: `${Math.min(i, 12) * 60}ms` } : undefined}
    >
      <Card className="overflow-hidden h-full transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-lg animate-fade-in-up">
        <CardHeader className="p-0">
          <img
            src={currentSrc}
            alt={`${e.name} cover`}
            className="w-full h-40 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            onError={() => setSrcIdx((n) => (n + 1 < candidates.length ? n + 1 : n))}
          />
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-pretty text-lg">{e.name}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {start.toLocaleDateString(undefined, options)} • {e.city}, {e.country}
          </div>
          <div className="text-xs mt-2 flex flex-wrap gap-2">
            <span className="rounded bg-muted px-2 py-0.5">{e.category}</span>
            <span className="rounded bg-muted px-2 py-0.5">{e.format}</span>
            <span className="rounded bg-muted px-2 py-0.5">{e.entryFee}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
