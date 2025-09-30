"use client"
import { useEffect, useRef, useState } from "react"
import { MessageCircle, X } from "lucide-react"

type ChatMsg = { role: "assistant" | "user"; content: string }

const intro = `👋 Hello! I'm your COPE AI Assistant. I can help you with:

• Finding the right exhibitions for your business
• Lead generation strategies
• Exhibition planning and preparation
• Swiss pavilion opportunities

To get started, please share your name and email:`

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [started, setStarted] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: "assistant", content: intro }])
  const [input, setInput] = useState("")
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [msgs.length, open])

  function validEmail(v: string) {
    return /.+@.+\..+/.test(v.trim())
  }

  function startChat(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !validEmail(email)) return
    setStarted(true)
    setMsgs((m) => [
      ...m,
      {
        role: "assistant",
        content: `Great to meet you, ${name.split(" ")[0]}! I'm here to help you with exhibition opportunities and lead generation. What would you like to know?`,
      },
    ])
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setMsgs((m) => [...m, { role: "user", content: text }])
    setInput("")
    // simple scripted helper response
    setTimeout(() => {
      const tip = suggest(text)
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: tip,
        },
      ])
    }, 300)
  }

  function suggest(text: string): string {
    const t = text.toLowerCase()
    if (t.includes("lead") || t.includes("email"))
      return "Here are quick lead-gen tips: 1) Filter events by your ICP. 2) Export exhibitors and enrich contacts. 3) Send a 3-step email sequence. Need a sample sequence?"
    if (t.includes("exhibition") || t.includes("event"))
      return "Tell me your industry and location preference. I’ll recommend upcoming exhibitions and exhibitors to meet."
    if (t.includes("swiss")) return "For Swiss pavilion opportunities, I can share eligible events and costs. Which month are you targeting?"
    return "Got it. Could you share more details so I can recommend the best next step?"
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="chat-fab fixed bottom-4 right-4 z-50 rounded-full bg-primary text-primary-foreground shadow-lg p-3 hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] max-w-sm bg-card border rounded-lg shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <div className="font-semibold">COPE AI Assistant</div>
            <button aria-label="Close chat" onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="px-3 py-2 space-y-2 max-h-80 overflow-y-auto">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "assistant" ? "text-sm" : "text-sm text-right"}>
                <div
                  className={
                    m.role === "assistant"
                      ? "inline-block rounded-md bg-muted px-3 py-2 whitespace-pre-wrap"
                      : "inline-block rounded-md bg-primary text-primary-foreground px-3 py-2 whitespace-pre-wrap"
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {!started ? (
            <form onSubmit={startChat} className="p-3 border-t space-y-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded border bg-background px-3 py-2"
                required
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded border bg-background px-3 py-2"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md bg-primary text-primary-foreground px-3 py-2 disabled:opacity-50"
                disabled={!name.trim() || !validEmail(email)}
              >
                Start Chat
              </button>
            </form>
          ) : (
            <form onSubmit={sendMessage} className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded border bg-background px-3 py-2"
              />
              <button type="submit" className="rounded-md bg-primary text-primary-foreground px-3 py-2">
                Send
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}


