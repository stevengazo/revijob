import type { ReactNode } from 'react'
import { panelClass } from './styles'

/** Contenedor principal con esquinas redondeadas y estilo glass en modo oscuro. */
export default function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`${panelClass} ${className}`}>{children}</section>
}
