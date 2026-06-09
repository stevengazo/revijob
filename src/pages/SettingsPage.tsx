import { useTheme } from '../context/ThemeContext'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <section className="mx-auto w-full max-w-7xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl lg:p-8">
      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Configuración</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">Preferencias de la cuenta</h1>
      <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-200">Ajusta tu perfil y la experiencia de uso del sistema con una interfaz más clara y moderna.</p>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Apariencia</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Elige entre modo diurno y nocturno. Tu elección se recuerda en este dispositivo.</p>
          </div>
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-950/70">
            {([['light', 'Diurno'], ['dark', 'Nocturno']] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  theme === value
                    ? 'bg-gradient-to-r from-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          ['Notificaciones', 'Activa alertas para nuevas postulaciones y mensajes importantes.'],
          ['Privacidad', 'Controla qué información se comparte con el equipo.'],
          ['Integraciones', 'Prepárate para conectar Supabase, analytics y otros servicios.'],
        ].map(([title, text]) => (
          <article key={title} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:border-violet-300 hover:shadow-md dark:border-white/10 dark:bg-slate-900/80 dark:shadow-xl dark:shadow-black/20 dark:hover:border-violet-400/40">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
