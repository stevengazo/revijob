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
}

const STORAGE_KEY = 'revijob-applications'

function createId(): string {
  return `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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
      notes: 'CV actualizado y carta enviada.',
      comments: [
        { id: 'c1', text: 'Enviar portfolio actualizado.', createdAt: '2026-06-01' },
      ],
      reminders: [
        { id: 'r1', text: 'Revisar feedback de entrevista', dueDate: '2026-06-12', done: false },
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
      notes: data.notes.trim() || undefined,
      comments: data.comments
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({ id: createId(), text, createdAt: new Date().toISOString().slice(0, 10) })),
      reminders: data.reminders
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({ id: createId(), text, done: false })),
    }

    const items = [...this.read(), record]
    this.write(items)
    return record
  }

  update(id: string, data: EmploymentApplicationDraft): EmploymentApplication | undefined {
    const items = this.read()
    const index = items.findIndex((item) => item.id === id)

    if (index === -1) {
      return undefined
    }

    items[index] = {
      ...items[index],
      company: data.company.trim(),
      position: data.position.trim(),
      platform: data.platform.trim(),
      status: data.status,
      appliedDate: data.appliedDate,
      location: data.location.trim() || undefined,
      url: data.url.trim() || undefined,
      salary: data.salary.trim() || undefined,
      notes: data.notes.trim() || undefined,
      comments: data.comments
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text, index) => ({
          id: items[index]?.comments?.[index]?.id ?? createId(),
          text,
          createdAt: items[index]?.comments?.[index]?.createdAt ?? new Date().toISOString().slice(0, 10),
        })),
      reminders: data.reminders
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text, index) => ({
          id: items[index]?.reminders?.[index]?.id ?? createId(),
          text,
          dueDate: items[index]?.reminders?.[index]?.dueDate,
          done: items[index]?.reminders?.[index]?.done ?? false,
        })),
    }

    this.write(items)
    return items[index]
  }

  remove(id: string): void {
    const items = this.read().filter((item) => item.id !== id)
    this.write(items)
  }
}

export const applicationService = new LocalStorageEmploymentApplicationService()
