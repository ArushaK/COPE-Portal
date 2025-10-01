"use client"
import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

type Item = { id: string; label: string; unitPrice: number }

const amenityGroups: { name: string; items: Item[] }[] = [
  {
    name: "Connectivity",
    items: [{ id: "wifi", label: "Wi‑Fi / High-speed Internet – reliable connectivity", unitPrice: 50 }],
  },
  {
    name: "Collaboration",
    items: [
      { id: "whiteboard", label: "Whiteboard / Flipchart with markers – for brainstorming and notes", unitPrice: 25 },
      { id: "stationery", label: "Stationery – pens, notepads, sticky notes", unitPrice: 20 },
    ],
  },
  {
    name: "A/V & Presentation",
    items: [
      {
        id: "sound",
        label: "Microphone / Speakers / Sound System – for presentations or larger groups",
        unitPrice: 80,
      },
      { id: "led-screen", label: "LED Screen", unitPrice: 180 },
      { id: "lighting", label: "Lighting Control – adjustable lighting for presentations", unitPrice: 30 },
      {
        id: "video-conf",
        label: "Video Conferencing Setup (Camera + Mic) – if remote participants are involved",
        unitPrice: 120,
      },
    ],
  },
  {
    name: "Comfort & Utilities",
    items: [
      { id: "aircon", label: "Air Conditioning / Climate Control – comfort for attendees", unitPrice: 90 },
      { id: "power-socket", label: "Power Socket", unitPrice: 15 },
      { id: "water", label: "Drinking Water Dispenser – hydration option apart from coffee", unitPrice: 35 },
    ],
  },
  {
    name: "Refreshments",
    items: [
      { id: "coffee-machine", label: "Coffee Machine", unitPrice: 120 },
      { id: "snacks", label: "Snacks / Pantry Access – light refreshments", unitPrice: 40 },
    ],
  },
  {
    name: "Furniture & Storage",
    items: [
      { id: "chair", label: "Chair", unitPrice: 10 },
      { id: "round-table", label: "Round Table", unitPrice: 40 },
      { id: "storage", label: "Storage Cabinets / Lockers – for temporary belongings", unitPrice: 45 },
    ],
  },
  {
    name: "Way finding & IDs",
    items: [{ id: "signage", label: "Signage / Name Tags / Direction Boards – for organized events", unitPrice: 25 }],
  },
  {
    name: "Hygiene",
    items: [{ id: "hygiene", label: "Sanitizers / Tissues / Waste Bins – hygiene essentials", unitPrice: 20 }],
  },
  {
    name: "Accessibility",
    items: [
      {
        id: "accessibility",
        label: "Accessibility Features – wheelchair access, ramps, accessible washrooms",
        unitPrice: 60,
      },
    ],
  },
]

