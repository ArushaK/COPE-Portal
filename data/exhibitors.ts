import type { Exhibitor } from "@/lib/types"
import { events } from "./events"

const productPool = [
  "AI Platform",
  "Cloud Storage",
  "3D Printers",
  "AR/VR Headsets",
  "Medical Devices",
  "EdTech Software",
  "Banking APIs",
  "Solar Panels",
  "Robotics Kits",
  "CRM Tools",
]

export function getExhibitorsForEvent(eventId: string): Exhibitor[] {
  const idx = Number(eventId.replace("evt-", "")) || 1
  const e = events[(idx - 1) % events.length]
  const total = 180 + ((idx * 13) % 200)
  return Array.from({ length: total }).map((_, i) => {
    const city = i % 2 === 0 ? e.city : ["Paris", "Madrid", "Zurich", e.city][i % 4]
    const country = i % 3 === 0 ? e.country : ["France", "Spain", "Switzerland", e.country][i % 4]
    return {
      id: `exh-${idx}-${i}`,
      name: `${e.category.split(" ")[0]} Corp ${i}`,
      city,
      country,
      booth: `B${(i % 40) + 1}`,
      products: [productPool[i % productPool.length], productPool[(i + 3) % productPool.length]],
      description: "Leading solutions provider showcasing the latest innovations aligned to the event theme.",
    }
  })
}
