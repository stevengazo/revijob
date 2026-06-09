import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { CVDocument, CVDraft, CVExperienceItem, CVEducationItem, CVProjectItem, CVVersion } from '../types/cv'
import { cvService } from '../services/cvService'
import { downloadCvAsPdf, normalizeUrl } from '../utils/cvPdf'

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:border-violet-400/60 dark:focus:ring-violet-400/10'
const subInputClass =
  'w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-400 dark:border-white/10 dark:bg-slate-950'
const labelClass = 'grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-100'

const TABS = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'resumen', label: 'Resumen' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'educacion', label: 'Educación' },
  { id: 'proyectos', label: 'Proyectos' },
] as const

type TabId = (typeof TABS)[number]['id']

const emptyExperience = (): CVExperienceItem => ({ role: '', company: '', period: '', description: '' })
const emptyEducation = (): CVEducationItem => ({ degree: '', institution: '', period: '', details: '' })
const emptyProject = (): CVProjectItem => ({ name: '', period: '', link: '', description: '' })

const documentToDraft = (doc: CVDocument): CVDraft => ({
  fullName: doc.personal.fullName,
  headline: doc.personal.headline,
  email: doc.personal.email,
  phone: doc.personal.phone,
  location: doc.personal.location,
  website: doc.personal.website ?? '',
  linkedin: doc.personal.linkedin ?? '',
  x: doc.personal.x ?? '',
  summary: doc.summary,
  skills: doc.skills.join(', '),
  competencies: (doc.competencies ?? []).join(', '),
  experience: doc.experience.length ? doc.experience : [emptyExperience()],
  education: doc.education.length ? doc.education : [emptyEducation()],
  projects: doc.projects?.length ? doc.projects : [emptyProject()],
})

