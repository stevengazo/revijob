import type { CVDocument, CVDraft, CVVersion } from '../types/cv'

export interface CVService {
  get(): CVDocument
  save(data: CVDraft): CVDocument
  uploadPdf(file: File): Promise<CVDocument>
  clearPdf(): CVDocument
  listVersions(): CVVersion[]
  saveVersion(label?: string): CVVersion
  restoreVersion(id: string): CVDocument | null
  deleteVersion(id: string): CVVersion[]
  renameVersion(id: string, label: string): CVVersion[]
}

const STORAGE_KEY = 'revijob-cv'
const VERSIONS_KEY = 'revijob-cv-versions'
const MAX_VERSIONS = 30
const DEFAULT_ACCENT = '#7c3aed'

function createId(): string {
  return `cv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('No se pudo leer el archivo PDF.'))
    reader.readAsDataURL(file)
  })
}

function defaultDraft(): CVDraft {
  return {
    fullName: 'María López',
    headline: 'Diseñadora de experiencia de usuario',
    email: 'maria@revijob.dev',
    phone: '+34 600 123 456',
    location: 'Madrid, España',
    website: 'https://marialopez.dev',
    linkedin: 'https://linkedin.com/in/marialopez',
    x: 'https://x.com/marialopez',
    summary: 'Especialista en diseño visual, entrevistas y optimización de procesos para equipos de contratación.',
    skills: 'React, TypeScript, UX, Figma, Motion',
    competencies: 'Trabajo en equipo, Comunicación, Liderazgo, Pensamiento crítico, Gestión del tiempo',
    experience: [
      {
        role: 'Senior Product Designer',
        company: 'ReviJob',
        period: '2024 - Actualidad',
        description: 'Diseño flujos de candidatura, paneles de seguimiento y experiencias de onboarding.',
      },
      {
        role: 'UX Designer',
        company: 'TalentFlow Studio',
        period: '2021 - 2024',
        description: 'Creé prototipos, validé entrevistas y mejoré la tasa de conversión del pipeline.',
      },
    ],
    education: [
      {
        degree: 'Licenciatura en Diseño Digital',
        institution: 'Universidad de Madrid',
        period: '2017 - 2021',
        details: 'Especialización en interfaces y experiencia de usuario.',
      },
    ],
    projects: [
      {
        name: 'Sistema de diseño ReviJob',
        period: '2024',
        link: 'https://github.com/revijob/design-system',
        description: 'Librería de componentes accesibles y tokens de diseño usada por todo el producto.',
      },
    ],
    accentColor: DEFAULT_ACCENT,
  }
}

function seedData(): CVDocument {
  const draft = defaultDraft()
  return {
    id: createId(),
    personal: {
      fullName: draft.fullName,
      headline: draft.headline,
      email: draft.email,
      phone: draft.phone,
      location: draft.location,
      website: draft.website,
      linkedin: draft.linkedin,
      x: draft.x,
    },
    summary: draft.summary,
    skills: draft.skills.split(',').map((item) => item.trim()).filter(Boolean),
    competencies: draft.competencies.split(',').map((item) => item.trim()).filter(Boolean),
    experience: draft.experience,
    education: draft.education,
    projects: draft.projects,
    accentColor: draft.accentColor,
    updatedAt: new Date().toISOString(),
  }
}

class LocalStorageCVService implements CVService {
  private readonly storageKey = STORAGE_KEY

  private read(): CVDocument {
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) {
      const initial = seedData()
      localStorage.setItem(this.storageKey, JSON.stringify(initial))
      return initial
    }

    try {
      const parsed = JSON.parse(raw) as CVDocument
      // Compatibilidad con CVs guardados antes del color de énfasis.
      return { ...parsed, accentColor: parsed.accentColor || DEFAULT_ACCENT }
    } catch {
      const fallback = seedData()
      localStorage.setItem(this.storageKey, JSON.stringify(fallback))
      return fallback
    }
  }

  private write(item: CVDocument): void {
    localStorage.setItem(this.storageKey, JSON.stringify(item))
  }

  get(): CVDocument {
    return this.read()
  }

  save(data: CVDraft): CVDocument {
    const current = this.read()
    const next: CVDocument = {
      ...current,
      personal: {
        fullName: data.fullName.trim() || current.personal.fullName,
        headline: data.headline.trim() || current.personal.headline,
        email: data.email.trim() || current.personal.email,
        phone: data.phone.trim() || current.personal.phone,
        location: data.location.trim() || current.personal.location,
        website: data.website.trim(),
        linkedin: data.linkedin.trim(),
        x: data.x.trim(),
      },
      summary: data.summary.trim() || current.summary,
      skills: data.skills
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      competencies: data.competencies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      experience: data.experience.map((item) => ({
        role: item.role.trim(),
        company: item.company.trim(),
        period: item.period.trim(),
        description: item.description.trim(),
      })),
      education: data.education.map((item) => ({
        degree: item.degree.trim(),
        institution: item.institution.trim(),
        period: item.period.trim(),
        details: item.details.trim(),
      })),
      projects: data.projects.map((item) => ({
        name: item.name.trim(),
        period: item.period.trim(),
        link: item.link.trim(),
        description: item.description.trim(),
      })),
      accentColor: data.accentColor || current.accentColor || DEFAULT_ACCENT,
      updatedAt: new Date().toISOString(),
    }

    this.write(next)
    return next
  }

  async uploadPdf(file: File): Promise<CVDocument> {
    const dataUrl = await readFileAsDataUrl(file)
    const next: CVDocument = {
      ...this.read(),
      pdfDataUrl: dataUrl,
      pdfName: file.name,
      updatedAt: new Date().toISOString(),
    }

    this.write(next)
    return next
  }

  clearPdf(): CVDocument {
    const next = {
      ...this.read(),
      pdfDataUrl: undefined,
      pdfName: undefined,
      updatedAt: new Date().toISOString(),
    }
    this.write(next)
    return next
  }

  private readVersions(): CVVersion[] {
    const raw = localStorage.getItem(VERSIONS_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw) as CVVersion[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  private writeVersions(versions: CVVersion[]): void {
    localStorage.setItem(VERSIONS_KEY, JSON.stringify(versions))
  }

  listVersions(): CVVersion[] {
    return this.readVersions()
  }

  saveVersion(label?: string): CVVersion {
    const current = this.read()
    const now = new Date()
    const version: CVVersion = {
      id: `ver-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: label?.trim() || `Versión ${now.toLocaleString()}`,
      createdAt: now.toISOString(),
      // Copia profunda para que la versión no cambie al editar el CV actual.
      document: JSON.parse(JSON.stringify(current)) as CVDocument,
    }

    const versions = [version, ...this.readVersions()].slice(0, MAX_VERSIONS)
    this.writeVersions(versions)
    return version
  }

  restoreVersion(id: string): CVDocument | null {
    const version = this.readVersions().find((item) => item.id === id)
    if (!version) return null

    const restored: CVDocument = {
      ...JSON.parse(JSON.stringify(version.document)) as CVDocument,
      updatedAt: new Date().toISOString(),
    }
    this.write(restored)
    return restored
  }

  deleteVersion(id: string): CVVersion[] {
    const versions = this.readVersions().filter((item) => item.id !== id)
    this.writeVersions(versions)
    return versions
  }

  renameVersion(id: string, label: string): CVVersion[] {
    const versions = this.readVersions().map((item) =>
      item.id === id ? { ...item, label: label.trim() || item.label } : item,
    )
    this.writeVersions(versions)
    return versions
  }
}

export const cvService = new LocalStorageCVService()
