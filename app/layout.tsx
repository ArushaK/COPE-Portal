import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Providers from "./providers"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "COPE Portal — Cold Outreach Prospect Engine", // update title
  description: "Discover upcoming exhibitions and connect with potential prospects worldwide.", // update description
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <SiteHeader />
            {children}
            <SiteFooter />
          </Suspense>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
