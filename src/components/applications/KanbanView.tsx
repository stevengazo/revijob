import { APPLICATION_STATUSES } from '../../types/application'
import type { EmploymentApplication } from '../../types/application'

interface KanbanViewProps {
  applications: EmploymentApplication[]
  onView: (item: EmploymentApplication) => void
  onEdit: (item: EmploymentApplication) => void
}

const cardButtonClass =
  'rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-slate-900/80 dark:text-white dark:hover:bg-slate-800'

/** Tablero kanban con una columna por estado de la postulación. */
export default function KanbanView({ applications, onView, onEdit }: KanbanViewProps) {
  return (
    <div className="mt-5 grid gap-4 xl:grid-cols-5">
      {APPLICATION_STATUSES.map((stage) => {
        const items = applications.filter((item) => item.status === stage)
        return (
          <article key={stage} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-white/10 dark:bg-slate-950/85 dark:shadow-xl dark:shadow-black/20">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{stage}</p>
            <p className="text-xs text-slate-400 dark:text-slate-400">{items.length} registros</p>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 dark:border-white/10 dark:bg-white/6 dark:text-slate-100">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.position}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{item.company}</p>
                  <p className="mt-1 text-xs text-violet-600 dark:text-violet-100">{item.appliedDate}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => onView(item)} className={cardButtonClass}>Ver</button>
                    <button type="button" onClick={() => onEdit(item)} className={cardButtonClass}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}
