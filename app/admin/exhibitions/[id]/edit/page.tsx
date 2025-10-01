"use client"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { ExhibitionWizard, type ExhibitionDetails, type ExhibitionCore } from "@/components/admin/exhibition-wizard"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { getEventById } from "@/data/events"

export default function EditExhibitionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [core, setCore] = useState<ExhibitionCore | null>(null)
  const [details, setDetails] = useState<ExhibitionDetails | undefined>()

  useEffect(() => {
    if (!id) return
    try {
      const listRaw = localStorage.getItem("admin_custom_exhibitions")
      const detailsRaw = localStorage.getItem("admin_exhibition_details")
      const list = listRaw ? (JSON.parse(listRaw) as any[]) : []
      let ex = list.find((x) => x.id === id)
      if (!ex) {
        // Fallback to seeded event
        const seeded = getEventById(id as string)
        if (seeded) {
          ex = {
            id: seeded.id,
            name: seeded.name,
            industry: seeded.category,
            city: seeded.city,
            country: seeded.country,
            startDate: seeded.startDate.slice(0, 10),
            endDate: seeded.endDate.slice(0, 10),
            status: "published",
          }
        }
      }
      if (ex) {
        setCore({
          id: ex.id,
          name: ex.name,
          industry: ex.industry,
          city: ex.city,
          country: ex.country,
          startDate: ex.startDate,
          endDate: ex.endDate,
          status: ex.status,
        })
      }
      const map = detailsRaw ? (JSON.parse(detailsRaw) as Record<string, ExhibitionDetails>) : {}
      const d = map[id] || {
        about: {
          organizer: "",
          venue: `${ex?.city || ""} Expo Center`,
          format: "Trade Show",
          entryFee: "Free",
          description: getEventById(id as string)?.description || "",
          tags: "",
          coverImageUrl: getEventById(id as string)?.coverImage,
        },
        exhibitors: [],
        speakers: [],
      }
      setDetails(d)
    } catch {}
  }, [id])

  function save(nextCore: ExhibitionCore, nextDetails: ExhibitionDetails) {
    try {
      const listRaw = localStorage.getItem("admin_custom_exhibitions")
      const list = listRaw ? (JSON.parse(listRaw) as any[]) : []
      const updated = list.map((x) => (x.id === id ? { ...x, ...nextCore } : x))
      localStorage.setItem("admin_custom_exhibitions", JSON.stringify(updated))
      const detailsRaw = localStorage.getItem("admin_exhibition_details")
      const map = detailsRaw ? (JSON.parse(detailsRaw) as Record<string, ExhibitionDetails>) : {}
      localStorage.setItem("admin_exhibition_details", JSON.stringify({ ...map, [id]: nextDetails }))
    } catch {}
    router.push("/admin?tab=exhibitions")
  }

  if (!core) return (
    <AdminAuthGuard>
      <main className="mx-auto max-w-6xl px-4 py-6">Loading...</main>
    </AdminAuthGuard>
  )

  return (
    <AdminAuthGuard>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ExhibitionWizard mode="edit" initialCore={core} initialDetails={details} onCancel={() => history.back()} onSave={save} />
      </main>
    </AdminAuthGuard>
  )
}


