import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { EntryFee, EventFormat } from "../types"

export type CalendarQuick =
  | "today"
  | "tomorrow"
  | "this-weekend"
  | "this-week"
  | "next-week"
  | "next-month"
  | "next-3-months"
  | null

export interface FiltersState {
  keyword: string
  topic: string
  eventName: string
  location: string
  categories: string[]
  formats: EventFormat[]
  fees: EntryFee[]
  cities: string[]
  countries: string[]
  designation: string[] // simple tag filter
  calendar: CalendarQuick
}

const initialState: FiltersState = {
  keyword: "",
  topic: "",
  eventName: "",
  location: "",
  categories: [],
  formats: [],
  fees: [],
  cities: [],
  countries: [],
  designation: [],
  calendar: null,
}

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setKeyword: (s, a: PayloadAction<string>) => void (s.keyword = a.payload),
    setTopic: (s, a: PayloadAction<string>) => void (s.topic = a.payload),
    setEventName: (s, a: PayloadAction<string>) => void (s.eventName = a.payload),
    setLocation: (s, a: PayloadAction<string>) => void (s.location = a.payload),
    toggleCategory: (s, a: PayloadAction<string>) => {
      const i = s.categories.indexOf(a.payload)
      if (i >= 0) s.categories.splice(i, 1)
      else s.categories.push(a.payload)
    },
    toggleFormat: (s, a: PayloadAction<EventFormat>) => {
      const i = s.formats.indexOf(a.payload)
      if (i >= 0) s.formats.splice(i, 1)
      else s.formats.push(a.payload)
    },
    toggleFee: (s, a: PayloadAction<keyof Record<EntryFee, any>>) => {
      const fee = a.payload as EntryFee
      const i = s.fees.indexOf(fee)
      if (i >= 0) s.fees.splice(i, 1)
      else s.fees.push(fee)
    },
    toggleCity: (s, a: PayloadAction<string>) => {
      const i = s.cities.indexOf(a.payload)
      if (i >= 0) s.cities.splice(i, 1)
      else s.cities.push(a.payload)
    },
    toggleCountry: (s, a: PayloadAction<string>) => {
      const i = s.countries.indexOf(a.payload)
      if (i >= 0) s.countries.splice(i, 1)
      else s.countries.push(a.payload)
    },
    toggleDesignation: (s, a: PayloadAction<string>) => {
      const i = s.designation.indexOf(a.payload)
      if (i >= 0) s.designation.splice(i, 1)
      else s.designation.push(a.payload)
    },
    setCalendar: (s, a: PayloadAction<CalendarQuick>) => void (s.calendar = a.payload),
    resetFilters: () => initialState,
    hydrateFromQuery: (s, a: PayloadAction<Record<string, string | string[]>>) => {
      const q = a.payload
      const list = (v?: string | string[]) => (Array.isArray(v) ? v : v ? v.split(",").map(decodeURIComponent) : [])
      s.keyword = (q.q as string) || s.keyword
      s.topic = (q.topic as string) || s.topic
      s.eventName = (q.event as string) || s.eventName
      s.location = (q.loc as string) || s.location
      s.categories = list(q.cat)
      s.formats = list(q.fmt) as any
      s.fees = list(q.fee) as any
      s.cities = list(q.city)
      s.countries = list(q.country)
      s.designation = list(q.role)
      s.calendar = ((q.cal as string) || null) as any
    },
  },
})

export const {
  setKeyword,
  setTopic,
  setEventName,
  setLocation,
  toggleCategory,
  toggleFormat,
  toggleFee,
  toggleCity,
  toggleCountry,
  toggleDesignation,
  setCalendar,
  resetFilters,
  hydrateFromQuery,
} = filtersSlice.actions

export default filtersSlice.reducer
