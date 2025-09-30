"use client"
import type { EventItem } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useMemo, useState } from "react"

export function AboutTab({ event, imgBase }: { event: EventItem; imgBase?: string }) {
  const candidates = useMemo(() => {
    if (!imgBase) return [event.coverImage || "/placeholder.svg"]
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
  }, [imgBase, event.coverImage])
  const [srcIdx, setSrcIdx] = useState(0)
  useEffect(() => setSrcIdx(0), [candidates.join("|")])
  const currentSrc = candidates[srcIdx] || event.coverImage || "/placeholder.svg"
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2 overflow-hidden">
        <img
          src={currentSrc}
          alt={`${event.name} cover`}
          className="w-full h-60 object-cover"
          onError={() => setSrcIdx((n) => (n + 1 < candidates.length ? n + 1 : n))}
        />
        <CardContent className="p-4 space-y-3">
          <h3 className="text-xl font-semibold">Highlights</h3>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Quality of Participants • Display & Presentation</li>
            <li>Estimated Turnout • Global Networking</li>
            <li>Official Links • Editions & Frequency</li>
          </ul>
          <p className="text-pretty">{event.description}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">Details</h3>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <dt className="font-medium">Timings</dt>
              <dd>
                {new Date(event.startDate).toLocaleString()} - {new Date(event.endDate).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Entry Fees</dt>
              <dd>{event.entryFee}</dd>
            </div>
            <div>
              <dt className="font-medium">Event Type</dt>
              <dd>{event.format}</dd>
            </div>
            <div>
              <dt className="font-medium">Location</dt>
              <dd>
                {event.venue}, {event.city}, {event.country}
              </dd>
            </div>
            <div>
              <dt className="font-medium">Organizer</dt>
              <dd>{event.organizer}</dd>
            </div>
            <div>
              <dt className="font-medium">Ratings</dt>
              <dd>{event.rating.toFixed(1)} / 5</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
