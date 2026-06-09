export type ApplicationStatus =
  | 'Pendiente'
  | 'En revisión'
  | 'Entrevista'
  | 'Rechazada'
  | 'Aceptada'

/**
 * Representa una aplicación de empleo registrada por el usuario.
 * Se usa como modelo base para crear, editar, listar y filtrar registros.
 */
export interface CommentItem {
  id: string
  text: string
  createdAt: string
}

export interface ReminderItem {
  id: string
  text: string
  dueDate?: string
  done: boolean
}

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
  notes?: string
  comments?: CommentItem[]
  reminders?: ReminderItem[]
}

/**
 * Datos del formulario usados por el offcanvas para crear o actualizar una aplicación.
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
  notes: string
  comments: string[]
  reminders: string[]
}
