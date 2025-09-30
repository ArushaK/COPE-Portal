"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function SiteFooter() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) return null
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold text-primary">COPE Portal</div>
          <p className="text-muted-foreground mt-1">Your trusted partner for exhibition success and lead generation.</p>
        </div>
        <div>
          <div className="font-medium">Contact</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>Z3 Exhibition Services</li>
            <li>
              <a className="underline text-primary" href="mailto:info@z3exhibitions.com">
                info@z3exhibitions.com
              </a>
            </li>
            <li>
              <a className="underline text-primary" href="tel:+41441234567">
                +41 44 123 4567
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-medium">Address</div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            <li>Z3 Live Communication AG</li>
            <li>Hauptstrasse 123, 4000 Basel, Switzerland</li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>© 2025 COPE Portal. All rights reserved.</span>
          <nav className="flex items-center gap-3">
            <Link href="/browse" className="underline hover:text-foreground">
              Browse
            </Link>
            <Link href="/admin" className="underline hover:text-foreground">
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
