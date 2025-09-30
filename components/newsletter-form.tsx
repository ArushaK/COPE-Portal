"use client"
import { useState } from "react"
import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const { toast } = useToast()
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
    if (res.ok) {
      toast({ title: "Subscribed", description: "You will receive event announcements." })
      setEmail("")
    } else {
      toast({ title: "Failed", description: "Please try again later." })
    }
  }
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 max-w-md">
      <Input
        type="email"
        required
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-muted"
      />
      <Button type="submit" className="bg-primary text-primary-foreground">
        Submit
      </Button>
    </form>
  )
}
