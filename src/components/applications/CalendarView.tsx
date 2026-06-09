import { useMemo, useState } from 'react'
import type { ApplicationStatus, EmploymentApplication } from '../../types/application'

interface CalendarViewProps {
  applications: EmploymentApplication[]
  onView: (item: EmploymentApplication) => void
}

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const statusDot: Record<ApplicationStatus, string> = {
  Pendiente: 'bg-slate-400',
  'En revisión': 'bg-amber-400',
  Entrevista: 'bg-violet-500',
  Rechazada: 'bg-rose-500',
  Aceptada: 'bg-emerald-500',
}

/** Convierte una fecha a la clave local 'YYYY-MM-DD' que usa appliedDate. */
const toKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

/** Calendario mensual con las postulaciones ubicadas en su fecha de aplicación. */
export default function CalendarView({ applications, onView }: CalendarViewProps) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const byDate = useMemo(() => {
    const map = new Map<string, EmploymentApplication[]>()
    for (const item of applications) {
      const list = map.get(item.appliedDate) ?? []
      list.push(item)
      map.set(item.appliedDate, list)
    }
    return map
  }, [applications])

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const todayKey = toKey(new Date())

  const cells = useMemo(() => {
    const startOffset = (new Date(year, month, 1).getDay() + 6) % 7 // semana inicia en lunes
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const weeks = Math.ceil((startOffset + daysInMonth) / 7)
    return Array.from({ length: weeks * 7 }, (_, i) => new Date(year, month, 1 - startOffset + i))
  }, [year, month])

  const monthLabel = cursor.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  const goToMonth = (delta: number) => setCursor(new Date(year, month + delta, 1))
  const goToday = () => {
    const now = new Date()
    setCursor(new Date(now.getFullYear(), now.getMonth(), 1))
  }

  return (
    <div className="mt-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">{monthLabel}</h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goToMonth(-1)} aria-label="Mes anterior" className={navButton}>‹</button>
          <button type="button" onClick={goToday} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10">Hoy</button>
          <button type="button" onClick={() => goToMonth(1)} aria-label="Mes siguiente" className={navButton}>›</button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="grid grid-cols-7 gap-2">
            {WEEKDAYS.map((day) => (
              <div key={day} className="px-2 pb-1 text-center text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{day}</div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-2">
            {cells.map((date) => {
              const key = toKey(date)
              const items = byDate.get(key) ?? []
              const inMonth = date.getMonth() === month
              const isToday = key === todayKey
              return (
                <div
                  key={key}
                  className={`flex min-h-[104px] flex-col rounded-2xl border p-2 transition ${
                    inMonth
                      ? 'border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950/85'
                      : 'border-transparent bg-slate-100/40 text-slate-400 dark:bg-white/5 dark:text-slate-600'
                  } ${isToday ? 'ring-2 ring-violet-400 dark:ring-violet-500/60' : ''}`}
                >
                  <span className={`text-xs font-semibold ${isToday ? 'text-violet-600 dark:text-violet-300' : inMonth ? 'text-slate-500 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onView(item)}
                        title={`${item.position} · ${item.company} · ${item.status}`}
                        className="flex w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-1.5 py-1 text-left text-[11px] font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:border-violet-400/40 dark:hover:bg-white/10"
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${statusDot[item.status]}`} />
                        <span className="truncate">{item.position}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {(Object.keys(statusDot) as ApplicationStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className={`h-2 w-2 rounded-full ${statusDot[status]}`} />
            {status}
          </span>
        ))}
      </div>
    </div>
  )
}

const navButton =
  'grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-slate-100 text-lg leading-none text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10'
