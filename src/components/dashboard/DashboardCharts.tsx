import type { ReactNode } from 'react'

export interface ChartDatum {
  label: string
  value: number
  color: string
}

/** Tarjeta de métrica (KPI). */
export function StatCard({
  label,
  value,
  hint,
  icon,
  accent = 'text-violet-600 dark:text-violet-300',
}: {
  label: string
  value: number | string
  hint?: string
  icon?: ReactNode
  accent?: string
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-slate-900/70 dark:shadow-xl dark:shadow-black/20">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{label}</p>
        {icon ? <span className={accent}>{icon}</span> : null}
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400 dark:text-slate-400">{hint}</p> : null}
    </div>
  )
}

/** Gráfica de dona con leyenda lateral. */
export function DonutChart({ data, size = 184, thickness = 24 }: { data: ChartDatum[]; size?: number; thickness?: number }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const radius = (size - thickness) / 2
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="stroke-slate-100 dark:stroke-white/5"
          />
          {total > 0
            ? data.map((item) => {
                if (item.value === 0) return null
                const length = (item.value / total) * circumference
                const segment = (
                  <circle
                    key={item.label}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={thickness}
                    strokeDasharray={`${length} ${circumference - length}`}
                    strokeDashoffset={-offset}
                  />
                )
                offset += length
                return segment
              })
            : null}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-900 dark:text-white">{total}</span>
          <span className="text-xs text-slate-400">total</span>
        </div>
      </div>

      <ul className="flex-1 space-y-2">
        {data.map((item) => {
          const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
          return (
            <li key={item.label} className="flex items-center gap-3">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="flex-1 text-sm text-slate-600 dark:text-slate-200">{item.label}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
              <span className="w-10 text-right text-xs text-slate-400">{pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Gráfica de columnas verticales (p. ej. evolución por mes). */
export function ColumnChart({ data, color = '#8b5cf6' }: { data: ChartDatum[]; color?: string }) {
  const max = Math.max(1, ...data.map((item) => item.value))

  return (
    <div className="flex h-44 items-end justify-between gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-300">{item.value}</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-slate-100 transition-all dark:bg-white/5"
              style={{
                height: `${(item.value / max) * 100}%`,
                minHeight: item.value > 0 ? 6 : 3,
                backgroundColor: item.value > 0 ? color : undefined,
              }}
            />
          </div>
          <span className="text-xs text-slate-400">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Lista de barras horizontales (p. ej. por plataforma). */
export function BarList({ data, color = '#0ea5e9', emptyLabel = 'Sin datos' }: { data: ChartDatum[]; color?: string; emptyLabel?: string }) {
  const max = Math.max(1, ...data.map((item) => item.value))

  if (data.length === 0) {
    return <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400 dark:border-white/10 dark:bg-slate-900/60">{emptyLabel}</p>
  }

  return (
    <ul className="space-y-3">
      {data.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-200">{item.label}</span>
            <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
            <div className="h-full rounded-full transition-all" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
