"use client"
import { useAppDispatch, useAppSelector } from "@/lib/store"
import { setLanguage, type Language } from "@/lib/slices/ui-slice"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function LanguageSwitcher() {
  const lang = useAppSelector((s) => s.ui.language)
  const dispatch = useAppDispatch()
  const onChange = (v: Language) => dispatch(setLanguage(v))
  return (
    <Select value={lang} onValueChange={(v) => onChange(v as Language)}>
      <SelectTrigger className="w-[90px]">
        <SelectValue placeholder="Lang" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="es">ES</SelectItem>
      </SelectContent>
    </Select>
  )
}
