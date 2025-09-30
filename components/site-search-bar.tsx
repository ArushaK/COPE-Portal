"use client"
import { useState } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setKeyword, setTopic, setEventName, setLocation } from "@/lib/slices/filters-slice"
import { getT } from "@/lib/i18n"

export function SearchBar() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const dispatch = useAppDispatch()
  const lang = useAppSelector((s) => s.ui.language)
  const t = getT(lang)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Keyword search powers topic/event/location broadly; clear specific fields
    dispatch(setKeyword(query))
    dispatch(setTopic(""))
    dispatch(setEventName(""))
    dispatch(setLocation(""))

    const qs = new URLSearchParams()
    if (query) qs.set("q", query)
    router.push(`/browse?${qs.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <Input
        aria-label={t.searchAria}
        placeholder={t.searchPlaceholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-muted w-full"
      />
    </form>
  )
}
