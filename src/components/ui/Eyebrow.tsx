import type { ReactNode } from 'react'

/** Etiqueta pequeña en mayúsculas con tracking amplio que encabeza las secciones. */
export default function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">{children}</p>
  )
}
