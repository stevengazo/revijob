export interface CVExperienceItem {
  role: string
  company: string
  period: string
  description: string
}

export interface CVEducationItem {
  degree: string
  institution: string
  period: string
  details: string
}

export interface CVProjectItem {
  name: string
  period: string
  link: string
  description: string
}

export interface CVDocument {
  id: string
  personal: {
    fullName: string
    headline: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    x: string
  }
  summary: string
  skills: string[]
  competencies: string[]
  experience: CVExperienceItem[]
  education: CVEducationItem[]
  projects: CVProjectItem[]
  pdfDataUrl?: string
  pdfName?: string
  updatedAt: string
}

export interface CVVersion {
  id: string
  label: string
  createdAt: string
  document: CVDocument
}

export interface CVDraft {
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  website: string
  linkedin: string
  x: string
  summary: string
  skills: string
  competencies: string
  experience: CVExperienceItem[]
  education: CVEducationItem[]
  projects: CVProjectItem[]
}
