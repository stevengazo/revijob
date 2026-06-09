import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'

/* ---------- Persistencia ligera de preferencias ---------- */

const PREFS_KEY = 'revijob-preferences'

interface Preferences {
  fullName: string
  email: string
  notifyApplications: boolean
  notifyMessages: boolean
  notifyProductNews: boolean
  shareProfileWithTeam: boolean
  usageAnalytics: boolean
  personalizedAds: boolean
}

const defaultPreferences: Preferences = {
  fullName: 'María López',
  email: 'maria@revijob.dev',
  notifyApplications: true,
  notifyMessages: true,
  notifyProductNews: false,
  shareProfileWithTeam: true,
  usageAnalytics: true,
  personalizedAds: false,
}

function readPreferences(): Preferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return defaultPreferences
    return { ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) }
  } catch {
    return defaultPreferences
  }
}

/* ---------- Componentes auxiliares ---------- */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        checked ? 'bg-gradient-to-r from-violet-500 to-sky-500' : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

function SettingRow({
  title,
  description,
  control,
}: {
  title: string
  description: string
  control: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 py-4 last:border-b-0 dark:border-white/10">
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>
      </div>
      {control}
    </div>
  )
}

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-5 w-5',
}

type SectionId = 'cuenta' | 'apariencia' | 'notificaciones' | 'publicidad' | 'privacidad'

const SECTIONS: { id: SectionId; label: string; icon: ReactNode }[] = [
  {
    id: 'cuenta',
    label: 'Cuenta',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
      </svg>
    ),
  },
  {
    id: 'apariencia',
    label: 'Apariencia',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    ),
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    icon: (
      <svg {...iconProps}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
    ),
  },
  {
    id: 'publicidad',
    label: 'Publicidad',
    icon: (
      <svg {...iconProps}>
        <path d="M3 11v2a1 1 0 0 0 1 1h3l4 4V6L7 10H4a1 1 0 0 0-1 1Z" />
        <path d="M16 9a3 3 0 0 1 0 6" />
      </svg>
    ),
  },
  {
    id: 'privacidad',
    label: 'Privacidad y términos',
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3Z" />
        <path d="M9.5 12l2 2 3.5-3.5" />
      </svg>
    ),
  },
]

