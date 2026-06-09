import { motion, AnimatePresence } from 'framer-motion'
import type { Dispatch, SetStateAction } from 'react'
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

/** Vista de solo lectura del detalle de una postulación. */
function ApplicationDetail({ application }: { application: EmploymentApplication }) {
  return (
    <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-200">
      <Detail label="Empresa" value={application.company} />
      <Detail label="Puesto" value={application.position} />
      <Detail label="Plataforma" value={application.platform} />
      <Detail label="Estado" value={application.status} />
      <Detail label="Fecha" value={application.appliedDate} />
      {application.location ? <Detail label="Ubicación" value={application.location} /> : null}
      {application.salary ? <Detail label="Salario" value={application.salary} /> : null}
      {application.url ? (
        <p>
          <strong className="text-slate-900 dark:text-white">URL:</strong>{' '}
          <a href={application.url} target="_blank" rel="noreferrer" className="text-violet-600 underline dark:text-violet-200">{application.url}</a>
        </p>
      ) : null}
      {application.notes ? <Detail label="Notas" value={application.notes} /> : null}

      <DetailList label="Comentarios" items={(application.comments ?? []).map((entry) => ({ id: entry.id, text: entry.text }))} />
      <DetailList label="Recordatorios" items={(application.reminders ?? []).map((entry) => ({ id: entry.id, text: entry.text }))} />
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong className="text-slate-900 dark:text-white">{label}:</strong> {value}
    </p>
  )
}

function DetailList({ label, items }: { label: string; items: { id: string; text: string }[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/6">
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
      <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-200">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-900/70">{item.text}</li>
        ))}
      </ul>
    </div>
  )
}
