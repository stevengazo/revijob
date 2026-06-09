export type ViewMode = 'calendar' | 'kanban' | 'table'

const views: [ViewMode, string][] = [
  ['calendar', 'Calendario'],
  ['kanban', 'Kanban'],
  ['table', 'Tabla'],
]

/** Control segmentado para alternar entre las vistas de calendario, kanban y tabla. */
export default function ViewSwitcher({ value, onChange }: { value: ViewMode; onChange: (mode: ViewMode) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/10 dark:bg-slate-950/85 dark:shadow-lg dark:shadow-black/20">
      {views.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === key
              ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/20'
              : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
