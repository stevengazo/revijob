import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getDashboardStats, STATUS_COLOR } from '../services/dashboardService'
import { BarList, ColumnChart, DonutChart, StatCard } from '../components/dashboard/DashboardCharts'

const PLATFORM_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#6366f1']

export default function HomePage() {
  const stats = useMemo(() => getDashboardStats(), [])

  const statusData = stats.byStatus.map((item) => ({
    label: item.status,
    value: item.count,
    color: STATUS_COLOR[item.status],
  }))

  const platformData = stats.byPlatform.map((item, index) => ({
    label: item.label,
    value: item.count,
    color: PLATFORM_COLORS[index % PLATFORM_COLORS.length],
  }))

  const monthData = stats.byMonth.map((item) => ({ label: item.label, value: item.count, color: '#8b5cf6' }))

  const successRate = stats.totalApplications > 0 ? Math.round((stats.acceptedCount / stats.totalApplications) * 100) : 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-7xl flex-col gap-6"
    >
      {/* Cabecera */}
      <div className="flex flex-wrap items-end justify-between gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Panel</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">Resumen de tu búsqueda</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Métricas de tus postulaciones, etapas y currículum en tiempo real.</p>
        </div>
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-700 hover:to-sky-600"
        >
          Ver postulaciones
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Postulaciones"
          value={stats.totalApplications}
          hint="Total registradas"
          accent="text-sky-600 dark:text-sky-300"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" /></svg>
          }
        />
        <StatCard
          label="Aceptadas"
          value={stats.acceptedCount}
          hint={`Tasa de éxito ${successRate}%`}
          accent="text-emerald-600 dark:text-emerald-300"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          }
        />
        <StatCard
          label="Entrevistas"
          value={stats.interviewCount}
          hint="En etapa de entrevista"
          accent="text-amber-600 dark:text-amber-300"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" /><circle cx="10" cy="7" r="4" /><path d="M21 8v6M18 11h6" strokeLinecap="round" /></svg>
          }
        />
        <StatCard
          label="Versiones de CV"
          value={stats.cvVersions}
          hint={`${stats.cvSkills} habilidades`}
          accent="text-violet-600 dark:text-violet-300"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5"><path d="M8 4h8l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3Z" strokeLinejoin="round" /><path d="M8 13h8M8 17h5" strokeLinecap="round" /></svg>
          }
        />
      </div>

      {/* Gráficas principales */}
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-2xl dark:shadow-black/30">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Etapas del proceso</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">Distribución de postulaciones por estado.</p>
          </div>
          <DonutChart data={statusData} />
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-2xl dark:shadow-black/30">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Plataformas</h2>
            <p className="text-xs text-slate-500 dark:text-slate-300">Dónde aplicas con más frecuencia.</p>
          </div>
          <BarList data={platformData} emptyLabel="Aún no hay postulaciones registradas." />
        </article>
      </div>

      {/* Evolución mensual */}
      <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-2xl dark:shadow-black/30">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Actividad de los últimos 6 meses</h2>
          <p className="text-xs text-slate-500 dark:text-slate-300">Postulaciones enviadas por mes.</p>
        </div>
        <ColumnChart data={monthData} />
      </article>
    </motion.section>
  )
}
