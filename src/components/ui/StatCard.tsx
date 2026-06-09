import { cardClass } from './styles'

/** Tarjeta compacta para mostrar una métrica con su etiqueta. */
export default function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <article className={cardClass}>
      <p className="text-sm text-slate-500 dark:text-slate-300">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </article>
  )
}
