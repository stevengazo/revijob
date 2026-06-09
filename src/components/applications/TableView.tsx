import type { EmploymentApplication } from '../../types/application'

interface TableViewProps {
  applications: EmploymentApplication[]
  onView: (item: EmploymentApplication) => void
  onEdit: (item: EmploymentApplication) => void
  onRemove: (id: string) => void
}

const actionButtonClass =
  'rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/6 dark:text-white dark:hover:bg-white/10'

/** Tabla con todas las postulaciones y acciones por fila. */
export default function TableView({ applications, onView, onEdit, onRemove }: TableViewProps) {
  return (
    <div className="mt-5 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 shadow-sm dark:border-white/10 dark:bg-slate-950/85 dark:shadow-xl dark:shadow-black/20">
      <table className="min-w-full text-left text-sm text-slate-600 dark:text-slate-200">
        <thead className="bg-slate-100 text-slate-700 dark:bg-white/6 dark:text-slate-100">
          <tr>
            <th className="px-4 py-3">Empresa</th>
            <th className="px-4 py-3">Puesto</th>
            <th className="px-4 py-3">Plataforma</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((item) => (
            <tr key={item.id} className="border-t border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/5">
              <td className="px-4 py-3 text-slate-900 dark:text-white">{item.company}</td>
              <td className="px-4 py-3">{item.position}</td>
              <td className="px-4 py-3">{item.platform}</td>
              <td className="px-4 py-3">{item.status}</td>
              <td className="px-4 py-3">{item.appliedDate}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onView(item)} className={actionButtonClass}>Ver</button>
                  <button type="button" onClick={() => onEdit(item)} className={actionButtonClass}>Editar</button>
                  <button type="button" onClick={() => onRemove(item.id)} className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-100 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-100">Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