export function BoothTab({ eventId }: { eventId: string }) {
  const [packageType, setPackageType] = useState<"std" | "custom" | null>("std")
  const [customSqm, setCustomSqm] = useState(9)
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [contactPerson, setContactPerson] = useState("")
  const [designation, setDesignation] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [address, setAddress] = useState("")
  const [counts, setCounts] = useState<Record<string, number>>({})

  const stdPrice = 600 // for 9 sq.m
  const customPerSqm = 70

  const selected: { id: string; label: string; qty: number; unitPrice: number }[] = useMemo(() => {
    const all = amenityGroups.flatMap((g) => g.items)
    return Object.entries(counts)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const it = all.find((a) => a.id === id)!
        return { id, label: it.label, qty, unitPrice: it.unitPrice }
      })
  }, [counts])

  const total = useMemo(() => {
    const pkg = packageType === "std" ? stdPrice : packageType === "custom" ? customPerSqm * Math.max(1, customSqm) : 0
    const items = selected.reduce((sum, x) => sum + x.qty * x.unitPrice, 0)
    return pkg + items
  }, [packageType, customSqm, selected])

  const { toast } = useToast()

  async function submitLead() {
    const res = await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        eventId,
        selection: {
          package:
            packageType === "std"
              ? "Standard Booth (9 sq.m)"
              : packageType === "custom"
                ? "Custom-built (per sq.m)"
                : undefined,
          customSqm: packageType === "custom" ? customSqm : undefined,
          items: selected,
          total,
          contact: {
            email,
            company,
            contactPerson,
            designation,
            contactNumber,
            address,
          },
        },
      }),
    })
    if (res.ok) {
      toast({ title: "Request submitted", description: "Our team will contact you shortly." })
      setCounts({})
      setEmail("")
      setCompany("")
      setContactPerson("")
      setDesignation("")
      setContactNumber("")
      setAddress("")
      setPackageType("std")
      setCustomSqm(9)
    } else {
      toast({ title: "Submission failed", description: "Please try again." })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardContent className="p-4 space-y-4">
          <div>
            <h4 className="font-semibold">Booth Package</h4>
            <div className="mt-2 grid gap-2">
              <Label className="flex items-center gap-2">
                <Checkbox checked={packageType === "std"} onCheckedChange={() => setPackageType("std")} />
                Standard Booth (9 sq.m.) — ${stdPrice}
              </Label>
              <Label className="flex items-center gap-2">
                <Checkbox checked={packageType === "custom"} onCheckedChange={() => setPackageType("custom")} />
                Custom-built Participation (per sq.m.) — ${customPerSqm}/sq.m
              </Label>
              {packageType === "custom" && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Area</span>
                  <Input
                    type="number"
                    min={1}
                    value={customSqm}
                    onChange={(e) => setCustomSqm(Number(e.target.value))}
                    className="w-24 bg-muted"
                  />
                  <span className="text-sm text-muted-foreground">sq.m</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Amenities</h4>
            <div className="mt-3 space-y-4">
              {amenityGroups.map((group) => (
                <div key={group.name} className="space-y-2">
                  <div className="text-sm font-medium text-primary">{group.name}</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {group.items.map((a) => (
                      <div key={a.id} className="border rounded-md p-3 bg-card flex items-center justify-between">
                        <div>
                          <div className="font-medium">{a.label}</div>
                          <div className="text-xs text-muted-foreground">${a.unitPrice} each</div>
                        </div>
                        {a.id === "wifi" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">No</span>
                            <Switch
                              checked={(counts[a.id] || 0) > 0}
                              onCheckedChange={(v) => setCounts((c) => ({ ...c, [a.id]: v ? 1 : 0 }))}
                            />
                            <span className="text-sm">Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCounts((c) => ({ ...c, [a.id]: Math.max(0, (c[a.id] || 0) - 1) }))}
                            >
                              -
                            </Button>
                            <span className="w-6 text-center">{counts[a.id] || 0}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setCounts((c) => ({ ...c, [a.id]: (c[a.id] || 0) + 1 }))}
                            >
                              +
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h4 className="font-semibold">Summary</h4>
          <div className="text-sm text-muted-foreground">
            Package:{" "}
            {packageType === "std"
              ? "Standard Booth (9 sq.m.)"
              : packageType === "custom"
                ? `Custom-built (${customSqm} sq.m.)`
                : "None"}
          </div>
          <div className="text-sm">
            {selected.length ? (
              <ul className="list-disc pl-5">
                {selected.map((s) => (
                  <li key={s.id}>
                    {s.label} × {s.qty} — ${s.qty * s.unitPrice}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground text-sm">No amenities selected.</div>
            )}
          </div>
          <div className="font-semibold">Total: ${total}</div>
          <div className="pt-2 space-y-2">
            <div>
              <label className="text-sm">Company Name</label>
              <Input
                required
                placeholder="Company Inc."
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="bg-muted mt-1"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-sm">Contact Person</label>
                <Input
                  required
                  placeholder="Jane Doe"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="bg-muted mt-1"
                />
              </div>
              <div>
                <label className="text-sm">Designation</label>
                <Input
                  placeholder="Marketing Manager"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="bg-muted mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-sm">Contact Number</label>
                <Input
                  required
                  placeholder="+41 44 123 4567"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="bg-muted mt-1"
                />
              </div>
              <div>
                <label className="text-sm">Contact Email</label>
                <Input
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-muted mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm">Address</label>
              <Input
                placeholder="Street, City, Country"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-muted mt-1"
              />
            </div>
          </div>
          <Button className="w-full bg-primary text-primary-foreground" onClick={submitLead}>
            Submit Request
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
