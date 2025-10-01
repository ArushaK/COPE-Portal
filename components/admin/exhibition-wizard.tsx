"use client"
import { useEffect, useMemo, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Pencil, Trash2 } from "lucide-react"

export type ExhibitionCore = {
  id?: string
  name: string
  industry: string
  city: string
  country: string
  startDate: string
  endDate: string
  status: "published" | "draft"
}

export type ExhibitorForm = {
  id?: string
  name: string
  city: string
  country: string
  booth: string
  products: string
  description: string
  imageUrl?: string
}

export type SpeakerForm = {
  id?: string
  name: string
  title: string
  organization: string
  city: string
  country: string
  imageUrl?: string
}

export type ExhibitionDetails = {
  about: {
    organizer: string
    venue: string
    format: string
    entryFee: string
    description: string
    tags: string
    coverImageUrl?: string
  }
  exhibitors: ExhibitorForm[]
  speakers: SpeakerForm[]
}

export function ExhibitionWizard({
  mode,
  initialCore,
  initialDetails,
  onCancel,
  onSave,
}: {
  mode: "add" | "edit"
  initialCore: ExhibitionCore
  initialDetails?: ExhibitionDetails
  onCancel: () => void
  onSave: (core: ExhibitionCore, details: ExhibitionDetails) => void
}) {
  const { toast } = useToast()
  const [core, setCore] = useState<ExhibitionCore>(initialCore)
  const [details, setDetails] = useState<ExhibitionDetails>(
    initialDetails || {
      about: {
        organizer: "",
        venue: "",
        format: "Trade Show",
        entryFee: "Free",
        description: "",
        tags: "",
        coverImageUrl: undefined,
      },
      exhibitors: [],
      speakers: [],
    },
  )
  useEffect(() => setCore(initialCore), [JSON.stringify(initialCore)])
  useEffect(() => {
    if (initialDetails) setDetails(initialDetails)
  }, [JSON.stringify(initialDetails)])

  function handleCoverUpload(_e: React.ChangeEvent<HTMLInputElement>) {
    // No preview by request; do not persist object URL
  }

  function addExhibitor() {
    setExDraft({ name: "", city: "", country: "", booth: "", products: "", description: "" })
    setExEditIdx(null)
    setExOpen(true)
  }
  function addSpeaker() {
    setSpDraft({ name: "", title: "", organization: "", city: "", country: "" })
    setSpEditIdx(null)
    setSpOpen(true)
  }

  function handleExhibitorImage(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setDetails((d) => {
      const list = [...d.exhibitors]
      list[i] = { ...list[i], imageUrl: url }
      return { ...d, exhibitors: list }
    })
    e.currentTarget.value = ""
  }
  function handleSpeakerImage(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    const url = URL.createObjectURL(f)
    setDetails((d) => {
      const list = [...d.speakers]
      list[i] = { ...list[i], imageUrl: url }
      return { ...d, speakers: list }
    })
    e.currentTarget.value = ""
  }

  const [exOpen, setExOpen] = useState(false)
  const [spOpen, setSpOpen] = useState(false)
  const [exDraft, setExDraft] = useState<ExhibitorForm>({ name: "", city: "", country: "", booth: "", products: "", description: "" })
  const [spDraft, setSpDraft] = useState<SpeakerForm>({ name: "", title: "", organization: "", city: "", country: "" })
  const [exEditIdx, setExEditIdx] = useState<number | null>(null)
  const [spEditIdx, setSpEditIdx] = useState<number | null>(null)

  const [tab, setTab] = useState("about")

  // Field-level validation state
  const [aboutTouched, setAboutTouched] = useState<Record<string, boolean>>({})
  const [exTouched, setExTouched] = useState<Record<string, boolean>>({})
  const [spTouched, setSpTouched] = useState<Record<string, boolean>>({})

  function aboutErrors() {
    const errs: Record<string, string> = {}
    if (!core.name.trim()) errs.name = "Name is required"
    if (!core.industry.trim()) errs.industry = "Industry is required"
    if (!core.city.trim()) errs.city = "City is required"
    if (!core.country.trim()) errs.country = "Country is required"
    if (!core.startDate) errs.startDate = "Start date is required"
    if (!core.endDate) errs.endDate = "End date is required"
    if (core.startDate && core.endDate && core.endDate < core.startDate) errs.endDate = "End date must be after start date"
    if (!details.about.description.trim()) errs.description = "Description is required"
    return errs
  }
  function exhibitorErrors(d: ExhibitorForm) {
    const errs: Record<string, string> = {}
    if (!d.name.trim()) errs.name = "Company name is required"
    if (!d.city.trim()) errs.city = "City is required"
    if (!d.country.trim()) errs.country = "Country is required"
    return errs
  }
  function speakerErrors(d: SpeakerForm) {
    const errs: Record<string, string> = {}
    if (!d.name.trim()) errs.name = "Name is required"
    if (!d.title.trim()) errs.title = "Title is required"
    if (!d.organization.trim()) errs.organization = "Organization is required"
    if (!d.city.trim()) errs.city = "City is required"
    if (!d.country.trim()) errs.country = "Country is required"
    return errs
  }

  function submitExhibitor() {
    const errs = exhibitorErrors(exDraft)
    if (Object.keys(errs).length) {
      setExTouched({ name: true, city: true, country: true, title: true })
      return
    }
    setDetails((d) => {
      if (exEditIdx != null) {
        const list = [...d.exhibitors]
        list[exEditIdx] = exDraft
        return { ...d, exhibitors: list }
      }
      return { ...d, exhibitors: [exDraft, ...d.exhibitors] }
    })
    setExDraft({ name: "", city: "", country: "", booth: "", products: "", description: "" })
    setExTouched({})
    setExEditIdx(null)
    setExOpen(false)
  }
  function submitSpeaker() {
    const errs = speakerErrors(spDraft)
    if (Object.keys(errs).length) {
      setSpTouched({ name: true, title: true, organization: true, city: true, country: true })
      return
    }
    setDetails((d) => {
      if (spEditIdx != null) {
        const list = [...d.speakers]
        list[spEditIdx] = spDraft
        return { ...d, speakers: list }
      }
      return { ...d, speakers: [spDraft, ...d.speakers] }
    })
    setSpDraft({ name: "", title: "", organization: "", city: "", country: "" })
    setSpTouched({})
    setSpEditIdx(null)
    setSpOpen(false)
  }

  function save() {
    const errs = aboutErrors()
    if (Object.keys(errs).length) {
      setAboutTouched({ name: true, industry: true, city: true, country: true, startDate: true, endDate: true, description: true })
      setFormError(Object.values(errs).join(". "))
      setTab("about")
      toast({ title: "Please fix errors in About", description: "Some required fields are missing or invalid." })
      return
    }
    setFormError("")
    onSave(core, details)
  }

  const [formError, setFormError] = useState("")

  return (
    <div className="space-y-3">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="exhibitors">Exhibitors</TabsTrigger>
          <TabsTrigger value="speakers">Speakers</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle>{mode === "add" ? "Create Exhibition" : "Edit Exhibition"}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-sm">Name *</label>
                <Input value={core.name} onChange={(e) => setCore({ ...core, name: e.target.value })} onBlur={() => setAboutTouched((t) => ({ ...t, name: true }))} />
                {aboutTouched.name && !core.name.trim() && <div className="text-xs text-red-600 mt-1">Name is required</div>}
              </div>
              <div>
                <label className="text-sm">Industry *</label>
                <Input value={core.industry} onChange={(e) => setCore({ ...core, industry: e.target.value })} onBlur={() => setAboutTouched((t) => ({ ...t, industry: true }))} />
                {aboutTouched.industry && !core.industry.trim() && <div className="text-xs text-red-600 mt-1">Industry is required</div>}
              </div>
              <div>
                <label className="text-sm">City *</label>
                <Input value={core.city} onChange={(e) => setCore({ ...core, city: e.target.value })} onBlur={() => setAboutTouched((t) => ({ ...t, city: true }))} />
                {aboutTouched.city && !core.city.trim() && <div className="text-xs text-red-600 mt-1">City is required</div>}
              </div>
              <div>
                <label className="text-sm">Country *</label>
                <Input value={core.country} onChange={(e) => setCore({ ...core, country: e.target.value })} onBlur={() => setAboutTouched((t) => ({ ...t, country: true }))} />
                {aboutTouched.country && !core.country.trim() && <div className="text-xs text-red-600 mt-1">Country is required</div>}
              </div>
              <div>
                <label className="text-sm">Start Date *</label>
                <Input type="date" value={core.startDate} onChange={(e) => setCore({ ...core, startDate: e.target.value })} onBlur={() => setAboutTouched((t) => ({ ...t, startDate: true }))} />
                {aboutTouched.startDate && !core.startDate && <div className="text-xs text-red-600 mt-1">Start date is required</div>}
              </div>
              <div>
                <label className="text-sm">End Date *</label>
                <Input type="date" value={core.endDate} onChange={(e) => setCore({ ...core, endDate: e.target.value })} onBlur={() => setAboutTouched((t) => ({ ...t, endDate: true }))} />
                {aboutTouched.endDate && (!core.endDate || (core.startDate && core.endDate < core.startDate)) && (
                  <div className="text-xs text-red-600 mt-1">{!core.endDate ? "End date is required" : "End date must be after start date"}</div>
                )}
              </div>

              <div>
                <label className="text-sm">Organizer</label>
                <Input value={details.about.organizer} onChange={(e) => setDetails((d) => ({ ...d, about: { ...d.about, organizer: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm">Venue</label>
                <Input value={details.about.venue} onChange={(e) => setDetails((d) => ({ ...d, about: { ...d.about, venue: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm">Format</label>
                <Input value={details.about.format} onChange={(e) => setDetails((d) => ({ ...d, about: { ...d.about, format: e.target.value } }))} />
              </div>
              <div>
                <label className="text-sm">Entry Fee</label>
                <Input value={details.about.entryFee} onChange={(e) => setDetails((d) => ({ ...d, about: { ...d.about, entryFee: e.target.value } }))} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Short Description *</label>
                <Textarea value={details.about.description} onChange={(e) => setDetails((d) => ({ ...d, about: { ...d.about, description: e.target.value } }))} onBlur={() => setAboutTouched((t) => ({ ...t, description: true }))} />
                {aboutTouched.description && !details.about.description.trim() && <div className="text-xs text-red-600 mt-1">Description is required</div>}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Tags</label>
                <Input value={details.about.tags} onChange={(e) => setDetails((d) => ({ ...d, about: { ...d.about, tags: e.target.value } }))} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm">Cover Image</label>
                <Input type="file" accept="image/*" onChange={handleCoverUpload} />
                {formError && <div className="text-sm text-red-600">{formError}</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exhibitors" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">List of exhibitors you have added.</div>
            <Button onClick={addExhibitor} size="sm">Add Exhibitor</Button>
          </div>
          <Dialog open={exOpen} onOpenChange={(v) => {
            if (!v) { setExEditIdx(null) }
            setExOpen(v)
          }}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{exEditIdx != null ? "Edit Exhibitor" : "Add Exhibitor"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-sm">Company Name *</label>
                  <Input value={exDraft.name} onChange={(e) => setExDraft((d) => ({ ...d, name: e.target.value }))} onBlur={() => setExTouched((t) => ({ ...t, name: true }))} />
                  {exTouched.name && !exDraft.name.trim() && <div className="text-xs text-red-600 mt-1">Company name is required</div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm">City *</label>
                    <Input value={exDraft.city} onChange={(e) => setExDraft((d) => ({ ...d, city: e.target.value }))} onBlur={() => setExTouched((t) => ({ ...t, city: true }))} />
                    {exTouched.city && !exDraft.city.trim() && <div className="text-xs text-red-600 mt-1">City is required</div>}
                  </div>
                  <div>
                    <label className="text-sm">Country *</label>
                    <Input value={exDraft.country} onChange={(e) => setExDraft((d) => ({ ...d, country: e.target.value }))} onBlur={() => setExTouched((t) => ({ ...t, country: true }))} />
                    {exTouched.country && !exDraft.country.trim() && <div className="text-xs text-red-600 mt-1">Country is required</div>}
                  </div>
                </div>
                <Input placeholder="Booth (e.g., B2)" value={exDraft.booth} onChange={(e) => setExDraft((d) => ({ ...d, booth: e.target.value }))} />
                <Input placeholder="Products (comma separated)" value={exDraft.products} onChange={(e) => setExDraft((d) => ({ ...d, products: e.target.value }))} />
                <Textarea placeholder="Short description" value={exDraft.description} onChange={(e) => setExDraft((d) => ({ ...d, description: e.target.value }))} />
                <div>
                  <label className="text-sm">Logo / Image</label>
                  <Input type="file" accept="image/*" onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const url = URL.createObjectURL(f)
                    setExDraft((d) => ({ ...d, imageUrl: url }))
                  }} />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setExOpen(false)}>Cancel</Button>
                  <Button onClick={submitExhibitor}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {details.exhibitors.length === 0 ? (
            <div className="rounded-md border p-6 text-center text-muted-foreground">No exhibitors added yet.</div>
          ) : (
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Actions</TableHead>
                    <TableHead className="w-28">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Booth</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.exhibitors.map((ex, i) => (
                    <TableRow key={i} className="cursor-pointer" onClick={() => { setExDraft(ex); setExEditIdx(i); setExOpen(true) }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" title="Edit" onClick={() => {
                            setExDraft(ex)
                            setExEditIdx(i)
                            setExOpen(true)
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" title="Delete" onClick={() => setDetails((d) => ({ ...d, exhibitors: d.exhibitors.filter((_, idx) => idx !== i) }))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ex.imageUrl ? (
                          <img src={ex.imageUrl} alt="exh" className="h-14 w-20 object-cover rounded" />
                        ) : (
                          <div className="h-14 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{ex.name || `Exhibitor #${i + 1}`}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{(ex.city && ex.country) ? `${ex.city}, ${ex.country}` : "—"}</TableCell>
                      <TableCell>{ex.booth || "—"}</TableCell>
                      <TableCell className="text-xs">{ex.products || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          
        </TabsContent>

        <TabsContent value="speakers" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">List of speakers you have added.</div>
            <Button onClick={addSpeaker} size="sm">Add Speaker</Button>
          </div>
          <Dialog open={spOpen} onOpenChange={(v) => { if (!v) { setSpEditIdx(null) } setSpOpen(v) }}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{spEditIdx != null ? "Edit Speaker" : "Add Speaker"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <label className="text-sm">Full Name *</label>
                  <Input value={spDraft.name} onChange={(e) => setSpDraft((d) => ({ ...d, name: e.target.value }))} onBlur={() => setSpTouched((t) => ({ ...t, name: true }))} />
                  {spTouched.name && !spDraft.name.trim() && <div className="text-xs text-red-600 mt-1">Name is required</div>}
                </div>
                <div>
                  <label className="text-sm">Title *</label>
                  <Input value={spDraft.title} onChange={(e) => setSpDraft((d) => ({ ...d, title: e.target.value }))} onBlur={() => setSpTouched((t) => ({ ...t, title: true }))} />
                  {spTouched.title && !spDraft.title.trim() && <div className="text-xs text-red-600 mt-1">Title is required</div>}
                </div>
                <div>
                  <label className="text-sm">Organization *</label>
                  <Input value={spDraft.organization} onChange={(e) => setSpDraft((d) => ({ ...d, organization: e.target.value }))} onBlur={() => setSpTouched((t) => ({ ...t, organization: true }))} />
                  {spTouched.organization && !spDraft.organization.trim() && <div className="text-xs text-red-600 mt-1">Organization is required</div>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm">City *</label>
                    <Input value={spDraft.city} onChange={(e) => setSpDraft((d) => ({ ...d, city: e.target.value }))} onBlur={() => setSpTouched((t) => ({ ...t, city: true }))} />
                    {spTouched.city && !spDraft.city.trim() && <div className="text-xs text-red-600 mt-1">City is required</div>}
                  </div>
                  <div>
                    <label className="text-sm">Country *</label>
                    <Input value={spDraft.country} onChange={(e) => setSpDraft((d) => ({ ...d, country: e.target.value }))} onBlur={() => setSpTouched((t) => ({ ...t, country: true }))} />
                    {spTouched.country && !spDraft.country.trim() && <div className="text-xs text-red-600 mt-1">Country is required</div>}
                  </div>
                </div>
                <div>
                  <label className="text-sm">Photo</label>
                  <Input type="file" accept="image/*" onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    const url = URL.createObjectURL(f)
                    setSpDraft((d) => ({ ...d, imageUrl: url }))
                  }} />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button variant="secondary" onClick={() => setSpOpen(false)}>Cancel</Button>
                  <Button onClick={submitSpeaker}>Add</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {details.speakers.length === 0 ? (
            <div className="rounded-md border p-6 text-center text-muted-foreground">No speakers added yet.</div>
          ) : (
            <div className="overflow-x-auto rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Actions</TableHead>
                    <TableHead className="w-28">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {details.speakers.map((sp, i) => (
                    <TableRow key={i} className="cursor-pointer" onClick={() => { setSpDraft(sp); setSpEditIdx(i); setSpOpen(true) }}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" title="Edit" onClick={() => {
                            setSpDraft(sp)
                            setSpEditIdx(i)
                            setSpOpen(true)
                          }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" title="Delete" onClick={() => setDetails((d) => ({ ...d, speakers: d.speakers.filter((_, idx) => idx !== i) }))}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        {sp.imageUrl ? (
                          <img src={sp.imageUrl} alt="sp" className="h-14 w-20 object-cover rounded" />
                        ) : (
                          <div className="h-14 w-20 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">No Image</div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{sp.name || `Speaker #${i + 1}`}</TableCell>
                      <TableCell>{sp.title || "—"}</TableCell>
                      <TableCell>{sp.organization || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{(sp.city && sp.country) ? `${sp.city}, ${sp.country}` : "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        {tab !== "speakers" ? (
          <Button onClick={() => setTab(tab === "about" ? "exhibitors" : "speakers")}>Next</Button>
        ) : (
          <Button onClick={save}>{mode === "add" ? "Create" : "Save"}</Button>
        )}
      </div>
    </div>
  )
}


