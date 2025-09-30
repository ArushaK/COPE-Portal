"use client"
import { Provider } from "react-redux"
import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { store } from "@/lib/store"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RouteProgress>{children}</RouteProgress>
    </Provider>
  )
}

function RouteProgress({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  // show loading briefly on path changes
  useEffect(() => {
    if (!pathname) return
    setLoading(true)
    const id = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(id)
  }, [pathname])

  return (
    <>
      {loading && (
        <div className="fixed inset-x-0 top-0 z-50 h-1.5 overflow-hidden bg-primary/10">
          <div className="h-full w-1/3 animate-route-bar bg-primary"></div>
        </div>
      )}
      {children}
    </>
  )
}
