import { FilterSidebar } from "@/components/filter-sidebar"
import { BrowseClient } from "@/components/browse-client"
import { Suspense } from "react"
import { readdirSync } from "fs"
import { join } from "path"

export default function BrowsePage() {
  // Resolve event images on the server
  let eventImages: string[] = []
  try {
    const dir = join(process.cwd(), "public", "events")
    eventImages = readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|gif|webp|svg|jfif|jiff)$/i.test(f))
      .map((f) => `/events/${f}`)
  } catch {}
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <FilterSidebar />
        <div className="flex-1">
          <Suspense>
            <BrowseClient images={eventImages} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
