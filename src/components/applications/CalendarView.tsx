import type { EmploymentApplication } from '../../types/application'

/** Agrupa las postulaciones por fecha de aplicación en tarjetas tipo agenda. */
export default function CalendarView({ applications }: { applications: EmploymentApplication[] }) {
  const dates = Array.from(new Set(applications.map((item) => item.appliedDate)))

  return (
    <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {dates.map((date) => (
        <article key={date} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/85 dark:shadow-xl dark:shadow-black/20">
          <p className="text-sm text-violet-600 dark:text-violet-200">
            {new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' })}
          </p>
          <div className="mt-3 space-y-3">
            {applications.filter((item) => item.appliedDate === date).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-100">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.position}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{item.company} · {item.platform}</p>
                <p className="mt-1 text-xs text-violet-600 dark:text-violet-100">{item.status}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}
