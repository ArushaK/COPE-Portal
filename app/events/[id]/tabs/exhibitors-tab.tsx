"use client"
import { getExhibitorsForEvent } from "@/data/exhibitors"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ExhibitorsTab({ eventId, images }: { eventId: string; images?: string[] }) {
  const exhibitors = useMemo(() => getExhibitorsForEvent(eventId), [eventId])
  const [query, setQuery] = useState("")
  const allProducts = Array.from(new Set(exhibitors.flatMap((e) => e.products)))
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  const list = useMemo(() => {
    return exhibitors
      .filter((x) => (query ? x.name.toLowerCase().includes(query.toLowerCase()) : true))
      .filter((x) => (selectedProducts.length ? x.products.some((p) => selectedProducts.includes(p)) : true))
      .filter((x) => (selectedLocations.length ? selectedLocations.includes(`${x.city}, ${x.country}`) : true))
      .slice(0, 30) // show first 30 of current edition
  }, [exhibitors, query, selectedProducts, selectedLocations])

  const allLocations = Array.from(new Set(exhibitors.map((x) => `${x.city}, ${x.country}`))).slice(0, 30)

  function toggle(arr: string[], v: string, set: (n: string[]) => void) {
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <aside className="md:col-span-1 border rounded-md p-4 bg-card">
        <h4 className="font-semibold mb-2">Filters</h4>
        <div className="space-y-3">
          <section>
            <h5 className="text-sm font-medium mb-1">Products</h5>
            <div className="grid gap-2 max-h-40 overflow-auto">
              {allProducts.map((p) => (
                <Label key={p} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedProducts.includes(p)}
                    onCheckedChange={() => toggle(selectedProducts, p, setSelectedProducts)}
                  />
                  {p}
                </Label>
              ))}
            </div>
          </section>
          <section>
            <h5 className="text-sm font-medium mb-1">Location</h5>
            <div className="grid gap-2 max-h-40 overflow-auto">
              {allLocations.map((l) => (
                <Label key={l} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedLocations.includes(l)}
                    onCheckedChange={() => toggle(selectedLocations, l, setSelectedLocations)}
                  />
                  {l}
                </Label>
              ))}
            </div>
          </section>
        </div>
      </aside>
      <div className="md:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Exhibitors List • Total {exhibitors.length}, showing {list.length} of Current Edition
          </div>
          <Input
            placeholder="Search by company name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-xs bg-muted"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {list.map((x) => (
            <Card
              key={x.id}
              onClick={() => {
                setActiveId(x.id)
                setOpen(true)
              }}
              className="cursor-pointer hover:shadow-md transition"
            >
              <CardContent className="p-4">
                <div className="font-medium">{x.name}</div>
                <div className="text-sm text-muted-foreground">
                  {x.city}, {x.country} • Booth {x.booth}
                </div>
                <div className="text-xs mt-2">
                  {x.description}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {x.products.map((p) => (
                      <span key={p} className="rounded bg-muted px-2 py-0.5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-2xl">
            {activeId && (
              <ExhibitorDetails
                ex={exhibitors.find((e) => e.id === activeId)!}
                logoSrc={(() => {
                  if (!images || !images.length) return undefined
                  const idx = exhibitors.findIndex((e) => e.id === activeId)
                  return images[(idx * 5 + activeId.length) % images.length]
                })()}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function ExhibitorDetails({ ex, logoSrc }: { ex: ReturnType<typeof getExhibitorsForEvent>[number]; logoSrc?: string }) {
  const highlights = [
    "Leading solutions provider showcasing the latest innovations",
    "Live demos at the booth and meeting slots available",
    "Partners across Europe, APAC, and North America",
  ]
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="text-xl">{ex.name}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={`${ex.name} visual`}
              className="rounded-md aspect-[4/3] object-cover ring-1 ring-border w-full"
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = "/placeholder.svg?height=240&width=320&query=exhibitor"
              }}
            />
          ) : (
            <div className="rounded-md bg-muted aspect-[4/3] flex items-center justify-center text-muted-foreground">
              Logo / Visual
            </div>
          )}
        </div>
        <div className="md:col-span-2 space-y-2">
          <div className="text-sm text-muted-foreground">
            {ex.city}, {ex.country} • Booth {ex.booth}
          </div>
          <p className="text-sm">{ex.description}</p>
          <div className="flex flex-wrap gap-2">
            {ex.products.map((p) => (
              <span key={p} className="rounded bg-primary/10 text-primary px-2 py-0.5 text-xs">
                {p}
              </span>
            ))}
          </div>
          <ul className="list-disc pl-5 text-sm text-muted-foreground">
            {highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
