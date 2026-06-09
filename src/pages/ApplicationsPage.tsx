import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import type { EmploymentApplication, EmploymentApplicationDraft } from '../types/application'
import { applicationService } from '../services/applicationService'
import { Eyebrow, StatCard, panelClass } from '../components/ui'
import {
  ApplicationDrawer,
  ApplicationsHeader,
  CalendarView,
  KanbanView,
  TableView,
  ViewSwitcher,
} from '../components/applications'
import type { DrawerMode, ViewMode } from '../components/applications'

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
  const [viewMode, setViewMode] = useState<ViewMode>('calendar')
  const [mode, setMode] = useState<DrawerMode>('create')
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
      <ApplicationsHeader onCreate={openCreate} />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <StatCard label="Total" value={applications.length} />
        <StatCard label="En revisión" value={applications.filter((a) => a.status === 'En revisión').length} />
        <StatCard label="Entrevistas" value={applications.filter((a) => a.status === 'Entrevista').length} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className={panelClass.replace('p-6', 'p-4')}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Eyebrow>Vistas</Eyebrow>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">Explora tus postulaciones por contexto</h2>
          </div>
          <ViewSwitcher value={viewMode} onChange={setViewMode} />
        </div>

        {viewMode === 'calendar' && <CalendarView applications={sortedApplications} />}
        {viewMode === 'kanban' && <KanbanView applications={sortedApplications} onView={openView} onEdit={openEdit} />}
        {viewMode === 'table' && <TableView applications={sortedApplications} onView={openView} onEdit={openEdit} onRemove={remove} />}
      </motion.div>

      <ApplicationDrawer
        open={drawerOpen}
        mode={mode}
        draft={draft}
        setDraft={setDraft}
        selectedApplication={selectedApplication}
        onSave={save}
        onClose={() => setDrawerOpen(false)}
      />
    </section>
  )
}
