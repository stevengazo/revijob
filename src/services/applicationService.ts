import type { EmploymentApplication, EmploymentApplicationDraft } from '../types/application'

/**
 * Contrato de servicio para gestionar aplicaciones de empleo.
 * Actualmente se implementa con localStorage para permitir desarrollo rápido.
 * Posteriormente puede sustituirse por Supabase, REST o una API.
 */
export interface EmploymentApplicationService {
  list(): EmploymentApplication[]
  getById(id: string): EmploymentApplication | undefined
  create(data: EmploymentApplicationDraft): EmploymentApplication
  update(id: string, data: EmploymentApplicationDraft): EmploymentApplication | undefined
  remove(id: string): void
  addComment(id: string, text: string): EmploymentApplication | undefined
  removeComment(id: string, commentId: string): EmploymentApplication | undefined
  addNote(id: string, text: string): EmploymentApplication | undefined
  removeNote(id: string, noteId: string): EmploymentApplication | undefined
}

const STORAGE_KEY = 'revijob-applications'

function createId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** Fecha local en formato 'YYYY-MM-DD' para sellar comentarios y notas. */
function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function seedData(): EmploymentApplication[] {
  return [
    {
      id: 'app-demo-1',
      company: 'Acme Labs',
      position: 'Frontend Developer',
      platform: 'LinkedIn',
      status: 'En revisión',
      appliedDate: '2026-06-01',
      location: 'Remoto',
      salary: '$1,800',
      comments: [
        { id: 'c1', text: 'Enviar portfolio actualizado.', createdAt: '2026-06-01' },
      ],
      notes: [
        { id: 'n1', text: 'CV actualizado y carta enviada.', createdAt: '2026-06-01' },
      ],
    },
  ]
}

/**
 * Implementación localStorage del servicio de aplicaciones.
 */
export class LocalStorageEmploymentApplicationService implements EmploymentApplicationService {
  private readonly storageKey = STORAGE_KEY

  private read(): EmploymentApplication[] {
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) {
      const initial = seedData()
      localStorage.setItem(this.storageKey, JSON.stringify(initial))
      return initial
    }

    try {
      return JSON.parse(raw) as EmploymentApplication[]
    } catch {
      const fallback = seedData()
      localStorage.setItem(this.storageKey, JSON.stringify(fallback))
      return fallback
    }
  }

  private write(items: EmploymentApplication[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items))
  }

  list(): EmploymentApplication[] {
    return this.read()
  }

  getById(id: string): EmploymentApplication | undefined {
    return this.read().find((item) => item.id === id)
  }

  create(data: EmploymentApplicationDraft): EmploymentApplication {
    const record: EmploymentApplication = {
      id: createId(),
      company: data.company.trim(),
      position: data.position.trim(),
      platform: data.platform.trim(),
      status: data.status,
      appliedDate: data.appliedDate,
      location: data.location.trim() || undefined,
      url: data.url.trim() || undefined,
      salary: data.salary.trim() || undefined,
      comments: [],
      notes: [],
    }

    const items = [...this.read(), record]
    this.write(items)
    return record
  }

  update(id: string, data: EmploymentApplicationDraft): EmploymentApplication | undefined {
    return this.mutate(id, (current) => ({
      ...current,
      company: data.company.trim(),
      position: data.position.trim(),
      platform: data.platform.trim(),
      status: data.status,
      appliedDate: data.appliedDate,
      location: data.location.trim() || undefined,
      url: data.url.trim() || undefined,
      salary: data.salary.trim() || undefined,
    }))
  }

  remove(id: string): void {
    const items = this.read().filter((item) => item.id !== id)
    this.write(items)
  }

  /** Aplica una transformación a una aplicación concreta y persiste el cambio. */
  private mutate(
    id: string,
    transform: (current: EmploymentApplication) => EmploymentApplication,
  ): EmploymentApplication | undefined {
    const items = this.read()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) return undefined

    items[index] = transform(items[index])
    this.write(items)
    return items[index]
  }

  addComment(id: string, text: string): EmploymentApplication | undefined {
    const trimmed = text.trim()
    if (!trimmed) return this.getById(id)
    return this.mutate(id, (current) => ({
      ...current,
      comments: [...(current.comments ?? []), { id: createId(), text: trimmed, createdAt: today() }],
    }))
  }

  removeComment(id: string, commentId: string): EmploymentApplication | undefined {
    return this.mutate(id, (current) => ({
      ...current,
      comments: (current.comments ?? []).filter((comment) => comment.id !== commentId),
    }))
  }

  addNote(id: string, text: string): EmploymentApplication | undefined {
    const trimmed = text.trim()
    if (!trimmed) return this.getById(id)
    return this.mutate(id, (current) => ({
      ...current,
      notes: [...(Array.isArray(current.notes) ? current.notes : []), { id: createId(), text: trimmed, createdAt: today() }],
    }))
  }

  removeNote(id: string, noteId: string): EmploymentApplication | undefined {
    return this.mutate(id, (current) => ({
      ...current,
      notes: (Array.isArray(current.notes) ? current.notes : []).filter((note) => note.id !== noteId),
    }))
  }
}

export const applicationService = new LocalStorageEmploymentApplicationService()
