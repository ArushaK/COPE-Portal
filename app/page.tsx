import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CategoryGrid } from "@/components/category-grid"
import { getFeaturedEvents, events } from "@/data/events"
import { EventCard } from "@/components/event-card"
import { NewsletterForm } from "@/components/newsletter-form"
import { ActionButtonsSection } from "@/components/action-buttons-section"
import { countryToFlag, countryToFlagPath, cityToIcon } from "@/lib/utils"
import { readdirSync } from "fs"
import { join } from "path"
import ChatWidget from "@/components/chat-widget"

export default function HomePage() {
  const featured = getFeaturedEvents(8)
  // Load actual files from public/events (supports mixed extensions)
  let eventImages: string[] = []
  try {
    const dir = join(process.cwd(), "public", "events")
    eventImages = readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|gif|webp|svg|jfif|jiff)$/i.test(f))
      .map((f) => `/events/${f}`)
  } catch {}
  const featuredWithCovers = featured.map((e, i) => ({
    ...e,
    coverImage: eventImages.length ? eventImages[i % eventImages.length] : e.coverImage,
  }))
  const cities = Array.from(new Set(events.slice(0, 60).map((e) => e.city))).slice(0, 12)
  const countries = Array.from(new Set(events.map((e) => e.country))).slice(0, 12)

  return (
    <main>
      <section className="bg-primary/5 border-b">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs font-medium">
                Cold Outreach Prospect Engine
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-balance">COPE Portal</h1>
              <p className="text-muted-foreground text-pretty">
                Discover upcoming exhibitions and connect with potential prospects worldwide.
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <Button asChild variant="outline">
                <Link href="/browse">All Events</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/browse?fmt=Virtual">Virtual</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/browse?cal=today">Happening Today</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/browse?top=100">Top 100</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/browse?q=networking">Network</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CategoryGrid />

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Featured Events — Handpicked popular events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredWithCovers.map((e, i) => (
            <EventCard key={e.id} e={e} i={i} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h3 className="text-xl font-semibold mb-3">Browse Events by City</h3>
        <div className="flex flex-wrap gap-2">
          {cities.map((c) => (
            <Link
              key={c}
              href={`/browse?city=${encodeURIComponent(c)}`}
              className="rounded border bg-card px-3 py-2 hover:bg-accent flex items-center gap-2"
            >
              <span className="opacity-80">{cityToIcon(c)}</span>
              <span>{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h3 className="text-xl font-semibold mb-3">Browse Events by Country</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {countries.map((c) => {
            const count = events.filter((e) => e.country === c).length
            const flagSrc = countryToFlagPath(c)
            return (
              <Link
                key={c}
                href={`/browse?country=${encodeURIComponent(c)}`}
                className="rounded-md border bg-card p-4 hover:bg-accent flex items-center gap-3 shadow-sm"
              >
                <img src={flagSrc} alt={`${c} flag`} className="h-6 w-8 object-cover rounded-sm ring-1 ring-border" />
                <div>
                  <div className="font-medium">{c}</div>
                  <div className="text-xs text-muted-foreground">{(count / 1000).toFixed(1)}k Events</div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <h3 className="text-xl font-semibold mb-3">Featured Organizers — Worldwide leading event organisers</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(featured.map((e) => e.organizer))).map((o) => (
            <Link
              key={o}
              href={`/browse?q=${encodeURIComponent(o)}`}
              className="rounded border bg-card px-3 py-2 hover:bg-accent"
            >
              {o}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 border-t">
        <div className="mx-auto max-w-7xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-semibold">Never miss out on good events</h4>
            <p className="text-muted-foreground">Get announcements for upcoming events.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <ActionButtonsSection />

      <ChatWidget />
    </main>
  )
}