/* ---------- Página ---------- */

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [active, setActive] = useState<SectionId>('cuenta')
  const [prefs, setPrefs] = useState<Preferences>(() => readPreferences())
  const [savedAt, setSavedAt] = useState('')

  // Persiste cualquier cambio de preferencias.
  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  }, [prefs])

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
    setSavedAt(new Date().toLocaleTimeString())
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-1">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl lg:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Configuración</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white lg:text-4xl">Preferencias de la cuenta</h1>
            <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-200">Gestiona tu perfil, las notificaciones, la publicidad y la privacidad desde un único panel.</p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">{savedAt ? `Guardado a las ${savedAt}` : 'Cambios guardados automáticamente'}</p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Menú lateral de secciones */}
          <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECTIONS.map((section) => {
              const selected = active === section.id
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActive(section.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition lg:w-full ${
                    selected
                      ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/40 dark:bg-white/10 dark:text-white'
                      : 'border-transparent bg-slate-100 text-slate-600 hover:border-violet-300 hover:bg-violet-50 dark:bg-white/6 dark:text-slate-200 dark:hover:border-violet-400/40 dark:hover:bg-white/10'
                  }`}
                >
                  <span className={selected ? 'text-violet-600 dark:text-violet-200' : 'text-slate-400'}>{section.icon}</span>
                  <span className="whitespace-nowrap">{section.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Contenido de la sección activa */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-slate-900/80 lg:p-6">
            {active === 'cuenta' ? (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Datos de la cuenta</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Esta información identifica tu perfil dentro de ReviJob.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-100">
                    Nombre completo
                    <input
                      value={prefs.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:ring-violet-400/10"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-slate-700 dark:text-slate-100">
                    Correo electrónico
                    <input
                      type="email"
                      value={prefs.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:border-white/10 dark:bg-slate-950 dark:focus:ring-violet-400/10"
                    />
                  </label>
                </div>
                <div className="mt-2">
                  <SettingRow
                    title="Compartir perfil con el equipo"
                    description="Permite que otros miembros vean tu perfil y tus postulaciones."
                    control={<Toggle checked={prefs.shareProfileWithTeam} onChange={(v) => update('shareProfileWithTeam', v)} />}
                  />
                </div>
              </div>
            ) : null}

            {active === 'apariencia' ? (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Apariencia</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Elige entre modo diurno y nocturno. Tu elección se recuerda en este dispositivo.</p>
                <div className="mt-5 inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-950/70">
                  {([['light', 'Diurno'], ['dark', 'Nocturno']] as const).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTheme(value)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
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
            ) : null}

            {active === 'notificaciones' ? (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Notificaciones</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Decide qué avisos quieres recibir.</p>
                <div className="mt-3">
                  <SettingRow
                    title="Nuevas postulaciones"
                    description="Recibe un aviso cuando se registre una nueva candidatura."
                    control={<Toggle checked={prefs.notifyApplications} onChange={(v) => update('notifyApplications', v)} />}
                  />
                  <SettingRow
                    title="Mensajes"
                    description="Notifícame cuando reciba un mensaje importante."
                    control={<Toggle checked={prefs.notifyMessages} onChange={(v) => update('notifyMessages', v)} />}
                  />
                  <SettingRow
                    title="Novedades del producto"
                    description="Mantente al día de nuevas funciones y mejoras."
                    control={<Toggle checked={prefs.notifyProductNews} onChange={(v) => update('notifyProductNews', v)} />}
                  />
                </div>
              </div>
            ) : null}

            {active === 'publicidad' ? (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Publicidad</h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  ReviJob muestra anuncios de Google AdSense para mantener el servicio gratuito.
                </p>
                <div className="mt-3">
                  <SettingRow
                    title="Anuncios personalizados"
                    description="Permite que Google use cookies para mostrar anuncios más relevantes. Si lo desactivas, seguirás viendo anuncios, pero menos personalizados."
                    control={<Toggle checked={prefs.personalizedAds} onChange={(v) => update('personalizedAds', v)} />}
                  />
                  <SettingRow
                    title="Estadísticas de uso"
                    description="Ayúdanos a mejorar compartiendo datos de uso anónimos."
                    control={<Toggle checked={prefs.usageAnalytics} onChange={(v) => update('usageAnalytics', v)} />}
                  />
                </div>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                  Puedes gestionar tus preferencias de anuncios de Google en cualquier momento desde{' '}
                  <a
                    href="https://myadcenter.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-violet-600 hover:underline dark:text-violet-300"
                  >
                    My Ad Center
                  </a>
                  .
                </p>
              </div>
            ) : null}

            {active === 'privacidad' ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Privacidad y términos</h2>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    Última actualización: 9 de junio de 2026.
                  </p>
                </div>

                <article className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">1. Datos que recopilamos</h3>
                  <p>
                    ReviJob almacena la información de tu perfil, tus postulaciones y los currículums que generas. Por defecto, estos
                    datos se guardan localmente en tu navegador y solo se sincronizan con nuestros servidores si activas las
                    integraciones correspondientes.
                  </p>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">2. Uso de la información</h3>
                  <p>
                    Utilizamos tus datos exclusivamente para ofrecerte el servicio: gestionar candidaturas, generar documentos y
                    personalizar tu experiencia. No vendemos tu información personal a terceros.
                  </p>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">3. Cookies y publicidad</h3>
                  <p>
                    Mostramos anuncios mediante Google AdSense. Google y sus socios pueden usar cookies para mostrar anuncios
                    basados en tus visitas a este y otros sitios. Puedes desactivar la personalización en la sección
                    «Publicidad» o desde la configuración de tu cuenta de Google.
                  </p>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">4. Tus derechos</h3>
                  <p>
                    Puedes acceder, rectificar o eliminar tus datos en cualquier momento. Al borrar el almacenamiento del
                    navegador o cerrar tu cuenta, la información local asociada se elimina de forma permanente.
                  </p>

                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">5. Términos de uso</h3>
                  <p>
                    Al utilizar ReviJob aceptas hacer un uso lícito de la plataforma y ser responsable de la veracidad de los datos
                    que introduces. El servicio se ofrece «tal cual», sin garantías de disponibilidad continua.
                  </p>
                </article>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://policies.google.com/technologies/ads"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-300 dark:border-white/10 dark:bg-white/6 dark:text-slate-100"
                  >
                    Política de anuncios de Google
                  </a>
                  <a
                    href="https://www.revijob.dev/privacidad"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-violet-700 hover:to-sky-600"
                  >
                    Ver política completa
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
