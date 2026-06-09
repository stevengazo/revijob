import { applicationService } from './applicationService'
import { cvService } from './cvService'
import { APPLICATION_STATUSES } from '../types/application'
import type { ApplicationStatus } from '../types/application'

export interface CountItem {
  label: string
  count: number
}

export interface StatusCount {
  status: ApplicationStatus
  count: number
}

export interface DashboardStats {
  totalApplications: number
  cvVersions: number
  cvSkills: number
  interviewCount: number
  acceptedCount: number
  byStatus: StatusCount[]
  byPlatform: CountItem[]
  byMonth: CountItem[]
}

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

/** Color asociado a cada etapa, reutilizado por las gráficas. */
export const STATUS_COLOR: Record<ApplicationStatus, string> = {
  Pendiente: '#f59e0b',
  'En revisión': '#0ea5e9',
  Entrevista: '#8b5cf6',
  Rechazada: '#f43f5e',
  Aceptada: '#10b981',
}

/** Agrega los datos de aplicaciones y CV para alimentar el dashboard. */
export function getDashboardStats(): DashboardStats {
  const apps = applicationService.list()
  const cv = cvService.get()
  const versions = cvService.listVersions()

  const byStatus: StatusCount[] = APPLICATION_STATUSES.map((status) => ({
    status,
    count: apps.filter((app) => app.status === status).length,
  }))

  const platformMap = new Map<string, number>()
  for (const app of apps) {
    const key = app.platform?.trim() || 'Otros'
    platformMap.set(key, (platformMap.get(key) ?? 0) + 1)
  }
  const byPlatform = [...platformMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)

  // Aplicaciones de los últimos 6 meses (incluye meses sin actividad).
  const now = new Date()
  const byMonth: CountItem[] = []
  for (let i = 5; i >= 0; i -= 1) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const count = apps.filter((app) => {
      const applied = new Date(app.appliedDate)
      return applied.getFullYear() === month.getFullYear() && applied.getMonth() === month.getMonth()
    }).length
    byMonth.push({ label: MONTH_LABELS[month.getMonth()], count })
  }

  return {
    totalApplications: apps.length,
    cvVersions: versions.length,
    cvSkills: cv.skills.length,
    interviewCount: byStatus.find((item) => item.status === 'Entrevista')?.count ?? 0,
    acceptedCount: byStatus.find((item) => item.status === 'Aceptada')?.count ?? 0,
    byStatus,
    byPlatform,
    byMonth,
  }
}