export default function CVPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [preview, setPreview] = useState(() => cvService.get())
  const [draft, setDraft] = useState<CVDraft>(() => documentToDraft(cvService.get()))
  const [savedAt, setSavedAt] = useState('')
  const [versions, setVersions] = useState<CVVersion[]>(() => cvService.listVersions())
  const [activeTab, setActiveTab] = useState<TabId>('perfil')
  const [showVersions, setShowVersions] = useState(false)

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

  const handleSaveVersion = () => {
    const label = window.prompt('Nombre de la versión (opcional):', '')
    if (label === null) return
    cvService.saveVersion(label)
    setVersions(cvService.listVersions())
    setShowVersions(true)
  }

  const handleRestoreVersion = (version: CVVersion) => {
    if (!window.confirm(`¿Restaurar "${version.label}"? Se reemplazará el CV actual.`)) return
    const restored = cvService.restoreVersion(version.id)
    if (!restored) return
    setDraft(documentToDraft(restored))
    setPreview(restored)
    setSavedAt(new Date(restored.updatedAt).toLocaleString())
  }

  const handleDeleteVersion = (version: CVVersion) => {
    if (!window.confirm(`¿Eliminar la versión "${version.label}"?`)) return
    setVersions(cvService.deleteVersion(version.id))
  }

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

  const tabCount: Record<TabId, number | null> = {
    perfil: null,
    resumen: null,
    experiencia: draft.experience.length,
    educacion: draft.education.length,
    proyectos: draft.projects.length,
  }

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* ---------- Cabecera ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl"
      >
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">CV dinámico</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Editor de currículum</h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
            Guardado automático · {savedAt || 'sin cambios aún'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowVersions((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10"
          >
            Versiones
            {versions.length > 0 ? (
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-100">{versions.length}</span>
            ) : null}
          </button>
          <button
            type="button"
            onClick={handleSaveVersion}
            className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:bg-violet-50 dark:border-violet-400/30 dark:bg-white/6 dark:text-violet-100 dark:hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M3 4.75A2.75 2.75 0 0 1 5.75 2h6.69a2.75 2.75 0 0 1 1.94.8l1.82 1.82c.52.51.8 1.21.8 1.94v8.69A2.75 2.75 0 0 1 14.25 18H5.75A2.75 2.75 0 0 1 3 15.25V4.75Zm3.5-1.25v3a.75.75 0 0 0 .75.75h4a.75.75 0 0 0 .75-.75v-3H6.5Zm3.5 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
            </svg>
            Guardar versión
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-700 hover:to-sky-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M10 3a.75.75 0 0 1 .75.75v6.69l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V3.75A.75.75 0 0 1 10 3Z" clipRule="evenodd" />
              <path d="M3.5 13a.75.75 0 0 1 .75.75v1.5c0 .14.11.25.25.25h11a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 15.5 17h-11A1.75 1.75 0 0 1 2.75 15.25v-1.5A.75.75 0 0 1 3.5 13Z" />
            </svg>
            Descargar PDF
          </button>
        </div>
      </motion.div>

      {/* ---------- Panel de versiones (plegable) ---------- */}
      <AnimatePresence>
        {showVersions ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-2xl dark:shadow-black/30">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Versiones guardadas</h2>
                <button type="button" onClick={() => setShowVersions(false)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10">Cerrar</button>
              </div>
              {versions.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                  Aún no hay versiones. Pulsa “Guardar versión” para crear la primera.
                </p>
              ) : (
                <ul className="grid gap-2 sm:grid-cols-2">
                  <AnimatePresence initial={false}>
                    {versions.map((version) => (
                      <motion.li
                        key={version.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/70"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{version.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-300">{new Date(version.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button type="button" onClick={() => handleRestoreVersion(version)} className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-200 dark:bg-violet-500/15 dark:text-violet-100 dark:hover:bg-violet-500/25">Restaurar</button>
                          <button type="button" onClick={() => handleDeleteVersion(version)} className="rounded-full px-2.5 py-1.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ---------- Editor + Vista previa ---------- */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        {/* Editor con pestañas */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-2xl dark:shadow-black/30">
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-3 dark:border-white/10">
            {TABS.map((tab) => {
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    active
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                  {tabCount[tab.id] !== null ? (
                    <span className={`rounded-full px-1.5 text-xs font-semibold ${active ? 'bg-white/25' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-200'}`}>{tabCount[tab.id]}</span>
                  ) : null}
                </button>
              )
            })}
          </div>

          <div className="pt-5">
            {activeTab === 'perfil' ? (
              <div className="grid gap-4 md:grid-cols-2">
                <label className={labelClass}>Nombre completo
                  <input value={draft.fullName} onChange={(e) => updateDraft('fullName', e.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Titular
                  <input value={draft.headline} onChange={(e) => updateDraft('headline', e.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Email
                  <input value={draft.email} onChange={(e) => updateDraft('email', e.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Teléfono
                  <input value={draft.phone} onChange={(e) => updateDraft('phone', e.target.value)} className={inputClass} />
                </label>
                <label className={`${labelClass} md:col-span-2`}>Ubicación
                  <input value={draft.location} onChange={(e) => updateDraft('location', e.target.value)} className={inputClass} />
                </label>
                <label className={labelClass}>Sitio web
                  <input value={draft.website} onChange={(e) => updateDraft('website', e.target.value)} placeholder="https://tusitio.com" className={inputClass} />
                </label>
                <label className={labelClass}>LinkedIn
                  <input value={draft.linkedin} onChange={(e) => updateDraft('linkedin', e.target.value)} placeholder="https://linkedin.com/in/usuario" className={inputClass} />
                </label>
                <label className={`${labelClass} md:col-span-2`}>X (Twitter)
                  <input value={draft.x} onChange={(e) => updateDraft('x', e.target.value)} placeholder="https://x.com/usuario" className={inputClass} />
                </label>
              </div>
            ) : null}

            {activeTab === 'resumen' ? (
              <div className="grid gap-4">
                <label className={labelClass}>Resumen profesional
                  <textarea value={draft.summary} onChange={(e) => updateDraft('summary', e.target.value)} rows={5} className={inputClass} />
                </label>
                <label className={labelClass}>Habilidades <span className="font-normal text-slate-400">(separadas por coma)</span>
                  <input value={draft.skills} onChange={(e) => updateDraft('skills', e.target.value)} placeholder="React, TypeScript, UX" className={inputClass} />
                </label>
                <label className={labelClass}>Competencias <span className="font-normal text-slate-400">(separadas por coma)</span>
                  <input value={draft.competencies} onChange={(e) => updateDraft('competencies', e.target.value)} placeholder="Trabajo en equipo, Liderazgo" className={inputClass} />
                </label>
              </div>
            ) : null}

            {activeTab === 'experiencia' ? (
              <div className="space-y-3">
                {draft.experience.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/70">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Experiencia {index + 1}</span>
                      <button type="button" onClick={() => removeExperience(index)} className="rounded-full px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={item.role} onChange={(e) => updateExperience(index, 'role', e.target.value)} placeholder="Cargo" className={subInputClass} />
                      <input value={item.company} onChange={(e) => updateExperience(index, 'company', e.target.value)} placeholder="Empresa" className={subInputClass} />
                      <input value={item.period} onChange={(e) => updateExperience(index, 'period', e.target.value)} placeholder="Periodo" className={`${subInputClass} md:col-span-2`} />
                      <textarea value={item.description} onChange={(e) => updateExperience(index, 'description', e.target.value)} placeholder="Descripción" rows={3} className={`${subInputClass} md:col-span-2`} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addExperience} className="w-full rounded-2xl border border-dashed border-violet-300 bg-violet-50/50 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 dark:border-violet-400/30 dark:bg-violet-500/5 dark:text-violet-200 dark:hover:bg-violet-500/10">+ Añadir experiencia</button>
              </div>
            ) : null}

            {activeTab === 'educacion' ? (
              <div className="space-y-3">
                {draft.education.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/70">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Formación {index + 1}</span>
                      <button type="button" onClick={() => removeEducation(index)} className="rounded-full px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={item.degree} onChange={(e) => updateEducation(index, 'degree', e.target.value)} placeholder="Título" className={subInputClass} />
                      <input value={item.institution} onChange={(e) => updateEducation(index, 'institution', e.target.value)} placeholder="Institución" className={subInputClass} />
                      <input value={item.period} onChange={(e) => updateEducation(index, 'period', e.target.value)} placeholder="Periodo" className={`${subInputClass} md:col-span-2`} />
                      <textarea value={item.details} onChange={(e) => updateEducation(index, 'details', e.target.value)} placeholder="Detalles" rows={3} className={`${subInputClass} md:col-span-2`} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addEducation} className="w-full rounded-2xl border border-dashed border-sky-300 bg-sky-50/50 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 dark:border-sky-400/30 dark:bg-sky-500/5 dark:text-sky-200 dark:hover:bg-sky-500/10">+ Añadir formación</button>
              </div>
            ) : null}

            {activeTab === 'proyectos' ? (
              <div className="space-y-3">
                {draft.projects.map((item, index) => (
                  <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/70">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">Proyecto {index + 1}</span>
                      <button type="button" onClick={() => removeProject(index)} className="rounded-full px-2 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10">Eliminar</button>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <input value={item.name} onChange={(e) => updateProject(index, 'name', e.target.value)} placeholder="Nombre del proyecto" className={subInputClass} />
                      <input value={item.period} onChange={(e) => updateProject(index, 'period', e.target.value)} placeholder="Periodo" className={subInputClass} />
                      <input value={item.link} onChange={(e) => updateProject(index, 'link', e.target.value)} placeholder="Enlace (https://...)" className={`${subInputClass} md:col-span-2`} />
                      <textarea value={item.description} onChange={(e) => updateProject(index, 'description', e.target.value)} placeholder="Descripción" rows={3} className={`${subInputClass} md:col-span-2`} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addProject} className="w-full rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/30 dark:bg-emerald-500/5 dark:text-emerald-200 dark:hover:bg-emerald-500/10">+ Añadir proyecto</button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Vista previa */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-2xl dark:shadow-black/30">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Vista previa</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Documento final</h2>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/6 dark:text-slate-100 dark:hover:bg-white/10"
              >
                Adjuntar PDF
              </button>
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
            </div>

            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">{preview.personal.fullName || 'Tu nombre'}</h3>
              <p className="text-sm text-violet-600 dark:text-violet-200">{preview.personal.headline || 'Tu titular profesional'}</p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-200">{preview.summary}</p>
              <dl className="mt-4 grid gap-1 text-sm text-slate-600 dark:text-slate-200">
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
                  {preview.experience.map((item, index) => (
                    <div key={`${item.company}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
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
                  {preview.education.map((item, index) => (
                    <div key={`${item.degree}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-900/80">
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
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-2xl dark:shadow-black/30">
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
    </section>
  )
}
