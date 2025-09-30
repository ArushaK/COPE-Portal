import { notFound } from "next/navigation"
import { getEventById } from "@/data/events"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AboutTab } from "./tabs/about-tab"
import { ExhibitorsTab } from "./tabs/exhibitors-tab"
import { SpeakersTab } from "./tabs/speakers-tab"
import { BoothTab } from "./tabs/booth-tab"
import { readdirSync } from "fs"
import { join } from "path"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = getEventById(params.id)
  if (!event) return notFound()
  // If user came from featured grid using /events/{index}, reuse the same base path
  const numericId = Number((event.id || '').split('-').pop())
  const imgBase = Number.isFinite(numericId) ? `/events/${((numericId - 1) % 8) + 1}` : undefined
  // Resolve actual speaker images from public/speakers (supports mixed extensions)
  let speakerImages: string[] = []
  let eventImages: string[] = []
  try {
    const dir = join(process.cwd(), "public", "speakers")
    speakerImages = readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|gif|webp|svg|jfif|jiff)$/i.test(f))
      .sort()
      .slice(0, 10)
      .map((f) => `/speakers/${f}`)
  } catch {}
  try {
    const evDir = join(process.cwd(), "public", "events")
    eventImages = readdirSync(evDir)
      .filter((f) => /\.(jpe?g|png|gif|webp|svg|jfif|jiff)$/i.test(f))
      .sort()
      .map((f) => `/events/${f}`)
  } catch {}
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold">{event.name}</h1>
        <p className="text-muted-foreground">
          {event.category} • {event.city}, {event.country} • {event.format} • {event.entryFee}
        </p>
      </header>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="w-full flex gap-2 overflow-x-auto no-scrollbar">
          <TabsTrigger value="about" className="whitespace-nowrap">About</TabsTrigger>
          <TabsTrigger value="exhibitors" className="whitespace-nowrap">Exhibitors</TabsTrigger>
          <TabsTrigger value="speakers" className="whitespace-nowrap">Speakers</TabsTrigger>
          <TabsTrigger value="booth" className="whitespace-nowrap">Booth & Amenities</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <AboutTab event={event} imgBase={imgBase} />
        </TabsContent>
        <TabsContent value="exhibitors">
          <ExhibitorsTab eventId={event.id} images={eventImages} />
        </TabsContent>
        <TabsContent value="speakers">
          <SpeakersTab eventId={event.id} images={speakerImages} />
        </TabsContent>
        <TabsContent value="booth">
          <BoothTab eventId={event.id} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
