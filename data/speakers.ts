import type { Speaker } from "@/lib/types"
import { events } from "./events"

const titles = [
  "Minister of Economy",
  "CTO",
  "Head of R&D",
  "Founder",
  "Professor",
  "Chief Scientist",
  "Director of Innovation",
]

const orgs = ["Gov of State", "TechNova", "HealthCore", "EduLabs", "FinEdge", "EcoGrid", "AutoWorks"]

export function getSpeakersForEvent(eventId: string): Speaker[] {
  const idx = Number(eventId.replace("evt-", "")) || 1
  const e = events[(idx - 1) % events.length]
  const total = 10
  return Array.from({ length: total }).map((_, i) => {
    const name = `${e.category.split(" ")[0]} Expert ${i + 1}`
    return {
      id: `spk-${idx}-${i}`,
      name,
      title: titles[i % titles.length],
      organization: orgs[i % orgs.length],
      city: ["New York", "London", e.city][i % 3],
      country: ["USA", "UK", e.country][i % 3],
      // Base path; UI will try multiple extensions (.jpg, .jfif, etc.)
      image: `/speakers/${i + 1}`,
    }
  })
}
