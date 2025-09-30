"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const html = document.documentElement
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    const initial = stored || "light"
    if (initial === "dark") html.classList.add("dark")
    setIsDark(initial === "dark")
  }, [])
  function toggle() {
    const html = document.documentElement
    const next = !isDark
    setIsDark(next)
    html.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }
  return (
    <Button type="button" variant="outline" onClick={toggle} aria-label="Toggle theme">
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  )
}
