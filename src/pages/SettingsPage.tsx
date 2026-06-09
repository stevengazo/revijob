export default function SettingsPage() {
  return (
    <section className="mx-auto w-full max-w-7xl rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-8">
      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">Configuración</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Preferencias de la cuenta</h1>
      <p className="mt-3 max-w-3xl text-slate-200">Ajusta tu perfil y la experiencia de uso del sistema con una interfaz más clara y moderna.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Notificaciones', 'Activa alertas para nuevas postulaciones y mensajes importantes.'],
          ['Privacidad', 'Controla qué información se comparte con el equipo.'],
          ['Integraciones', 'Prepárate para conectar Supabase, analytics y otros servicios.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
