"use client"
import { useMemo, useState } from "react"
import { events as publicEvents } from "@/data/events"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(initialExhibitions)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const lang = useAppSelector((s) => s.ui.language)
  const t = getT(lang)

  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState<{
    name: string
    industry: string
    city: string
    country: string
    startDate: string
    endDate: string
    description: string
    status: Exhibition["status"]
  }>({
    name: "",
    industry: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "draft",
  })

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
  })
  const [leadResults, setLeadResults] = useState<LeadRow[]>([])
  const [selectedLeadIds, setSelectedLeadIds] = useState<Record<string, boolean>>({})

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

  function addExhibition(data: {
    name: string
    industry: string
    city: string
    country: string
    startDate: string
    endDate: string
    status: Exhibition["status"]
    description?: string
  }) {
    const next: Exhibition = {
      id: `ex-${Date.now()}`,
      name: data.name,
      industry: data.industry,
      city: data.city,
      country: data.country,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    }
    setExhibitions((prev) => [next, ...prev])
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

  function runLeadSearch() {
    // mock generate 40 rows influenced by selections
    const seed = (
      leadSearch.exhibition +
      leadSearch.type +
      leadSearch.size +
      leadSearch.revenue +
      leadSearch.exportFocus
    ).length
    const sizes: LeadRow["size"][] = ["Startup", "SME", "Large"]
    const items = Array.from({ length: 40 }).map((_, i) => {
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
      } as LeadRow
    })
    setLeadResults(items)
    setSelectedLeadIds({})
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
    <main className="mx-auto max-w-7xl px-4 py-6">
      <Tabs defaultValue="dashboard">
        <div className="flex flex-col gap-2 mb-4 md:flex-row md:items-center md:justify-between">
          <TabsList className="flex flex-nowrap overflow-x-auto no-scrollbar">
            <TabsTrigger value="dashboard">{t.dashboard}</TabsTrigger>
            <TabsTrigger value="exhibitions">{t.exhibitions}</TabsTrigger>
            <TabsTrigger value="leads">{t.leads}</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Button
              asChild
              variant="outline"
              className="transition hover:-translate-y-0.5 hover:shadow-md bg-transparent"
            >
              <a href="/" className="flex items-center gap-1">
                <ExternalLink className="h-4 w-4" /> View Site
              </a>
            </Button>
            <Button
              variant="destructive"
              className="transition hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => (window.location.href = "/")}
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
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

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 transition hover:-translate-y-0.5 hover:shadow-md">
                  <Plus size={16} />
                  {t.addExhibition}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.addExhibition}</DialogTitle>
                  <DialogDescription>Fill the details to create a new exhibition.</DialogDescription>
                </DialogHeader>
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    addExhibition(addForm)
                    setAddForm({
                      name: "",
                      industry: "",
                      city: "",
                      country: "",
                      startDate: "",
                      endDate: "",
                      description: "",
                      status: "draft",
                    })
                    setAddOpen(false)
                  }}
                >
                  <Input
                    name="name"
                    placeholder="Name"
                    required
                    className="md:col-span-2"
                    value={addForm.name}
                    onChange={(e) => setAddForm((s) => ({ ...s, name: e.target.value }))}
                  />
                  <Input
                    name="industry"
                    placeholder="Industry"
                    required
                    value={addForm.industry}
                    onChange={(e) => setAddForm((s) => ({ ...s, industry: e.target.value }))}
                  />
                  <Input
                    name="city"
                    placeholder="City"
                    required
                    value={addForm.city}
                    onChange={(e) => setAddForm((s) => ({ ...s, city: e.target.value }))}
                  />
                  <Input
                    name="country"
                    placeholder="Country"
                    required
                    value={addForm.country}
                    onChange={(e) => setAddForm((s) => ({ ...s, country: e.target.value }))}
                  />
                  <Input
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    required
                    value={addForm.startDate}
                    onChange={(e) => setAddForm((s) => ({ ...s, startDate: e.target.value }))}
                  />
                  <Input
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    required
                    value={addForm.endDate}
                    onChange={(e) => setAddForm((s) => ({ ...s, endDate: e.target.value }))}
                  />
                  <Textarea
                    name="description"
                    placeholder="Description"
                    className="md:col-span-2"
                    value={addForm.description}
                    onChange={(e) => setAddForm((s) => ({ ...s, description: e.target.value }))}
                  />
                  <Select
                    value={addForm.status}
                    onValueChange={(v) => setAddForm((s) => ({ ...s, status: v as Exhibition["status"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button type="submit" className="transition hover:-translate-y-0.5 hover:shadow-md">
                      Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 bg-transparent transition hover:-translate-y-0.5"
                        onClick={() => {
                          setEditForm(e)
                          setEditOpen(true)
                        }}
                      >
                        <Pencil size={14} />
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
                      {format(new Date(e.startDate), "MMM d, yyyy")} – {format(new Date(e.endDate), "MMM d, yyyy")}
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

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Exhibition</DialogTitle>
                <DialogDescription>Update the details for this exhibition.</DialogDescription>
              </DialogHeader>
              {editForm && (
                <form
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setExhibitions((prev) => prev.map((x) => (x.id === editForm.id ? { ...x, ...editForm } : x)))
                    setEditOpen(false)
                  }}
                >
                  <Input
                    name="name"
                    placeholder="Name"
                    required
                    className="md:col-span-2"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <Input
                    name="industry"
                    placeholder="Industry"
                    required
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                  />
                  <Input
                    name="city"
                    placeholder="City"
                    required
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  />
                  <Input
                    name="country"
                    placeholder="Country"
                    required
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                  />
                  <Input
                    type="date"
                    name="startDate"
                    placeholder="Start Date"
                    required
                    value={editForm.startDate}
                    onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                  />
                  <Input
                    type="date"
                    name="endDate"
                    placeholder="End Date"
                    required
                    value={editForm.endDate}
                    onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  />
                  <Select
                    value={editForm.status}
                    onValueChange={(v) => setEditForm({ ...editForm, status: v as Exhibition["status"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="md:col-span-2 flex justify-end gap-2">
                    <Button type="submit" className="transition hover:-translate-y-0.5 hover:shadow-md">
                      Save changes
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

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
                      {format(new Date(viewItem.startDate), "MMM d, yyyy")} –{" "}
                      {format(new Date(viewItem.endDate), "MMM d, yyyy")}
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadResults.map((r) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Existing Leads (original table) */}
          <div className="overflow-x-auto rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Actions</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((l) => (
                  <TableRow key={l.id} className="transition hover:bg-primary/5">
                    <TableCell className="flex gap-2 flex-wrap sm:flex-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        className="px-2 bg-transparent transition hover:-translate-y-0.5"
                        onClick={() => updateLeadStatus(l.id, "approved")}
                      >
                        <Check size={14} className="mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="px-2 bg-transparent" asChild>
                        <a href={`mailto:${l.email}`}>
                          <Mail size={14} className="mr-1" /> Email
                        </a>
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium whitespace-normal break-words">{l.name}</TableCell>
                    <TableCell className="text-primary underline whitespace-normal break-words">
                      <a href={`mailto:${l.email}`}>{l.email}</a>
                    </TableCell>
                    <TableCell className="whitespace-normal break-words">{l.company}</TableCell>
                    <TableCell className="whitespace-normal break-words">{l.source}</TableCell>
                    <TableCell className="capitalize">{l.status}</TableCell>
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
                <TableHeader className="bg-primary/5">
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
                    <TableRow key={r.type} className="transition hover:bg-primary/5">
                      <TableCell className="font-medium flex items-center gap-2">
                        {r.type === "Call Clicks" && <PhoneIcon />}
                        {r.type === "Meeting Bookings" && <CalendarCheck className="h-4 w-4" />}
                        {r.type === "Email Clicks" && <Mail className="h-4 w-4" />}
                        {r.type === "Chat Sessions" && <MessageCircle className="h-4 w-4" />}
                        {r.type === "Guide Downloads" && <FileDown className="h-4 w-4" />}
                        {r.type}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{r.count}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.rate}</TableCell>
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
                <TableHeader className="bg-primary/5">
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
                    <TableRow key={r.stage} className="transition hover:bg-primary/5">
                      <TableCell className="font-medium">{r.stage}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.count}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.conversion}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.quality}</TableCell>
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
                <TableHeader className="bg-primary/5">
                  <TableRow>
                    <TableHead className="w-[240px]">Exhibition</TableHead>
                    <TableHead className="w-32 text-right">Views</TableHead>
                    <TableHead className="w-32 text-right">Interactions</TableHead>
                    <TableHead className="w-32 text-right">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exhibitions.map((e, i) => (
                    <TableRow key={e.id} className="transition hover:bg-primary/5">
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="text-right tabular-nums">{1000 + i * 137}</TableCell>
                      <TableCell className="text-right tabular-nums">{200 + i * 37}</TableCell>
                      <TableCell className="text-right tabular-nums">{5 + (i % 6)}%</TableCell>
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
                <TableHeader className="bg-primary/5">
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
                    <TableRow key={r.metric} className="transition hover:bg-primary/5">
                      <TableCell className="font-medium">{r.metric}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.value}</TableCell>
                      <TableCell className="text-right tabular-nums">{r.target}</TableCell>
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

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">Settings will be available here soon.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
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
