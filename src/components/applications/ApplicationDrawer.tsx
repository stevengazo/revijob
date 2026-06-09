import { motion, AnimatePresence } from 'framer-motion'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { APPLICATION_STATUSES } from '../../types/application'
import type { ApplicationStatus, EmploymentApplication, EmploymentApplicationDraft } from '../../types/application'
import { Eyebrow, Field, PrimaryButton, fieldClass } from '../ui'

export type DrawerMode = 'create' | 'edit' | 'view'

interface ApplicationDrawerProps {
  open: boolean
  mode: DrawerMode
  draft: EmploymentApplicationDraft
  setDraft: Dispatch<SetStateAction<EmploymentApplicationDraft>>
  selectedApplication: EmploymentApplication | null
  onSave: () => void
  onClose: () => void
}

const titles: Record<DrawerMode, string> = { create: 'Agregar', edit: 'Editar', view: 'Detalle' }

/** Convierte un textarea (una línea por entrada) en una lista de strings limpia. */
const toLines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean)

/** Panel lateral para crear, editar o ver el detalle de una postulación. */
export default function ApplicationDrawer({ open, mode, draft, setDraft, selectedApplication, onSave, onClose }: ApplicationDrawerProps) {
  const update = <K extends keyof EmploymentApplicationDraft>(key: K, value: EmploymentApplicationDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm dark:bg-slate-950/70"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            onClick={(event) => event.stopPropagation()}
            className="h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-950 dark:shadow-black/40 lg:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Eyebrow>{titles[mode]}</Eyebrow>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{mode === 'create' ? 'Nueva aplicación' : selectedApplication?.company}</h2>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/6 dark:text-white dark:hover:bg-white/10">Cerrar</button>
            </div>

            {mode === 'view' && selectedApplication ? (
              <ApplicationDetail application={selectedApplication} />
            ) : (
              <div className="mt-6 grid gap-4 text-slate-700 dark:text-slate-100">
                <Field label="Empresa">
                  <input value={draft.company} onChange={(e) => update('company', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Puesto">
                  <input value={draft.position} onChange={(e) => update('position', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Plataforma">
                  <input value={draft.platform} onChange={(e) => update('platform', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Estado">
                  <select value={draft.status} onChange={(e) => update('status', e.target.value as ApplicationStatus)} className={fieldClass}>
                    {APPLICATION_STATUSES.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
                <Field label="Fecha de postulación">
                  <input type="date" value={draft.appliedDate} onChange={(e) => update('appliedDate', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Ubicación">
                  <input value={draft.location} onChange={(e) => update('location', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="URL">
                  <input value={draft.url} onChange={(e) => update('url', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Salario">
                  <input value={draft.salary} onChange={(e) => update('salary', e.target.value)} className={fieldClass} />
                </Field>
                <Field label="Notas">
                  <textarea value={draft.notes} onChange={(e) => update('notes', e.target.value)} rows={4} className={fieldClass} />
                </Field>
                <Field label="Comentarios (una línea por comentario)">
                  <textarea value={draft.comments.join('\n')} onChange={(e) => update('comments', toLines(e.target.value))} rows={3} className={fieldClass} />
                </Field>
                <Field label="Recordatorios (uno por línea)">
                  <textarea value={draft.reminders.join('\n')} onChange={(e) => update('reminders', toLines(e.target.value))} rows={3} className={fieldClass} />
                </Field>
              </div>
            )}

            {mode !== 'view' && (
              <div className="mt-6 flex gap-3">
                <PrimaryButton type="button" onClick={onSave}>Guardar</PrimaryButton>
                <button type="button" onClick={onClose} className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:border-white/10 dark:bg-white/6 dark:text-white dark:hover:bg-white/10">Cancelar</button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const statusBadge: Record<ApplicationStatus, string> = {
  Pendiente: 'border-slate-300 bg-slate-100 text-slate-700 dark:border-white/15 dark:bg-white/10 dark:text-slate-100',
  'En revisión': 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/30 dark:bg-amber-500/10 dark:text-amber-200',
  Entrevista: 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200',
  Rechazada: 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/10 dark:text-rose-200',
  Aceptada: 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/10 dark:text-emerald-200',
}

/** Formatea 'YYYY-MM-DD' a una fecha legible en español. */
const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** Vista de solo lectura del detalle de una postulación. */
function ApplicationDetail({ application }: { application: EmploymentApplication }) {
  const comments = application.comments ?? []
  const reminders = application.reminders ?? []

  return (
    <div className="mt-6 space-y-5">
      {/* Resumen */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-50 to-sky-50 p-5 dark:border-white/10 dark:from-violet-500/10 dark:to-sky-500/10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge[application.status]}`}>{application.status}</span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-300">{formatDate(application.appliedDate)}</span>
        </div>
        <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{application.position || 'Sin puesto'}</h3>
        <p className="text-sm font-medium text-violet-600 dark:text-violet-200">{application.company || 'Sin empresa'}</p>
      </div>

      {/* Datos clave */}
      <div className="grid gap-3 sm:grid-cols-2">
        <MetaItem label="Plataforma" value={application.platform} icon={<IconBriefcase />} />
        <MetaItem label="Ubicación" value={application.location} icon={<IconPin />} />
        <MetaItem label="Salario" value={application.salary} icon={<IconCash />} />
        <MetaItem label="Fecha" value={formatDate(application.appliedDate)} icon={<IconCalendar />} />
      </div>

      {application.url ? (
        <a
          href={application.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-100 dark:hover:bg-violet-500/20"
        >
          <span className="truncate">{application.url}</span>
          <IconExternal />
        </a>
      ) : null}

      {application.notes ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">Notas</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">{application.notes}</p>
        </div>
      ) : null}

      <DetailList label="Comentarios" count={comments.length}>
        {comments.length === 0 ? (
          <EmptyHint>Sin comentarios.</EmptyHint>
        ) : (
          comments.map((entry) => (
            <li key={entry.id} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-200">
              <p>{entry.text}</p>
              {entry.createdAt ? <p className="mt-1 text-xs text-slate-400">{entry.createdAt}</p> : null}
            </li>
          ))
        )}
      </DetailList>

      <DetailList label="Recordatorios" count={reminders.length}>
        {reminders.length === 0 ? (
          <EmptyHint>Sin recordatorios.</EmptyHint>
        ) : (
          reminders.map((entry) => (
            <li key={entry.id} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900/70">
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[10px] ${entry.done ? 'border-emerald-400 bg-emerald-400 text-white' : 'border-slate-300 text-transparent dark:border-white/20'}`}>✓</span>
              <span className="flex-1">
                <span className={`${entry.done ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>{entry.text}</span>
                {entry.dueDate ? <span className="mt-0.5 block text-xs text-slate-400">Vence: {formatDate(entry.dueDate)}</span> : null}
              </span>
            </li>
          ))
        )}
      </DetailList>
    </div>
  )
}

function MetaItem({ label, value, icon }: { label: string; value?: string; icon: ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900/70">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-200">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
        <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-100">{value?.trim() || '—'}</p>
      </div>
    </div>
  )
}

function DetailList({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-200">{count}</span>
      </div>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  )
}

function EmptyHint({ children }: { children: ReactNode }) {
  return <li className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-400 dark:border-white/10">{children}</li>
}

const iconClass = 'h-4 w-4'
const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={iconClass}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" /></svg>
)
const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={iconClass}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
)
const IconCash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={iconClass}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></svg>
)
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={iconClass}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" /></svg>
)
const IconExternal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0"><path d="M14 5h5v5M19 5l-9 9M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
