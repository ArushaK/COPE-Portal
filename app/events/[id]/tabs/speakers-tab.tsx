"use client"
import { useMemo, useState } from "react"
import { getSpeakersForEvent } from "@/data/speakers"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Mic2, Building2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function SpeakersTab({ eventId, images }: { eventId: string; images?: string[] }) {
  const [q, setQ] = useState("")
  const speakers = useMemo(() => getSpeakersForEvent(eventId), [eventId])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return speakers
    return speakers.filter((s) => {
      const hay = `${s.name} ${s.title} ${s.organization} ${s.city} ${s.country}`.toLowerCase()
      return hay.includes(query)
    })
  }, [speakers, q])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Mic2 className="h-4 w-4 text-primary" />
        <Input
          placeholder="Search speakers, companies, or locations..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((s, i) => (
          <Card
            key={s.id}
            onClick={() => {
              const idx = speakers.findIndex((x) => x.id === s.id)
              setActiveIdx(idx)
              setOpen(true)
            }}
            className="cursor-pointer border-primary/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40"
          >
            <CardContent className="p-4 flex gap-3 items-center">
              <img
                src={images && images[i % (images?.length || 1)] ? images[i % (images?.length || 1)] : `${s.image}.jpg`}
                alt={s.name}
                className="h-16 w-16 rounded-md object-cover ring-1 ring-primary/20"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement
                  const base = s.image
                  const candidates = [
                    `${base}.jpg`,
                    `${base}.jpeg`,
                    `${base}.png`,
                    `${base}.jfif`,
                    `${base}.jiff`,
                    `${base}.webp`,
                    `${base}.gif`,
                    `${base}.JPG`,
                    `${base}.JPEG`,
                    `${base}.PNG`,
                    `${base}.JFIF`,
                    `${base}.JIFF`,
                    `${base}.WEBP`,
                    `${base}.GIF`,
                  ]
                  const idxAttr = el.getAttribute('data-idx')
                  const idx = idxAttr ? parseInt(idxAttr, 10) : 0
                  if (idx + 1 < candidates.length) {
                    el.setAttribute('data-idx', String(idx + 1))
                    el.src = candidates[idx + 1]
                  } else {
                    el.src = "/placeholder.svg?height=160&width=160&query=Speaker%20portrait"
                  }
                }}
              />
              <div className="min-w-0">
                <div className="font-medium text-foreground">{s.name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="truncate">
                    {s.title}, {s.organization}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {s.city}, {s.country}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">No speakers match your search.</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          {activeIdx != null && speakers[activeIdx] && (
            <SpeakerDetails
              s={speakers[activeIdx]}
              imgSrc={
                images && images[activeIdx % (images?.length || 1)]
                  ? images[activeIdx % (images?.length || 1)]
                  : `${speakers[activeIdx].image}.jpg`
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SpeakerDetails({ s, imgSrc }: { s: ReturnType<typeof getSpeakersForEvent>[number]; imgSrc: string }) {
  const bio = `Forbes AI50 List of 2025, ${s.organization} is a next‑generation company driving innovation in ${
    s.title.split(" ")[0] || "tech"
  }. Backed by global investors, building partnerships across ${s.country}.`;
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="sr-only">{s.name}</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center text-center">
        <img
          src={imgSrc}
          alt={s.name}
          className="h-56 w-56 object-cover rounded-md ring-1 ring-border"
          onError={(e) => {
            ;(e.currentTarget as HTMLImageElement).src = "/placeholder.svg?height=300&width=300&query=speaker"
          }}
        />
        <div className="mt-4 text-2xl font-semibold tracking-wide">{s.name}</div>
        <div className="text-muted-foreground">{s.title}</div>
        <div className="text-primary font-semibold uppercase tracking-wide">{s.organization}</div>
        <div className="text-sm text-muted-foreground">{s.country}</div>
      </div>
      <p className="text-center text-balance text-muted-foreground px-2">{bio}</p>
    </div>
  )
}
