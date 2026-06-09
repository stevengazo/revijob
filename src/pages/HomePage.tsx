import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto w-full max-w-7xl rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-8"
    >
      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">Bienvenido a ReviJob</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold text-white lg:text-6xl">Gestiona tu proceso de selección con claridad y velocidad.</h1>
      <p className="mt-4 max-w-3xl text-lg text-slate-200">Una base limpia para mostrar vacantes, organizar candidatos y dejar una experiencia profesional desde el primer acercamiento.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Inicio rápido', 'Diseño limpio para lanzar tu producto con una vista clara y moderna.'],
          ['Autenticación', 'Flujo básico para login y registro listo para conectar con Supabase.'],
          ['Configuración', 'Espacio preparado para personalizar preferencias, notificaciones y acceso.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </motion.section>
  )
}
