"use client"
import {
  toggleCategory,
  toggleFormat,
  toggleFee,
  toggleCity,
  toggleCountry,
  toggleDesignation,
  setCalendar,
  resetFilters,
} from "@/lib/slices/filters-slice"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { allCategories, allCities, allCountries, allFormats, allFees } from "@/data/events"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarDays } from "lucide-react"

const designations = ["Student", "Manager", "Director", "Founder", "Minister of Economy"]

export function FilterSidebar() {
  const d = useAppDispatch()
  const f = useAppSelector((s) => s.filters)
  const calOptions = [
    { key: "today", label: "Today" },
    { key: "tomorrow", label: "Tomorrow" },
    { key: "this-weekend", label: "This Weekend" },
    { key: "this-week", label: "This Week" },
    { key: "next-week", label: "Next Week" },
    { key: "next-month", label: "Next Month" },
    { key: "next-3-months", label: "Next 3 Months" },
  ] as const

  return (
    <aside className="w-full md:w-72 shrink-0 md:sticky md:top-20 h-max border rounded-md bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-4 w-4" />
        <h3 className="font-semibold">Filters</h3>
      </div>

      <div className="space-y-3">
        <section>
          <h4 className="text-sm font-medium mb-2">Calendar</h4>
          <div className="flex flex-wrap gap-2">
            {/* "All" option (default) */}
            <Button
              size="sm"
              variant={f.calendar === null ? "default" : "outline"}
              className={f.calendar === null ? "bg-primary text-primary-foreground" : ""}
              onClick={() => d(setCalendar(null))}
            >
              All
            </Button>
            {calOptions.map((c) => (
              <Button
                key={c.key}
                size="sm"
                variant={f.calendar === c.key ? "default" : "outline"}
                className={f.calendar === c.key ? "bg-primary text-primary-foreground" : ""}
                onClick={() => d(setCalendar(f.calendar === c.key ? null : (c.key as any)))}
              >
                {c.label}
              </Button>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <h4 className="text-sm font-medium mb-2">Category</h4>
          <Label className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={f.categories.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  // clear all selected categories
                  f.categories.forEach((c) => d(toggleCategory(c)))
                }
              }}
            />
            All
          </Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-auto pr-1">
            {allCategories.map((c) => (
              <Label key={c} className="flex items-center gap-2">
                <Checkbox checked={f.categories.includes(c)} onCheckedChange={() => d(toggleCategory(c))} />
                {c}
              </Label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2">Format</h4>
          <Label className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={f.formats.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  f.formats.forEach((fmt) => d(toggleFormat(fmt)))
                }
              }}
            />
            All
          </Label>
          <div className="grid gap-2">
            {allFormats.map((fmt) => (
              <Label key={fmt} className="flex items-center gap-2">
                <Checkbox checked={f.formats.includes(fmt)} onCheckedChange={() => d(toggleFormat(fmt))} />
                {fmt}
              </Label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2">Entry Fees</h4>
          <Label className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={f.fees.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  f.fees.forEach((fee) => d(toggleFee(fee)))
                }
              }}
            />
            All
          </Label>
          <div className="grid gap-2">
            {allFees.map((fee) => (
              <Label key={fee} className="flex items-center gap-2">
                <Checkbox checked={f.fees.includes(fee)} onCheckedChange={() => d(toggleFee(fee))} />
                {fee}
              </Label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2">City</h4>
          <Label className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={f.cities.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  f.cities.forEach((city) => d(toggleCity(city)))
                }
              }}
            />
            All
          </Label>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-auto">
            {allCities.slice(0, 25).map((city) => (
              <Label key={city} className="flex items-center gap-2">
                <Checkbox checked={f.cities.includes(city)} onCheckedChange={() => d(toggleCity(city))} />
                {city}
              </Label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2">Country</h4>
          <Label className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={f.countries.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  f.countries.forEach((country) => d(toggleCountry(country)))
                }
              }}
            />
            All
          </Label>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-auto">
            {allCountries.map((country) => (
              <Label key={country} className="flex items-center gap-2">
                <Checkbox checked={f.countries.includes(country)} onCheckedChange={() => d(toggleCountry(country))} />
                {country}
              </Label>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-sm font-medium mb-2">Designation</h4>
          <Label className="flex items-center gap-2 mb-1">
            <Checkbox
              checked={f.designation.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  f.designation.forEach((role) => d(toggleDesignation(role)))
                }
              }}
            />
            All
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {designations.map((role) => (
              <Label key={role} className="flex items-center gap-2">
                <Checkbox checked={f.designation.includes(role)} onCheckedChange={() => d(toggleDesignation(role))} />
                {role}
              </Label>
            ))}
          </div>
        </section>

        <Button variant="secondary" onClick={() => d(resetFilters())} className="w-full">
          Reset
        </Button>
      </div>
    </aside>
  )
}
