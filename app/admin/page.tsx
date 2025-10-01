"use client"
import { useEffect, useMemo, useState } from "react"
import { events as publicEvents } from "@/data/events"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import {
  Download,
  Eye,
  Mail,
  Pencil,
  Plus,
  Trash2,
  Check,
  Building2 as Buildings2,
  Mailbox,
  BarChart3,
  Users2,
  MessageCircle,
  FileDown,
  CalendarCheck,
  MousePointerClick,
  FileText,
  LogOut,
  ExternalLink,
  TrendingUp,
} from "lucide-react"
import { useAppSelector } from "@/lib/store"
import { getT } from "@/lib/i18n"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { useToast } from "@/hooks/use-toast"
import { type ExhibitionDetails, type ExhibitionCore } from "@/components/admin/exhibition-wizard"

type Exhibition = {
  id: string
  name: string
  industry: string
  city: string
  country: string
  startDate: string
  endDate: string
  status: "published" | "draft"
}
type Lead = {
  id: string
  name: string
  email: string
  company: string
  source: string
  status: "new" | "contacted" | "closed" | "approved"
}

type LeadRow = {
  id: string
  company: string
  person: string
  email: string
  phone: string
  score: number
  size: "Startup" | "SME" | "Large"
  source: string
  status: "new" | "contacted" | "closed" | "approved"
}

type Settings = {
  companyName: string
  websiteUrl: string
  contactEmail: string
  companyAddress: string
  phoneCta: string
  openaiKey: string
  emailServiceProvider: string
  emailApiKey: string
  linkedinApiKey: string
  contactRequired: {
    firstName: boolean
    lastName: boolean
    email: boolean
    phone: boolean
    company: boolean
  }
  contactOptional: {
    industry: boolean
    country: boolean
    newsletter: boolean
  }
  contactSuccessMessage: string
  meetingSlots: string[]
  meetingDurationMins: number
  meetingAdvanceDays: number
  meetingConfirmMessage: string
  excelMaxFileMb: number
  liveChatEnabled: boolean
  chatWidgetPosition: "Bottom Right" | "Bottom Left"
  chatWelcomeMessage: string
  sessionTimeoutMins: number
  twoFactorEnabled: boolean
  guideFileName?: string
  guideFilePath?: string
  templateCsvPath?: string
  guideObjectUrl?: string
}

const initialExhibitions: Exhibition[] = publicEvents.map((e) => ({
  id: e.id,
  name: e.name,
  industry: e.category,
  city: e.city,
  country: e.country,
  startDate: e.startDate.slice(0, 10),
  endDate: e.endDate.slice(0, 10),
  status: "published",
}))

const initialLeads: Lead[] = [
  {
    id: "ld-1",
    name: "Aisha Khan",
    email: "aisha@acme.io",
    company: "Acme Ltd",
    source: "Booth Request",
    status: "new",
  },
  {
    id: "ld-2",
    name: "Marco Silva",
    email: "marco@omega.com",
    company: "Omega Corp",
    source: "Newsletter",
    status: "contacted",
  },
  {
    id: "ld-3",
    name: "Li Wei",
    email: "li.wei@example.cn",
    company: "Shenzhen Tech",
    source: "Booth Request",
    status: "closed",
  },
]

