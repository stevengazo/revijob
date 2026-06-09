export type ApplicationStatus =
  | 'Pendiente'
  | 'En revisión'
  | 'Entrevista'
  | 'Rechazada'
  | 'Aceptada'

/** Lista canónica de estados, usada en el kanban y el formulario. */
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Pendiente',
  'En revisión',
  'Entrevista',
  'Rechazada',
  'Aceptada',
]

/**
 * Representa una aplicación de empleo registrada por el usuario.
 * Se usa como modelo base para crear, editar, listar y filtrar registros.
 */
/** Entrada de texto con marca de tiempo (comentarios y notas comparten forma). */
export interface EntryItem {
  id: string
  text: string
  createdAt: string
}

export type CommentItem = EntryItem
export type NoteItem = EntryItem

export interface EmploymentApplication {
  id: string
  company: string
  position: string
  platform: string
  status: ApplicationStatus
  appliedDate: string
  location?: string
  url?: string
  salary?: string
  comments?: CommentItem[]
  notes?: NoteItem[]
}

/**
 * Datos del formulario usados por el offcanvas para crear o actualizar una aplicación.
 * Los comentarios y notas se gestionan aparte desde el panel de detalle.
 */
export interface EmploymentApplicationDraft {
  company: string
  position: string
  platform: string
  status: ApplicationStatus
  appliedDate: string
  location: string
  url: string
  salary: string
}
