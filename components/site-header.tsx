"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./site-search-bar"
import { LanguageSwitcher } from "./language-switcher"
import { ThemeToggle } from "./theme-toggle"
import { usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/store"
import { getT } from "@/lib/i18n"

export function SiteHeader() {
  const pathname = usePathname()
  const showSearch = pathname !== "/admin"
  const lang = useAppSelector((s) => s.ui.language)
  const t = getT(lang)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
        <Link href="/" className="font-semibold text-2xl text-primary">
          COPE Portal
          <span className="sr-only">Home</span>
        </Link>

        {showSearch && (
          <div className="flex-1 min-w-0">
            <SearchBar />
          </div>
        )}

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {/* <ThemeToggle /> */}
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/admin">{t.adminPortal}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
