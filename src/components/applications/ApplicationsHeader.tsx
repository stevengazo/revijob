import { motion } from 'framer-motion'
import { Eyebrow, PrimaryButton, panelClass } from '../ui'

interface Stat {
  label: string
  value: number
}

/** Cabecera de la página de aplicaciones con título, métricas compactas y acción de crear. */
export default function ApplicationsHeader({ stats, onCreate }: { stats: Stat[]; onCreate: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`relative overflow-hidden ${panelClass} lg:p-8`}
    >
      {/* Resplandor decorativo de fondo */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-violet-500/20 to-sky-500/20 blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/30">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div>
            <Eyebrow>Aplicaciones</Eyebrow>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white lg:text-4xl">Registro y control de aplicaciones</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-200">Administra tus postulaciones, actualiza estados y guarda observaciones en un solo lugar.</p>
          </div>
        </div>

        <PrimaryButton type="button" onClick={onCreate} className="flex items-center gap-2 whitespace-nowrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nueva aplicación
        </PrimaryButton>
      </div>

      <div className="relative mt-6 flex flex-wrap gap-2">
        {stats.map((stat) => (
          <span
            key={stat.label}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-slate-200"
          >
            <strong className="text-slate-900 dark:text-white">{stat.value}</strong>
            {stat.label}
          </span>
        ))}
      </div>
    </motion.header>
  )
}
