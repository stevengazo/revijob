import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { CVDraft, CVExperienceItem, CVEducationItem, CVProjectItem } from '../types/cv'
import { cvService } from '../services/cvService'
import { downloadCvAsPdf, normalizeUrl } from '../utils/cvPdf'

const emptyExperience = (): CVExperienceItem => ({
  role: '',
  company: '',
  period: '',
  description: '',
})

const emptyEducation = (): CVEducationItem => ({
  degree: '',
  institution: '',
  period: '',
  details: '',
})

const emptyProject = (): CVProjectItem => ({
  name: '',
  period: '',
  link: '',
  description: '',
})

export default function CVPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState(() => cvService.get())
  const [draft, setDraft] = useState<CVDraft>(() => {
    const stored = cvService.get()
    return {
      fullName: stored.personal.fullName,
      headline: stored.personal.headline,
      email: stored.personal.email,
      phone: stored.personal.phone,
      location: stored.personal.location,
      website: stored.personal.website ?? '',
      linkedin: stored.personal.linkedin ?? '',
      x: stored.personal.x ?? '',
      summary: stored.summary,
      skills: stored.skills.join(', '),
      competencies: (stored.competencies ?? []).join(', '),
      experience: stored.experience.length ? stored.experience : [emptyExperience()],
      education: stored.education.length ? stored.education : [emptyEducation()],
      projects: stored.projects?.length ? stored.projects : [emptyProject()],
    }
  })
  const [savedAt, setSavedAt] = useState('')

  useEffect(() => {
    const saved = cvService.save(draft)
    setPreview(saved)
    setSavedAt(new Date(saved.updatedAt).toLocaleString())
  }, [draft])

  const updateDraft = <K extends keyof CVDraft>(field: K, value: CVDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const updateExperience = (index: number, field: keyof CVExperienceItem, value: string) => {
    setDraft((prev) => {
      const next = [...prev.experience]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, experience: next }
    })
  }

  const updateEducation = (index: number, field: keyof CVEducationItem, value: string) => {
    setDraft((prev) => {
      const next = [...prev.education]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, education: next }
    })
  }

  const updateProject = (index: number, field: keyof CVProjectItem, value: string) => {
    setDraft((prev) => {
      const next = [...prev.projects]
      next[index] = { ...next[index], [field]: value }
      return { ...prev, projects: next }
    })
  }

  const addExperience = () => setDraft((prev) => ({ ...prev, experience: [...prev.experience, emptyExperience()] }))
  const addEducation = () => setDraft((prev) => ({ ...prev, education: [...prev.education, emptyEducation()] }))
  const addProject = () => setDraft((prev) => ({ ...prev, projects: [...prev.projects, emptyProject()] }))

  const removeExperience = (index: number) =>
    setDraft((prev) => {
      const next = prev.experience.filter((_, i) => i !== index)
      return { ...prev, experience: next.length ? next : [emptyExperience()] }
    })

  const removeEducation = (index: number) =>
    setDraft((prev) => {
      const next = prev.education.filter((_, i) => i !== index)
      return { ...prev, education: next.length ? next : [emptyEducation()] }
    })

  const removeProject = (index: number) =>
    setDraft((prev) => {
      const next = prev.projects.filter((_, i) => i !== index)
      return { ...prev, projects: next.length ? next : [emptyProject()] }
    })

  const handleDownloadPdf = () => downloadCvAsPdf(preview)

  const handlePdfUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const updated = await cvService.uploadPdf(file)
      setPreview(updated)
      setSavedAt(new Date(updated.updatedAt).toLocaleString())
    } catch (error) {
      console.error(error)
      alert('No se pudo adjuntar el PDF.')
    } finally {
      event.target.value = ''
    }
  }

  const handleClearPdf = () => {
    const updated = cvService.clearPdf()
    setPreview(updated)
    setSavedAt(new Date(updated.updatedAt).toLocaleString())
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl lg:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">CV dinámico</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">Editor y vista previa de tu documento</h1>
            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-200">Crea, ajusta y guarda tu CV en localStorage mientras visualizas el resultado final en tiempo real.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-100">Guardado: {savedAt || 'sin cambios aún'}</div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-700 hover:to-sky-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
                <path d="M3.5 13a.75.75 0 0 1 .75.75v1.5c0 .14.11.25.25.25h11a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 15.5 17h-11A1.75 1.75 0 0 1 2.75 15.25v-1.5A.75.75 0 0 1 3.5 13Z" />
              </svg>
              Descargar PDF
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
                Nombre completo
                <input value={draft.fullName} onChange={(e) => updateDraft('fullName', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
                Titular
                <input value={draft.headline} onChange={(e) => updateDraft('headline', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
                Email
                <input value={draft.email} onChange={(e) => updateDraft('email', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
                Teléfono
                <input value={draft.phone} onChange={(e) => updateDraft('phone', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100 md:col-span-2">
                Ubicación
                <input value={draft.location} onChange={(e) => updateDraft('location', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
                Sitio web
                <input value={draft.website} onChange={(e) => updateDraft('website', e.target.value)} placeholder="https://tusitio.com" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
                LinkedIn
                <input value={draft.linkedin} onChange={(e) => updateDraft('linkedin', e.target.value)} placeholder="https://linkedin.com/in/usuario" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
              <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100 md:col-span-2">
                X (Twitter)
                <input value={draft.x} onChange={(e) => updateDraft('x', e.target.value)} placeholder="https://x.com/usuario" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
              </label>
            </div>

            <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
              Resumen profesional
              <textarea value={draft.summary} onChange={(e) => updateDraft('summary', e.target.value)} rows={4} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
            </label>

            <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
              Habilidades (separadas por coma)
              <input value={draft.skills} onChange={(e) => updateDraft('skills', e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
            </label>

            <label className="grid gap-1 text-sm text-slate-700 dark:text-slate-100">
              Competencias (separadas por coma)
              <input value={draft.competencies} onChange={(e) => updateDraft('competencies', e.target.value)} placeholder="Trabajo en equipo, Liderazgo, Comunicación" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10" />
            </label>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Experiencia</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Añade o edita bloques de trayectoria profesional.</p>
                </div>
                <button type="button" onClick={addExperience} className="rounded-full bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700">+ Añadir</button>
              </div>
              <div className="space-y-3">
                {draft.experience.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Bloque {index + 1}</span>
                      <button type="button" onClick={() => removeExperience(index)} className="rounded-full px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={item.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} placeholder="Cargo" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <input value={item.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} placeholder="Empresa" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <input value={item.period} onChange={(e) => updateExperience(index, 'period', e.target.value)} placeholder="Periodo" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <textarea value={item.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} placeholder="Descripción" rows={3} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2 dark:border-white/10 dark:bg-slate-950" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Educación</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Incluye títulos, certificaciones y formación.</p>
                </div>
                <button type="button" onClick={addEducation} className="rounded-full bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-600/25 hover:bg-sky-700">+ Añadir</button>
              </div>
              <div className="space-y-3">
                {draft.education.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Bloque {index + 1}</span>
                      <button type="button" onClick={() => removeEducation(index)} className="rounded-full px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={item.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Título" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <input value={item.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="Institución" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <input value={item.period} onChange={(e) => updateEducation(index, 'period', e.target.value)} placeholder="Periodo" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <textarea value={item.details} onChange={(e) => updateEducation(index, 'details', e.target.value)} placeholder="Detalles" rows={3} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2 dark:border-white/10 dark:bg-slate-950" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Proyectos</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Destaca trabajos relevantes con su enlace.</p>
                </div>
                <button type="button" onClick={addProject} className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700">+ Añadir</button>
              </div>
              <div className="space-y-3">
                {draft.projects.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Bloque {index + 1}</span>
                      <button type="button" onClick={() => removeProject(index)} className="rounded-full px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={item.name} onChange={(e) => updateProject(index, 'name', e.target.value)} placeholder="Nombre del proyecto" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <input value={item.period} onChange={(e) => updateProject(index, 'period', e.target.value)} placeholder="Periodo" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" />
                      <input value={item.link} onChange={(e) => updateProject(index, 'link', e.target.value)} placeholder="Enlace (https://...)" className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2 dark:border-white/10 dark:bg-slate-950" />
                      <textarea value={item.description} onChange={(e) => updateProject(index, 'description', e.target.value)} placeholder="Descripción" rows={3} className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm md:col-span-2 dark:border-white/10 dark:bg-slate-950" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-2xl dark:shadow-black/30">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Vista previa</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Documento final</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 dark:border-violet-400/30 dark:bg-white/6 dark:text-violet-100 dark:hover:bg-white/10"
                  >
                    Descargar PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-600 hover:to-sky-600"
                  >
                    Adjuntar PDF
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
              </div>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{preview.personal.fullName || 'Tu nombre'}</h3>
                    <p className="text-sm text-violet-600 dark:text-violet-200">{preview.personal.headline || 'Tu titular profesional'}</p>
                  </div>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-100">LocalStorage</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{preview.summary}</p>
                <dl className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-200">
                  <dt className="font-semibold text-slate-900 dark:text-white">Contacto</dt>
                  <dd>{preview.personal.email} · {preview.personal.phone}</dd>
                  <dd>{preview.personal.location}</dd>
                </dl>
                <div className="mt-3 flex flex-wrap gap-2">
                  {preview.personal.website ? (
                    <a href={normalizeUrl(preview.personal.website)} target="_blank" rel="noreferrer" className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/15">Sitio web</a>
                  ) : null}
                  {preview.personal.linkedin ? (
                    <a href={normalizeUrl(preview.personal.linkedin)} target="_blank" rel="noreferrer" className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-200 dark:bg-sky-500/15 dark:text-sky-100 dark:hover:bg-sky-500/25">LinkedIn</a>
                  ) : null}
                  {preview.personal.x ? (
                    <a href={normalizeUrl(preview.personal.x)} target="_blank" rel="noreferrer" className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">X</a>
                  ) : null}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {preview.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-400/10 dark:text-violet-100">{skill}</span>
                  ))}
                </div>
                {preview.competencies?.length ? (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Competencias</p>
                    <div className="flex flex-wrap gap-2">
                      {preview.competencies.map((item) => (
                        <span key={item} className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-100">{item}</span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 space-y-4">
                <article className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Experiencia</h3>
                  <div className="mt-3 space-y-3">
                    {preview.experience.map((item) => (
                      <div key={`${item.company}-${item.role}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.role || 'Cargo'}</p>
                        <p className="text-xs text-violet-600 dark:text-violet-200">{item.company || 'Empresa'} · {item.period || 'Periodo'}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{item.description || 'Descripción breve de tu experiencia.'}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Educación</h3>
                  <div className="mt-3 space-y-3">
                    {preview.education.map((item) => (
                      <div key={`${item.degree}-${item.institution}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.degree || 'Título'}</p>
                        <p className="text-xs text-violet-600 dark:text-violet-200">{item.institution || 'Institución'} · {item.period || 'Periodo'}</p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{item.details || 'Detalles de tu formación.'}</p>
                      </div>
                    ))}
                  </div>
                </article>

                {preview.projects?.some((item) => item.name || item.description) ? (
                  <article className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Proyectos</h3>
                    <div className="mt-3 space-y-3">
                      {preview.projects.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
                          <div className="flex items-baseline justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name || 'Proyecto'}</p>
                            {item.period ? <span className="text-xs text-violet-600 dark:text-violet-200">{item.period}</span> : null}
                          </div>
                          {item.link ? (
                            <a href={normalizeUrl(item.link)} target="_blank" rel="noreferrer" className="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-300">{item.link}</a>
                          ) : null}
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{item.description || 'Descripción del proyecto.'}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ) : null}
              </div>
            </motion.div>

            <AnimatePresence>
              {preview.pdfDataUrl ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-2xl dark:shadow-black/30">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">PDF adjunto</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{preview.pdfName || 'Documento PDF'}</h3>
                    </div>
                    <button type="button" onClick={handleClearPdf} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10">Eliminar</button>
                  </div>
                  <iframe title="Vista previa PDF" src={preview.pdfDataUrl} className="mt-4 h-[360px] w-full rounded-2xl border border-slate-200 bg-white dark:border-white/10" />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
