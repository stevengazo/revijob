import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl lg:p-8"
    >
      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Bienvenido a ReviJob</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-slate-900 dark:text-white lg:text-6xl">Gestiona tu proceso de selección con claridad y velocidad.</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-200">Una base limpia para mostrar vacantes, organizar candidatos y dejar una experiencia profesional desde el primer acercamiento.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Inicio rápido', 'Diseño limpio para lanzar tu producto con una vista clara y moderna.'],
          ['Autenticación', 'Flujo básico para login y registro listo para conectar con Supabase.'],
          ['Configuración', 'Espacio preparado para personalizar preferencias, notificaciones y acceso.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:shadow-xl dark:shadow-black/20 dark:hover:border-violet-400/40">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
