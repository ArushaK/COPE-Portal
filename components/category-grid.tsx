"use client"
import Link from "next/link"
import { useState } from "react"
import { allCategories } from "@/data/events"
import { Button } from "@/components/ui/button"
import {
  GraduationCap,
  Stethoscope,
  Cpu,
  Landmark,
  Utensils,
  Car,
  Plane,
  Hammer,
  Leaf,
  Sparkles,
} from "lucide-react"

function CategoryIcon({ name }: { name: string }) {
  const className = "h-4 w-4 text-primary"
  if (name.includes("Education")) return <GraduationCap className={className} />
  if (name.includes("Medical") || name.includes("Pharma")) return <Stethoscope className={className} />
  if (name.includes("IT") || name.includes("Technology")) return <Cpu className={className} />
  if (name.includes("Banking") || name.includes("Finance")) return <Landmark className={className} />
  if (name.includes("Food") || name.includes("Beverage")) return <Utensils className={className} />
  if (name.includes("Automotive")) return <Car className={className} />
  if (name.includes("Travel") || name.includes("Tourism")) return <Plane className={className} />
  if (name.includes("Construction")) return <Hammer className={className} />
  if (name.includes("Energy") || name.includes("Environment")) return <Leaf className={className} />
  if (name.includes("Fashion") || name.includes("Beauty")) return <Sparkles className={className} />
  return <Sparkles className={className} />
}

export function CategoryGrid() {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? allCategories : allCategories.slice(0, 6)
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4 text-balance">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {visible.map((c) => (
          <Link
            key={c}
            href={`/browse?cat=${encodeURIComponent(c)}`}
            className="rounded-md border bg-card px-3 py-3 hover:bg-accent flex items-center gap-2"
          >
            <CategoryIcon name={c} />
            <span>{c}</span>
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={() => setExpanded((v) => !v)} variant="ghost" className="px-0">
          {expanded ? "Show less" : "Show more"}
        </Button>
      </div>
    </section>
  )
}
