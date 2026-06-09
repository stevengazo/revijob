import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { EmploymentApplication, EmploymentApplicationDraft } from '../types/application'
import { applicationService } from '../services/applicationService'

const emptyDraft: EmploymentApplicationDraft = {
  company: '',
  position: '',
  platform: '',
  status: 'Pendiente',
  appliedDate: new Date().toISOString().slice(0, 10),
  location: '',
  url: '',
  salary: '',
  notes: '',
  comments: [],
  reminders: [],
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<EmploymentApplication[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'calendar' | 'kanban' | 'table'>('calendar')
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState<EmploymentApplicationDraft>(emptyDraft)

  const refresh = () => setApplications(applicationService.list())

  useEffect(() => {
    refresh()
  }, [])

  const selectedApplication = useMemo(
    () => applications.find((item) => item.id === selectedId) ?? null,
    [applications, selectedId],
  )

  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) => a.appliedDate.localeCompare(b.appliedDate)),
    [applications],
  )

  const stages = ['Pendiente', 'En revisión', 'Entrevista', 'Rechazada', 'Aceptada'] as const

  const openCreate = () => {
    setMode('create')
    setSelectedId(null)
    setDraft(emptyDraft)
    setDrawerOpen(true)
  }

  const openEdit = (item: EmploymentApplication) => {
    setMode('edit')
    setSelectedId(item.id)
    setDraft({
      company: item.company,
      position: item.position,
      platform: item.platform,
      status: item.status,
      appliedDate: item.appliedDate,
      location: item.location ?? '',
      url: item.url ?? '',
      salary: item.salary ?? '',
      notes: item.notes ?? '',
      comments: (item.comments ?? []).map((entry) => entry.text),
      reminders: (item.reminders ?? []).map((entry) => entry.text),
    })
    setDrawerOpen(true)
  }

  const openView = (item: EmploymentApplication) => {
    setMode('view')
    setSelectedId(item.id)
    setDrawerOpen(true)
  }

  const save = () => {
    if (mode === 'edit' && selectedId) {
      applicationService.update(selectedId, draft)
    } else {
      applicationService.create(draft)
    }

    refresh()
    setDrawerOpen(false)
  }

  const remove = (id: string) => {
    applicationService.remove(id)
    refresh()
    if (selectedId === id) {
      setDrawerOpen(false)
      setSelectedId(null)
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-8"
      >
        <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">Aplicaciones</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold text-white">Registro y control de aplicaciones</h1>
            <p className="mt-3 max-w-3xl text-slate-200">Administra tus postulaciones, actualiza estados y guarda observaciones en un CRUD básico con almacenamiento local.</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/20"
          >
            + Nueva aplicación
          </button>
        </div>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <article className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-sm text-slate-300">Total</p>
          <p className="mt-2 text-3xl font-semibold text-white">{applications.length}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-sm text-slate-300">En revisión</p>
          <p className="mt-2 text-3xl font-semibold text-white">{applications.filter((a) => a.status === 'En revisión').length}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="text-sm text-slate-300">Entrevistas</p>
          <p className="mt-2 text-3xl font-semibold text-white">{applications.filter((a) => a.status === 'Entrevista').length}</p>
        </article>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="rounded-[32px] border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">Vistas</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Explora tus postulaciones por contexto</h2>
          </div>
          <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-slate-950/85 p-1 shadow-lg shadow-black/20">
            {[
              ['calendar', 'Calendario'],
              ['kanban', 'Kanban'],
              ['table', 'Tabla'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setViewMode(key as 'calendar' | 'kanban' | 'table')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  viewMode === key ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/20' : 'text-slate-300 hover:bg-white/6 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {viewMode === 'calendar' && (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from(new Set(sortedApplications.map((item) => item.appliedDate))).map((date) => (
              <article key={date} className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-xl shadow-black/20">
                <p className="text-sm text-violet-200">{new Date(date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' })}</p>
                <div className="mt-3 space-y-3">
                  {sortedApplications.filter((item) => item.appliedDate === date).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-slate-100">
                      <p className="text-sm font-semibold text-white">{item.position}</p>
                      <p className="text-xs text-slate-300">{item.company} · {item.platform}</p>
                      <p className="mt-1 text-xs text-violet-100">{item.status}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {viewMode === 'kanban' && (
          <div className="mt-5 grid gap-4 xl:grid-cols-5">
            {stages.map((stage) => (
              <article key={stage} className="rounded-3xl border border-white/10 bg-slate-950/85 p-4 shadow-xl shadow-black/20">
                <p className="text-sm font-semibold text-white">{stage}</p>
                <p className="text-xs text-slate-400">{sortedApplications.filter((item) => item.status === stage).length} registros</p>
                <div className="mt-3 space-y-3">
                  {sortedApplications.filter((item) => item.status === stage).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-white/10 bg-white/6 p-3 text-slate-100">
                      <p className="text-sm font-semibold text-white">{item.position}</p>
                      <p className="text-xs text-slate-300">{item.company}</p>
                      <p className="mt-1 text-xs text-violet-100">{item.appliedDate}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button type="button" onClick={() => openView(item)} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-white">Ver</button>
                        <button type="button" onClick={() => openEdit(item)} className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-1.5 text-[11px] font-semibold text-white">Editar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="mt-5 overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/85 shadow-xl shadow-black/20">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-white/6 text-slate-100">
                <tr>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Puesto</th>
                  <th className="px-4 py-3">Plataforma</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedApplications.map((item) => (
                  <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{item.company}</td>
                    <td className="px-4 py-3">{item.position}</td>
                    <td className="px-4 py-3">{item.platform}</td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3">{item.appliedDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => openView(item)} className="rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 text-[11px] font-semibold text-white">Ver</button>
                        <button type="button" onClick={() => openEdit(item)} className="rounded-xl border border-white/10 bg-white/6 px-3 py-1.5 text-[11px] font-semibold text-white">Editar</button>
                        <button type="button" onClick={() => remove(item.id)} className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-100">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="h-full w-full max-w-xl border-l border-white/10 bg-slate-950 p-6 shadow-2xl shadow-black/40 lg:p-8"
            >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">{mode === 'create' ? 'Agregar' : mode === 'edit' ? 'Editar' : 'Detalle'}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{mode === 'create' ? 'Nueva aplicación' : selectedApplication?.company}</h2>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-sm text-white">Cerrar</button>
            </div>

            {mode === 'view' && selectedApplication ? (
              <div className="mt-6 space-y-4 text-slate-200">
                <p><strong>Empresa:</strong> {selectedApplication.company}</p>
                <p><strong>Puesto:</strong> {selectedApplication.position}</p>
                <p><strong>Plataforma:</strong> {selectedApplication.platform}</p>
                <p><strong>Estado:</strong> {selectedApplication.status}</p>
                <p><strong>Fecha:</strong> {selectedApplication.appliedDate}</p>
                {selectedApplication.location ? <p><strong>Ubicación:</strong> {selectedApplication.location}</p> : null}
                {selectedApplication.salary ? <p><strong>Salario:</strong> {selectedApplication.salary}</p> : null}
                {selectedApplication.url ? <p><strong>URL:</strong> <a href={selectedApplication.url} target="_blank" rel="noreferrer" className="text-violet-200 underline">{selectedApplication.url}</a></p> : null}
                {selectedApplication.notes ? <p><strong>Notas:</strong> {selectedApplication.notes}</p> : null}
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold text-white">Comentarios</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-200">
                    {(selectedApplication.comments ?? []).map((item) => <li key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-2">{item.text}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-sm font-semibold text-white">Recordatorios</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-200">
                    {(selectedApplication.reminders ?? []).map((item) => <li key={item.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-2">{item.text}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 text-slate-100">
                <label className="grid gap-2 text-sm font-semibold">Empresa
                  <input value={draft.company} onChange={(e) => setDraft((prev) => ({ ...prev, company: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Puesto
                  <input value={draft.position} onChange={(e) => setDraft((prev) => ({ ...prev, position: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Plataforma
                  <input value={draft.platform} onChange={(e) => setDraft((prev) => ({ ...prev, platform: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Estado
                  <select value={draft.status} onChange={(e) => setDraft((prev) => ({ ...prev, status: e.target.value as EmploymentApplication['status'] }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100">
                    {['Pendiente','En revisión','Entrevista','Rechazada','Aceptada'].map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">Fecha de postulación
                  <input type="date" value={draft.appliedDate} onChange={(e) => setDraft((prev) => ({ ...prev, appliedDate: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Ubicación
                  <input value={draft.location} onChange={(e) => setDraft((prev) => ({ ...prev, location: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">URL
                  <input value={draft.url} onChange={(e) => setDraft((prev) => ({ ...prev, url: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Salario
                  <input value={draft.salary} onChange={(e) => setDraft((prev) => ({ ...prev, salary: e.target.value }))} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Notas
                  <textarea value={draft.notes} onChange={(e) => setDraft((prev) => ({ ...prev, notes: e.target.value }))} rows={4} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Comentarios (una línea por comentario)
                  <textarea value={draft.comments.join('\n')} onChange={(e) => setDraft((prev) => ({ ...prev, comments: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) }))} rows={3} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
                <label className="grid gap-2 text-sm font-semibold">Recordatorios (uno por línea)
                  <textarea value={draft.reminders.join('\n')} onChange={(e) => setDraft((prev) => ({ ...prev, reminders: e.target.value.split('\n').map((line) => line.trim()).filter(Boolean) }))} rows={3} className="rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100" />
                </label>
              </div>
            )}

            {mode !== 'view' && (
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={save} className="rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/20">Guardar</button>
                <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-white">Cancelar</button>
              </div>
            )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
