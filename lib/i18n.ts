import type { Language } from "./slices/ui-slice"

const dict = {
  en: {
    adminPortal: "Admin Portal",
    searchPlaceholder: "Search topic, event or location…",
    searchAria: "Search events by topic, name or location",
    dashboard: "Dashboard",
    exhibitions: "Exhibitions",
    leads: "Leads",
    totalExhibitions: "Total Exhibitions",
    totalLeads: "Total Leads",
    totalInteractions: "Total Interactions",
    guideDownloads: "Guide Downloads",
    recentLeads: "Recent Leads",
    exportExcel: "Export as Excel",
    addExhibition: "Add Exhibition",
  },
  es: {
    adminPortal: "Portal de Administración",
    searchPlaceholder: "Buscar tema, evento o ubicación…",
    searchAria: "Buscar eventos por tema, nombre o ubicación",
    dashboard: "Panel",
    exhibitions: "Exhibiciones",
    leads: "Leads",
    totalExhibitions: "Exhibiciones Totales",
    totalLeads: "Leads Totales",
    totalInteractions: "Interacciones Totales",
    guideDownloads: "Descargas de Guía",
    recentLeads: "Leads Recientes",
    exportExcel: "Exportar a Excel",
    addExhibition: "Añadir Exhibición",
  },
}

export function getT(lang: Language) {
  return dict[lang] || dict.en
}
