"use client"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { ExhibitionWizard, type ExhibitionDetails, type ExhibitionCore } from "@/components/admin/exhibition-wizard"
import { useRouter } from "next/navigation"

export default function NewExhibitionPage() {
  const router = useRouter()
  const emptyCore: ExhibitionCore = {
    name: "",
    industry: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
    status: "draft",
  }

  function save(core: ExhibitionCore, details: ExhibitionDetails) {
    const next = {
      id: `ex-${Date.now()}`,
      name: core.name,
      industry: core.industry,
      city: core.city,
      country: core.country,
      startDate: core.startDate,
      endDate: core.endDate,
      status: core.status,
    }
    try {
      const listRaw = localStorage.getItem("admin_custom_exhibitions")
      const list = listRaw ? (JSON.parse(listRaw) as any[]) : []
      const updated = [next, ...list].filter(Boolean)
      localStorage.setItem("admin_custom_exhibitions", JSON.stringify(updated))
      const detailsRaw = localStorage.getItem("admin_exhibition_details")
      const map = detailsRaw ? (JSON.parse(detailsRaw) as Record<string, ExhibitionDetails>) : {}
      localStorage.setItem("admin_exhibition_details", JSON.stringify({ ...map, [next.id]: details }))
    } catch {}
    router.push("/admin?tab=exhibitions")
  }

  return (
    <AdminAuthGuard>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <ExhibitionWizard mode="add" initialCore={emptyCore} onCancel={() => history.back()} onSave={save} />
      </main>
    </AdminAuthGuard>
  )
}


