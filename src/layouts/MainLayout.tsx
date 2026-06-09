import { Link, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import ThemeToggle from '../components/ThemeToggle'

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'h-5 w-5',
}

const navItems: { to: string; label: string; hint: string; icon: ReactNode }[] = [
  {
    to: '/',
    label: 'Inicio',
    hint: 'Resumen',
    icon: (
      <svg {...iconProps}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    to: '/applications',
    label: 'Aplicaciones',
    hint: 'CRUD',
    icon: (
      <svg {...iconProps}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    to: '/cv',
    label: 'CV',
    hint: 'Editor',
    icon: (
      <svg {...iconProps}>
        <path d="M7 4h6l4 4v12H7z" />
        <path d="M13 4v5h5" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Configuración',
    hint: 'Perfil',
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen text-slate-700 dark:text-slate-100 lg:grid lg:grid-cols-[300px_1fr] lg:h-screen lg:overflow-hidden">
      <aside className="border-b border-slate-200 bg-white/70 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl">
          <p className="mb-3 text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Panel</p>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-base font-black text-white shadow-lg shadow-violet-500/30">RJ</div>
            <div>
              <Link to="/" className="text-lg font-semibold text-slate-900 dark:text-white">ReviJob</Link>
              <p className="text-sm text-slate-500 dark:text-slate-300">Gestión de talento</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 grid gap-2">
          {navItems.map((item) => {
            const active = pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                  active
                    ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-400/40 dark:bg-white/10 dark:text-white'
                    : 'border-transparent bg-slate-100 text-slate-600 hover:border-violet-300 hover:bg-violet-50 dark:bg-white/6 dark:text-slate-100 dark:hover:border-violet-400/40 dark:hover:bg-white/10'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={active ? 'text-violet-600 dark:text-violet-200' : 'text-slate-400 dark:text-slate-400'}>{item.icon}</span>
                  {item.label}
                </span>
                <span className="text-xs text-violet-500 dark:text-violet-200">{item.hint}</span>
              </Link>
            )
          })}
        </nav>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
        >
          <svg {...iconProps} className="h-4 w-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Cerrar sesión
        </Link>
      </aside>

      <section className="flex min-h-screen flex-col lg:h-screen lg:min-h-0 lg:overflow-hidden">
        <header className="shrink-0 border-b border-slate-200 bg-white/70 px-3 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/80 lg:px-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">{isHome ? 'Inicio privado' : 'Área principal'}</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{isHome ? 'Panel de control' : 'Configuración'}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isHome ? (
                <nav className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-white/6 dark:shadow-lg dark:shadow-black/20 dark:backdrop-blur-md">
                  <Link to="/" className="rounded-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/8 dark:hover:text-white">Resumen</Link>
                  <Link to="/settings" className="rounded-full px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/8 dark:hover:text-white">Perfil</Link>
                  <Link to="/login" className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800">Salir</Link>
                </nav>
              ) : (
                <Link to="/settings" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-violet-300 dark:border-white/10 dark:bg-white/6 dark:text-white dark:shadow-xl dark:shadow-black/20">Editar perfil</Link>
              )}
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto  py-5">
          <Outlet />
        </main>
      </section>
    </div>
  )
}
