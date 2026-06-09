import { motion } from 'framer-motion'
import { Eyebrow, PrimaryButton, panelClass } from '../ui'

/** Cabecera de la página de aplicaciones con título y acción de crear. */
export default function ApplicationsHeader({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`${panelClass} lg:p-8`}
    >
      <Eyebrow>Aplicaciones</Eyebrow>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Registro y control de aplicaciones</h1>
          <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-200">Administra tus postulaciones, actualiza estados y guarda observaciones en un CRUD básico con almacenamiento local.</p>
        </div>
        <PrimaryButton type="button" onClick={onCreate}>+ Nueva aplicación</PrimaryButton>
      </div>
    </motion.header>
  )
}