export default function AdminPage() {
  const search = useSearchParams()
  const router = useRouter()
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(initialExhibitions)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const initialTab = (search?.get("tab") as string) || "dashboard"
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [hydrated, setHydrated] = useState(false)
  const [detailsById, setDetailsById] = useState<Record<string, ExhibitionDetails>>({})
  // Load persisted data
  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("admin_custom_exhibitions")
      const rawDetails = localStorage.getItem("admin_exhibition_details")
      const custom = raw ? (JSON.parse(raw) as Exhibition[]) : []
      if (custom && Array.isArray(custom)) setExhibitions([...custom, ...initialExhibitions])
      if (rawDetails) {
        const parsed = JSON.parse(rawDetails) as Record<string, ExhibitionDetails>
        if (parsed && typeof parsed === "object") setDetailsById(parsed)
      }
      setHydrated(true)
    } catch {}
  }, [])

  // Persist changes
  useEffect(() => {
    if (!hydrated) return
    try {
      const customOnly = exhibitions.filter((e) => e.id.startsWith("ex-"))
      localStorage.setItem("admin_custom_exhibitions", JSON.stringify(customOnly))
      localStorage.setItem("admin_exhibition_details", JSON.stringify(detailsById))
    } catch {}
  }, [exhibitions, detailsById, hydrated])
  const lang = useAppSelector((s) => s.ui.language)
  const t = getT(lang)
  const { toast } = useToast()

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_user")
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    window.location.href = "/admin/login"
  }

  const [addOpen, setAddOpen] = useState(false)
  const emptyCore: ExhibitionCore = {
    name: "",
    industry: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    status: "draft",
  }

  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<Exhibition | null>(null)

  const [viewOpen, setViewOpen] = useState(false)
  const [viewItem, setViewItem] = useState<Exhibition | null>(null)

  const [leadSearch, setLeadSearch] = useState({
    exhibition: "All",
    type: "All companies",
    size: "All",
    revenue: "All",
    exportFocus: "All",
    status: "All",
  })
  const [leadResults, setLeadResults] = useState<LeadRow[]>([])
  const [selectedLeadIds, setSelectedLeadIds] = useState<Record<string, boolean>>({})
  const [rowsToShow, setRowsToShow] = useState<number>(5)

  // Settings state (persisted to localStorage for demo)
  const defaultSettings: Settings = {
    companyName: "Z3 Exhibition Services",
    websiteUrl: "https://z3exhibitions.com",
    contactEmail: "info@z3exhibitions.com",
    companyAddress: "Zurich, Switzerland",
    phoneCta: "+41 44 123 4567",
    openaiKey: "",
    emailServiceProvider: "",
    emailApiKey: "",
    linkedinApiKey: "",
    contactRequired: {
      firstName: true,
      lastName: true,
      email: true,
      phone: false,
      company: false,
    },
    contactOptional: {
      industry: true,
      country: true,
      newsletter: true,
    },
    contactSuccessMessage: "Thank you for your inquiry. We will contact you soon.",
    meetingSlots: [
      "09:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
      "14:00 - 15:00",
      "15:00 - 16:00",
      "16:00 - 17:00",
    ],
    meetingDurationMins: 60,
    meetingAdvanceDays: 30,
    meetingConfirmMessage:
      "Your meeting has been scheduled! You'll receive a confirmation email with the meeting details shortly.",
    excelMaxFileMb: 10,
    liveChatEnabled: true,
    chatWidgetPosition: "Bottom Right",
    chatWelcomeMessage:
      "Hello! I'm here to help you with exhibition information and lead generation. How can I assist you today?",
    sessionTimeoutMins: 60,
    twoFactorEnabled: false,
    guideFileName: undefined,
    guideFilePath: "/guide.pdf",
    templateCsvPath: "/COPE_Exhibition_Import_Template.csv",
    guideObjectUrl: undefined,
  }
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("admin_settings")
        if (raw) return { ...defaultSettings, ...JSON.parse(raw) }
      } catch {}
    }
    return defaultSettings
  })

  const totals = useMemo(
    () => ({
      exhibitions: exhibitions.length,
      leads: leads.length,
      interactions: Math.round(leads.length * 2.4),
      downloads: 318, // dummy
    }),
    [exhibitions.length, leads.length],
  )

  function exportExhibitionsCsv() {
    const headers = ["id", "name", "industry", "city", "country", "startDate", "endDate", "status"]
    const rows = exhibitions.map((e) => headers.map((h) => (e as any)[h]))
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "exhibitions.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // creation now handled in dedicated page via localStorage

  // Parse many date formats safely: ISO, DD-MM-YYYY, DD/MM/YYYY, and Excel serial
  function parseDateSafe(value: any): Date | null {
    if (!value) return null
    if (value instanceof Date && !isNaN(value.getTime())) return value
    if (typeof value === "number" && isFinite(value)) {
      const base = Date.UTC(1899, 11, 30) // Excel epoch
      const ms = Math.round(value * 86400000)
      const d = new Date(base + ms)
      return isNaN(d.getTime()) ? null : d
    }
    if (typeof value === "string") {
      const s = value.trim()
      if (!s) return null
      const parsed = Date.parse(s)
      if (!isNaN(parsed)) return new Date(parsed)
      const m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
      if (m) {
        const dd = m[1].padStart(2, "0")
        const mm = m[2].padStart(2, "0")
        const yyyy = m[3]
        const d = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`)
        return isNaN(d.getTime()) ? null : d
      }
    }
    return null
  }

  function normalizeDateToISO(value: any): string {
    const d = parseDateSafe(value)
    return d ? d.toISOString().slice(0, 10) : ""
  }

  // Import from Excel/CSV -> append to exhibitions
  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const XLSX = await import("xlsx")
        const data = new Uint8Array(ev.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: "" })
        const imported: Exhibition[] = json
          .map((row) => {
            const name = String(row.name || row.Name || row["Exhibition Name"] || "").trim()
            const industry = String(row.industry || row.Industry || "").trim()
            const city = String(row.city || row.City || "").trim()
            const country = String(row.country || row.Country || "").trim()
            const startDate = normalizeDateToISO(
              row.startDate ?? row["start_date"] ?? row["Start Date"] ?? row["Start"] ?? "",
            )
            const endDate = normalizeDateToISO(
              row.endDate ?? row["end_date"] ?? row["End Date"] ?? row["End"] ?? "",
            )
            const statusRaw = String(row.status || row.Status || "published").trim().toLowerCase()
            const status: Exhibition["status"] = statusRaw === "draft" ? "draft" : "published"
            if (!name) return null
            return {
              id: `ex-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              name,
              industry,
              city,
              country,
              startDate,
              endDate,
              status,
            } as Exhibition
          })
          .filter(Boolean) as Exhibition[]
        if (imported.length) {
          setExhibitions((prev) => [...imported, ...prev])
        }
      } catch (err) {
        console.error("Failed to import file", err)
        alert("Failed to import file. Please ensure the format is valid.")
      } finally {
        e.currentTarget.value = ""
      }
    }
    reader.readAsArrayBuffer(file)
  }

  function updateLeadStatus(id: string, status: Lead["status"]) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  function sortedUnique<T extends string>(arr: T[]): T[] {
    return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b))
  }

  const exhibitionOptions = useMemo(() => ["All", ...sortedUnique(exhibitions.map((e) => e.name))], [exhibitions])
  const typeOptions = ["All companies", "Competitor companies", "Swiss companies only"].sort((a, b) =>
    a.localeCompare(b),
  )
  const sizeOptions = ["All", "Large", "SME", "Startup"] // keep All first, others alphabetically
  const revenueOptions = ["All", "1-10M", "10-50M", "50+"]
  const exportOptions = ["All", "America", "Asia", "Europe", "Global"]

  function buildLeadItems(count: number): LeadRow[] {
    // mock generate rows influenced by selections
    const seed = (
      leadSearch.exhibition +
      leadSearch.type +
      leadSearch.size +
      leadSearch.revenue +
      leadSearch.exportFocus +
      leadSearch.status
    ).length
    const sizes: LeadRow["size"][] = ["Startup", "SME", "Large"]
    const sources = ["Booth Request", "Newsletter", "Website", "Referral"]
    const statuses: LeadRow["status"][] = ["new", "contacted", "closed", "approved"]
    const generated = Array.from({ length: count }).map((_, i) => {
      const idx = (seed + i) % 1000
      const size = sizes[(i + seed) % sizes.length]
      const company = `${leadSearch.exportFocus !== "All" ? leadSearch.exportFocus + " " : ""}Company ${idx}`
      return {
        id: `sr-${idx}`,
        company,
        person: ["Aisha Khan", "Marco Silva", "Li Wei", "John Park", "Elena Rossi"][(i + seed) % 5],
        email: `contact${idx}@${company.toLowerCase().replace(/\s+/g, "")}.com`,
        phone: `+41 44 ${String(100000 + idx).slice(0, 6)}`,
        score: 50 + ((i * 7 + seed) % 51),
        size,
        source: sources[(i + seed) % sources.length],
        status: statuses[(i + seed) % statuses.length],
      } as LeadRow
    })
    // Apply filters for size and status when not 'All'
    const filtered = generated.filter((r) => {
      const sizeOk = leadSearch.size === "All" || r.size === (leadSearch.size as LeadRow["size"])
      const statusOk = leadSearch.status === "All" || r.status === (leadSearch.status as LeadRow["status"])
      return sizeOk && statusOk
    })
    return filtered
  }

  // Initialize with 5 default results before any search
  useEffect(() => {
    const initial = buildLeadItems(100)
    setLeadResults(initial)
    setSelectedLeadIds({})
    setRowsToShow(initial.length)
  }, [])

  function saveAllSettings() {
    try {
      localStorage.setItem("admin_settings", JSON.stringify(settings))
      toast({ title: "Settings saved", description: "All settings have been updated." })
    } catch (e) {
      console.error(e)
      alert("Failed to save settings")
    }
  }

  function resetSettings() {
    setSettings(defaultSettings)
    try {
      localStorage.setItem("admin_settings", JSON.stringify(defaultSettings))
    } catch {}
  }

  function handleGuideUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSettings((s) => ({ ...s, guideFileName: file.name, guideObjectUrl: url }))
    e.currentTarget.value = ""
  }

  function runLeadSearch() {
    const items = buildLeadItems(100)
    setLeadResults(items)
    setSelectedLeadIds({})
    setRowsToShow(items.length)
  }

  function toggleSelectAll(val: boolean) {
    const next: Record<string, boolean> = {}
    if (val) {
      leadResults.forEach((r) => (next[r.id] = true))
    }
    setSelectedLeadIds(next)
  }

  function exportSelected() {
    const selected = leadResults.filter((r) => selectedLeadIds[r.id])
    if (!selected.length) return
    const headers = ["company", "person", "email", "phone", "score", "size"]
    const rows = selected.map((r) => headers.map((h) => (r as any)[h]))
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "lead-search.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function bulkEmail() {
    const emails = leadResults.filter((r) => selectedLeadIds[r.id]).map((r) => r.email)
    if (!emails.length) return
    window.location.href = `mailto:${encodeURIComponent(emails.join(","))}`
  }

  return (
    <AdminAuthGuard>
      <main className="mx-auto max-w-7xl px-4 py-6">
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); try { const url = new URL(window.location.href); url.searchParams.set("tab", v); router.replace(url.pathname + "?" + url.searchParams.toString()); } catch {} }}>
        <div className="relative mb-4">
          <div className="flex">
            <TabsList className="w-full flex flex-nowrap justify-between overflow-x-auto no-scrollbar rounded-md bg-muted/60 bg-gray-300 px-1">
              <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
              <TabsTrigger value="exhibitions">{t.exhibitions}</TabsTrigger>
              <TabsTrigger value="leads">{t.leads}</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Actions moved to global header on admin routes */}
        </div>

        <TabsContent value="dashboard">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm">{t.totalExhibitions}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{totals.exhibitions}</CardContent>
            </Card>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm">{t.totalLeads}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{totals.leads}</CardContent>
            </Card>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm">{t.totalInteractions}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{totals.interactions}</CardContent>
            </Card>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-sm">{t.guideDownloads}</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-semibold">{totals.downloads}</CardContent>
            </Card>
          </section>

          <section className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{t.recentLeads}</h2>
            </div>
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="min-w-[200px]">Company</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.slice(0, 6).map((l) => (
                    <TableRow key={l.id} className="transition hover:bg-primary/5">
                      <TableCell>{l.name}</TableCell>
                      <TableCell>{l.company}</TableCell>
                      <TableCell className="capitalize">{l.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="exhibitions">
          <div className="flex items-center justify-end gap-2 mb-3">
            <Button
              variant="outline"
              onClick={exportExhibitionsCsv}
              className="flex items-center gap-2 bg-transparent transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Download size={16} />
              {t.exportExcel}
            </Button>

            {/* Import button and hidden file input */}
            <input
              type="file"
              accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
              id="exhibitions-import-input"
              className="hidden"
              onChange={handleImportFile}
            />
            <Button
              variant="secondary"
              className="flex items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => document.getElementById("exhibitions-import-input")?.click()}
            >
              <FileDown size={16} /> Import
            </Button>

            <Button asChild className="flex items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md">
              <Link href="/admin/exhibitions/new">
                <Plus size={16} />
                {t.addExhibition}
              </Link>
            </Button>
          </div>

          <div className="overflow-x-auto rounded border">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[200px]">Actions</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exhibitions.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/20 transition hover:-translate-y-0.5 hover:shadow-md">
                    <TableCell className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Button size="sm" variant="outline" className="px-2 bg-transparent transition hover:-translate-y-0.5" asChild>
                        <Link href={`/admin/exhibitions/${e.id}/edit`} aria-label="Edit exhibition">
                          <Pencil size={14} />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="px-2 transition hover:-translate-y-0.5"
                        onClick={() => setExhibitions((prev) => prev.filter((x) => x.id !== e.id))}
                        aria-label="Delete exhibition"
                        title="Delete exhibition"
                      >
                        <Trash2 size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 bg-transparent transition hover:-translate-y-0.5"
                        onClick={() => {
                          setViewItem(e)
                          setViewOpen(true)
                        }}
                      >
                        <Eye size={14} />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal break-words">{e.name}</TableCell>
                    <TableCell className="whitespace-normal break-words">{e.industry}</TableCell>
                    <TableCell className="whitespace-normal break-words">
                      {e.city}, {e.country}
                    </TableCell>
                    <TableCell>
                      {parseDateSafe(e.startDate) ? format(parseDateSafe(e.startDate) as Date, "MMM d, yyyy") : "—"} – {parseDateSafe(e.endDate) ? format(parseDateSafe(e.endDate) as Date, "MMM d, yyyy") : "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs capitalize ${
                          e.status === "published"
                            ? "bg-green-500/15 text-green-600 dark:text-green-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {e.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Edit handled on dedicated route */}

          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Exhibition details</DialogTitle>
                <DialogDescription>Quick preview of the exhibition.</DialogDescription>
              </DialogHeader>
              {viewItem && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Name</div>
                    <div className="font-medium">{viewItem.name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Industry</div>
                    <div>{viewItem.industry}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Location</div>
                    <div>
                      {viewItem.city}, {viewItem.country}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Dates</div>
                    <div>
                      {parseDateSafe(viewItem.startDate) ? format(parseDateSafe(viewItem.startDate) as Date, "MMM d, yyyy") : "—"}
                      {" "}–{" "}
                      {parseDateSafe(viewItem.endDate) ? format(parseDateSafe(viewItem.endDate) as Date, "MMM d, yyyy") : "—"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-muted-foreground">Status</div>
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs capitalize ${
                        viewItem.status === "published"
                          ? "bg-green-500/15 text-green-600 dark:text-green-400"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {viewItem.status}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="leads">
          {/* Search Prospects (merged from Lead Search) */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-balance">Search Prospects</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Exhibition */}
              <div>
                <label className="text-sm text-muted-foreground">Exhibition</label>
                <select
                  className="mt-1 block w-full rounded-md border bg-background px-2 py-2"
                  value={leadSearch.exhibition}
                  onChange={(e) => setLeadSearch((s) => ({ ...s, exhibition: e.target.value }))}
                >
                  {exhibitionOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Type */}
              <div>
                <label className="text-sm text-muted-foreground">Search Type</label>
                <select
                  className="mt-1 block w-full rounded-md border bg-background px-2 py-2"
                  value={leadSearch.type}
                  onChange={(e) => setLeadSearch((s) => ({ ...s, type: e.target.value }))}
                >
                  {typeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Company Size */}
              <div>
                <label className="text-sm text-muted-foreground">Company Size</label>
                <select
                  className="mt-1 block w-full rounded-md border bg-background px-2 py-2"
                  value={leadSearch.size}
                  onChange={(e) => setLeadSearch((s) => ({ ...s, size: e.target.value }))}
                >
                  {sizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Revenue */}
              <div>
                <label className="text-sm text-muted-foreground">Revenue Range</label>
                <select
                  className="mt-1 block w-full rounded-md border bg-background px-2 py-2"
                  value={leadSearch.revenue}
                  onChange={(e) => setLeadSearch((s) => ({ ...s, revenue: e.target.value }))}
                >
                  {revenueOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Export Focus */}
              <div>
                <label className="text-sm text-muted-foreground">Export Focus</label>
                <select
                  className="mt-1 block w-full rounded-md border bg-background px-2 py-2"
                  value={leadSearch.exportFocus}
                  onChange={(e) => setLeadSearch((s) => ({ ...s, exportFocus: e.target.value }))}
                >
                  {exportOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Status */}
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <select
                  className="mt-1 block w-full rounded-md border bg-background px-2 py-2"
                  value={leadSearch.status}
                  onChange={(e) => setLeadSearch((s) => ({ ...s, status: e.target.value }))}
                >
                  {["All", "new", "contacted", "closed", "approved"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-5 flex items-center justify-end gap-2">
                <Button
                  onClick={runLeadSearch}
                  className="bg-primary text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <Buildings2 className="h-4 w-4 mr-1" /> Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">
              {leadResults.length ? `${leadResults.length} results` : "No results yet. Run a search."}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={exportSelected}
                className="transition hover:-translate-y-0.5 hover:shadow-md bg-transparent"
              >
                <FileDown className="h-4 w-4 mr-1" /> Export Selected
              </Button>
              <Button
                variant="secondary"
                onClick={bulkEmail}
                className="transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <Mailbox className="h-4 w-4 mr-1" /> Bulk Email
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto rounded border mb-6">
            <Table>
              <TableHeader className="bg-primary/5">
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      onChange={(e) => {
                        const isChecked = e.currentTarget.checked
                        toggleSelectAll(isChecked)
                      }}
                      checked={
                        leadResults.length > 0 &&
                        leadResults.every((r) => selectedLeadIds[r.id]) &&
                        Object.keys(selectedLeadIds).length > 0
                      }
                    />
                  </TableHead>
                  <TableHead className="min-w-[200px]">Actions</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadResults.slice(0, rowsToShow).map((r) => (
                  <TableRow key={r.id} className="transition hover:bg-primary/5">
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={!!selectedLeadIds[r.id]}
                        onChange={(e) => {
                          const isChecked = e.currentTarget.checked
                          setSelectedLeadIds((m) => ({ ...m, [r.id]: isChecked }))
                        }}
                        aria-label={`Select ${r.company}`}
                      />
                    </TableCell>
                    <TableCell className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 bg-transparent transition hover:-translate-y-0.5"
                        onClick={() => alert(`${r.company}\n${r.person}\n${r.email}\n${r.phone}`)}
                        aria-label="View lead"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 bg-transparent transition hover:-translate-y-0.5"
                        onClick={() => {
                          const tmp = [r]
                          const headers = ["company", "person", "email", "phone", "score", "size"]
                          const rows = tmp.map((x) => headers.map((h) => (x as any)[h]))
                          const csv = [headers, ...rows]
                            .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
                            .join("\n")
                          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = `${r.company}.csv`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                        aria-label="Export lead"
                      >
                        <Download size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="px-2 bg-transparent" asChild>
                        <a href={`mailto:${r.email}`} aria-label="Email lead">
                          <Mail size={14} />
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal break-words">{r.company}</TableCell>
                    <TableCell className="whitespace-normal break-words">{r.person}</TableCell>
                    <TableCell className="text-primary underline whitespace-normal break-words">
                      <a href={`mailto:${r.email}`}>{r.email}</a>
                    </TableCell>
                    <TableCell className="whitespace-normal break-words">{r.phone}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-primary/10 text-primary">
                        <TrendingUp className="h-3 w-3" />
                        {r.score}
                      </span>
                    </TableCell>
                    <TableCell>{r.size}</TableCell>
                    <TableCell className="whitespace-normal break-words">{r.source}</TableCell>
                    <TableCell className="capitalize">{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        

        <TabsContent value="analytics" className="space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Total Page Views</CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="text-2xl font-semibold">74,230</CardContent>
            </Card>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Total Interactions</CardTitle>
                <MousePointerClick className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="text-2xl font-semibold">18,902</CardContent>
            </Card>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Guide Downloads</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="text-2xl font-semibold">3,148</CardContent>
            </Card>
            <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">Meeting Bookings</CardTitle>
                <CalendarCheck className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="text-2xl font-semibold">612</CardContent>
            </Card>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users2 className="h-5 w-5 text-primary" /> User Interaction Analytics
            </h3>
            <div className="overflow-x-auto rounded border">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-primary/10 text-primary">
                  <TableRow>
                    <TableHead className="w-[240px]">Interaction Type</TableHead>
                    <TableHead className="w-32 text-right">Count</TableHead>
                    <TableHead className="w-32 text-right">Rate</TableHead>
                    <TableHead className="w-32 text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { type: "Call Clicks", count: 1200, rate: "8.3%", trend: "up" },
                    { type: "Meeting Bookings", count: 612, rate: "3.2%", trend: "up" },
                    { type: "Email Clicks", count: 4200, rate: "11.1%", trend: "flat" },
                    { type: "Chat Sessions", count: 980, rate: "4.8%", trend: "up" },
                    { type: "Guide Downloads", count: 3148, rate: "7.0%", trend: "down" },
                  ].map((r) => (
                    <TableRow key={r.type} className="transition hover:bg-primary/10 odd:bg-background even:bg-primary/5/50">
                      <TableCell className="font-medium flex items-center gap-2">
                        {r.type === "Call Clicks" && <PhoneIcon />}
                        {r.type === "Meeting Bookings" && <CalendarCheck className="h-4 w-4" />}
                        {r.type === "Email Clicks" && <Mail className="h-4 w-4" />}
                        {r.type === "Chat Sessions" && <MessageCircle className="h-4 w-4" />}
                        {r.type === "Guide Downloads" && <FileDown className="h-4 w-4" />}
                        {r.type}
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-primary font-semibold">{r.count}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className="inline-block rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-xs">
                          {r.rate}
                        </span>
                      </TableCell>
                      <TableCell className="flex items-center gap-1 justify-end">
                        <TrendIcon trend={r.trend as any} />
                        {r.trend}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" /> Lead Generation Performance
            </h3>
            <div className="overflow-x-auto rounded border">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-primary/10 text-primary">
                  <TableRow>
                    <TableHead className="w-[240px]">Lead Stage</TableHead>
                    <TableHead className="w-32 text-right">Count</TableHead>
                    <TableHead className="w-32 text-right">Conversion</TableHead>
                    <TableHead className="w-32 text-right">Quality Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { stage: "New Leads", count: 1400, conversion: "—", quality: 62 },
                    { stage: "Qualified Leads", count: 860, conversion: "61%", quality: 74 },
                    { stage: "Converted Leads", count: 420, conversion: "49%", quality: 81 },
                    { stage: "Follow-up Required", count: 190, conversion: "—", quality: 58 },
                    { stage: "High-Value Prospects", count: 70, conversion: "—", quality: 90 },
                  ].map((r) => (
                    <TableRow key={r.stage} className="transition hover:bg-primary/10 odd:bg-background even:bg-primary/5/50">
                      <TableCell className="font-medium">{r.stage}</TableCell>
                      <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">{r.count}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className="inline-block rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 text-xs">
                          {r.conversion}
                        </span>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className="inline-block rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 text-xs">
                          {r.quality}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {/* <TrophyIcon /> Top Exhibition Performance */}
              Top Exhibition Performance
            </h3>
            <div className="overflow-x-auto rounded border">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-primary/10 text-primary">
                  <TableRow>
                    <TableHead className="w-[240px]">Exhibition</TableHead>
                    <TableHead className="w-32 text-right">Views</TableHead>
                    <TableHead className="w-32 text-right">Interactions</TableHead>
                    <TableHead className="w-32 text-right">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exhibitions.slice(0, 5).map((e, i) => (
                    <TableRow key={e.id} className="transition hover:bg-primary/10 odd:bg-background even:bg-primary/5/50">
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="text-right tabular-nums text-fuchsia-600 dark:text-fuchsia-400 font-semibold">{1000 + i * 137}</TableCell>
                      <TableCell className="text-right tabular-nums text-rose-600 dark:text-rose-400 font-semibold">{200 + i * 37}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        <span className="inline-block rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 text-xs">
                          {5 + (i % 6)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" /> Live Chat Analytics
            </h3>
            <div className="overflow-x-auto rounded border">
              <Table className="table-fixed w-full">
                <TableHeader className="bg-primary/10 text-primary">
                  <TableRow>
                    <TableHead className="w-[240px]">Metric</TableHead>
                    <TableHead className="w-32 text-right">Value</TableHead>
                    <TableHead className="w-32 text-right">Target</TableHead>
                    <TableHead className="w-32 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { metric: "Total Sessions", value: "980", target: "900", status: "On Track" },
                    { metric: "Avg Duration", value: "3m 40s", target: "3m", status: "On Track" },
                    { metric: "Satisfaction", value: "4.5 / 5", target: "4.2", status: "On Track" },
                    { metric: "Conversions", value: "120", target: "150", status: "Behind" },
                    { metric: "Conversion Rate", value: "3.1%", target: "3.5%", status: "Behind" },
                  ].map((r) => (
                    <TableRow key={r.metric} className="transition hover:bg-primary/10 odd:bg-background even:bg-primary/5/50">
                      <TableCell className="font-medium">{r.metric}</TableCell>
                      <TableCell className="text-right tabular-nums text-primary font-semibold">{r.value}</TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{r.target}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                              r.status === "On Track"
                                ? "bg-green-500/15 text-green-600 dark:text-green-400"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {r.status}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Recent Activity Log
            </h3>
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader className="bg-primary/5">
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Exhibition</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { t: "09:02", a: "Viewed speaker", e: "Global Tech Expo", l: "Zurich, CH", d: "Desktop" },
                    { t: "09:15", a: "Booked meeting", e: "Edu Summit", l: "Basel, CH", d: "Mobile" },
                    { t: "09:40", a: "Downloaded guide", e: "Global Tech Expo", l: "Berlin, DE", d: "Desktop" },
                    { t: "10:02", a: "Opened chat", e: "Global Tech Expo", l: "Bern, CH", d: "Mobile" },
                  ].map((r, i) => (
                    <TableRow key={i} className="transition hover:bg-primary/5">
                      <TableCell>{r.t}</TableCell>
                      <TableCell>{r.a}</TableCell>
                      <TableCell>{r.e}</TableCell>
                      <TableCell>{r.l}</TableCell>
                      <TableCell>{r.d}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">System Settings & Configuration</h3>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">General Configuration</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">Company Name</label>
                  <Input value={settings.companyName} onChange={(e) => setSettings((s) => ({ ...s, companyName: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Website URL</label>
                  <Input value={settings.websiteUrl} onChange={(e) => setSettings((s) => ({ ...s, websiteUrl: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Contact Email</label>
                  <Input value={settings.contactEmail} onChange={(e) => setSettings((s) => ({ ...s, contactEmail: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Company Address</label>
                  <Textarea value={settings.companyAddress} onChange={(e) => setSettings((s) => ({ ...s, companyAddress: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Phone Number (for Call CTA)</label>
                  <Input value={settings.phoneCta} onChange={(e) => setSettings((s) => ({ ...s, phoneCta: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">API & Integration Settings</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground">OpenAI API Key</label>
                  <Input type="password" value={settings.openaiKey} onChange={(e) => setSettings((s) => ({ ...s, openaiKey: e.target.value }))} placeholder="sk-..." />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email Service Provider</label>
                  <Input value={settings.emailServiceProvider} onChange={(e) => setSettings((s) => ({ ...s, emailServiceProvider: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">LinkedIn API Key</label>
                  <Input type="password" value={settings.linkedinApiKey} onChange={(e) => setSettings((s) => ({ ...s, linkedinApiKey: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email API Key</label>
                  <Input type="password" value={settings.emailApiKey} onChange={(e) => setSettings((s) => ({ ...s, emailApiKey: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">Contact Form Configuration</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-sm mb-2">Required Fields</div>
                  {(["firstName", "lastName", "email", "phone", "company"] as const).map((k) => (
                    <label key={k} className="flex items-center gap-2 text-sm block">
                      <input
                        type="checkbox"
                        checked={settings.contactRequired[k]}
                        onChange={(e) => {
                          const isChecked = (e.target as HTMLInputElement).checked
                          setSettings((s) => ({
                            ...s,
                            contactRequired: { ...s.contactRequired, [k]: isChecked },
                          }))
                        }}
                      />
                      {k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
                <div>
                  <div className="font-medium text-sm mb-2">Optional Fields</div>
                  {(["industry", "country", "newsletter"] as const).map((k) => (
                    <label key={k} className="flex items-center gap-2 text-sm block">
                      <input
                        type="checkbox"
                        checked={settings.contactOptional[k]}
                        onChange={(e) => {
                          const isChecked = (e.target as HTMLInputElement).checked
                          setSettings((s) => ({
                            ...s,
                            contactOptional: { ...s.contactOptional, [k]: isChecked },
                          }))
                        }}
                      />
                      {k.charAt(0).toUpperCase() + k.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Success Message</label>
                  <Textarea value={settings.contactSuccessMessage} onChange={(e) => setSettings((s) => ({ ...s, contactSuccessMessage: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">Meeting Booking Configuration</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-medium text-sm mb-2">Available Time Slots</div>
                  {["09:00 - 10:00","10:00 - 11:00","11:00 - 12:00","14:00 - 15:00","15:00 - 16:00","16:00 - 17:00"].map((slot) => (
                    <label key={slot} className="flex items-center gap-2 text-sm block">
                      <input
                        type="checkbox"
                        checked={settings.meetingSlots.includes(slot)}
                        onChange={(e) => {
                          const isChecked = (e.target as HTMLInputElement).checked
                          setSettings((s) => ({
                            ...s,
                            meetingSlots: isChecked
                              ? Array.from(new Set([...s.meetingSlots, slot]))
                              : s.meetingSlots.filter((x) => x !== slot),
                          }))
                        }}
                      />
                      {slot}
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Meeting Duration (minutes)</label>
                    <Input type="number" value={settings.meetingDurationMins} onChange={(e) => setSettings((s) => ({ ...s, meetingDurationMins: Number(e.target.value || 0) }))} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Advance Booking Days</label>
                    <Input type="number" value={settings.meetingAdvanceDays} onChange={(e) => setSettings((s) => ({ ...s, meetingAdvanceDays: Number(e.target.value || 0) }))} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Meeting Confirmation Message</label>
                    <Textarea value={settings.meetingConfirmMessage} onChange={(e) => setSettings((s) => ({ ...s, meetingConfirmMessage: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">Document Management</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Z3 Exhibition Guide</label>
                  <input type="file" accept="application/pdf" onChange={handleGuideUpload} />
                  <div className="text-xs text-muted-foreground">Upload the latest Z3 Exhibition Guide (PDF recommended)</div>
                  <div className="mt-2 text-sm flex items-center gap-2">
                    <span className="text-muted-foreground">Current Guide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {settings.guideFileName || settings.guideFilePath?.split("/").pop()}
                    </span>
                    <Button asChild variant="outline" className="h-7 px-2">
                      <a href={settings.guideObjectUrl || settings.guideFilePath} download>
                        Download
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-7 px-2"
                      onClick={() => setSettings((s) => ({ ...s, guideFileName: undefined, guideObjectUrl: undefined }))}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Excel Import Template</label>
                  <div className="text-xs text-muted-foreground">Download the Excel template for bulk exhibition import</div>
                  {/* <Input value={settings.templateCsvPath} onChange={(e) => setSettings((s) => ({ ...s, templateCsvPath: e.target.value }))} placeholder="/COPE_Exhibition_Import_Template.csv" /> */}
                  {settings.templateCsvPath && (
                    <div>
                      <Button asChild className="h-8">
                        <a href={settings.templateCsvPath} download>
                          Download Template
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Maximum File Size (MB)</label>
                  <Input type="number" value={settings.excelMaxFileMb} onChange={(e) => setSettings((s) => ({ ...s, excelMaxFileMb: Number(e.target.value || 0) }))} />
                </div>
              </div>
            </div>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">Live Chat Configuration</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.liveChatEnabled}
                    onChange={(e) => {
                      const isChecked = (e.target as HTMLInputElement).checked
                      setSettings((s) => ({ ...s, liveChatEnabled: isChecked }))
                    }}
                  />
                  Enable Live Chat
                </label>
                <div>
                  <label className="text-sm text-muted-foreground">Chat Widget Position</label>
                  <select className="mt-1 block w-full rounded-md border bg-background px-2 py-2" value={settings.chatWidgetPosition} onChange={(e) => setSettings((s) => ({ ...s, chatWidgetPosition: e.target.value as Settings["chatWidgetPosition"] }))}>
                    <option>Bottom Right</option>
                    <option>Bottom Left</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Welcome Message</label>
                  <Textarea value={settings.chatWelcomeMessage} onChange={(e) => setSettings((s) => ({ ...s, chatWelcomeMessage: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="rounded border bg-card">
              <div className="border-b bg-muted/50 px-4 py-2 font-medium">Admin Security</div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="font-medium">Change Admin Password</div>
                  <div>
                    <label className="text-sm text-muted-foreground">Current Password</label>
                    <Input type="password" placeholder="Current Password" id="admin-current-password" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">New Password</label>
                    <Input type="password" placeholder="New Password" id="admin-new-password" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Confirm New Password</label>
                    <Input type="password" placeholder="Confirm New Password" id="admin-confirm-password" />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const curr = (document.getElementById("admin-current-password") as HTMLInputElement | null)?.value || ""
                      const npw = (document.getElementById("admin-new-password") as HTMLInputElement | null)?.value || ""
                      const cpw = (document.getElementById("admin-confirm-password") as HTMLInputElement | null)?.value || ""
                      if (!curr || !npw || !cpw) {
                        toast({ title: "Missing fields", description: "Please fill all password fields." })
                        return
                      }
                      if (npw.length < 8) {
                        toast({ title: "Weak password", description: "Password must be at least 8 characters." })
                        return
                      }
                      if (npw !== cpw) {
                        toast({ title: "Passwords do not match", description: "Confirm password must match." })
                        return
                      }
                      toast({ title: "Password updated", description: "Your admin password has been changed." })
                    }}
                  >
                    Change Password
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Session Timeout (minutes)</label>
                    <Input type="number" value={settings.sessionTimeoutMins} onChange={(e) => setSettings((s) => ({ ...s, sessionTimeoutMins: Number(e.target.value || 0) }))} />
                  </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.twoFactorEnabled}
                    onChange={(e) => {
                      const isChecked = (e.target as HTMLInputElement).checked
                      setSettings((s) => ({ ...s, twoFactorEnabled: isChecked }))
                    }}
                  />
                    Enable Two-Factor Authentication
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button className="cursor-pointer" variant="secondary" onClick={resetSettings}>Reset to Defaults</Button>
              <Button className="cursor-pointer" onClick={saveAllSettings}>Save All Settings</Button>
            </div>
          </section>
        </TabsContent>
      </Tabs>
      </main>
    </AdminAuthGuard>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M6.6 10.8c1.5 2.9 3.7 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .4 2 .6 3.1.6.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C10.5 21.3 2.7 13.5 2.7 3.3 2.7 2.6 3.3 2 4 2h2.1c.7 0 1.3.6 1.3 1.3 0 1 .2 2.1.6 3.1.1.4 0 .9-.3 1.2L6.6 10.8z"
      />
    </svg>
  )
}
function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-600">
        <path fill="currentColor" d="M3 17l6-6 4 4 7-7v6h2V7h-7v2h6l-7 7-4-4-6 6z" />
      </svg>
    )
  if (trend === "down")
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-600">
        <path fill="currentColor" d="M3 7l6 6 4-4 7 7v-6h2v7h-7v-2h6l-7-7-4 4-6-6z" />
      </svg>
    )
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted-foreground">
      <path fill="currentColor" d="M4 12h16v2H4z" />
    </svg>
  )
}
