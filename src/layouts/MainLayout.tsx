import { Link, Outlet, useLocation } from 'react-router-dom'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 lg:grid lg:grid-cols-[300px_1fr]">
      <aside className="border-b border-white/10 bg-slate-950/95 p-5 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
        <div className="rounded-3xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <p className="mb-3 text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">Panel</p>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-base font-black text-white shadow-lg shadow-violet-500/20">RJ</div>
            <div>
              <Link to="/" className="text-lg font-semibold text-white">ReviJob</Link>
              <p className="text-sm text-slate-300">Gestión de talento</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 grid gap-2">
          <Link to="/" className="flex items-center justify-between rounded-2xl border border-transparent bg-white/6 px-4 py-3 text-sm text-slate-100 transition hover:border-violet-400/40 hover:bg-white/10">Inicio <span className="text-violet-200">Resumen</span></Link>
          <Link to="/applications" className="flex items-center justify-between rounded-2xl border border-transparent bg-white/6 px-4 py-3 text-sm text-slate-100 transition hover:border-violet-400/40 hover:bg-white/10">Aplicaciones <span className="text-violet-200">CRUD</span></Link>
          <Link to="/settings" className="flex items-center justify-between rounded-2xl border border-transparent bg-white/6 px-4 py-3 text-sm text-slate-100 transition hover:border-violet-400/40 hover:bg-white/10">Configuración <span className="text-violet-200">Perfil</span></Link>
        </nav>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Link to="/login" className="block rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-center text-sm font-semibold text-slate-100 transition hover:border-violet-400/40 hover:bg-slate-800">Cerrar sesión</Link>
        </div>
      </aside>

      <section className="flex min-h-screen flex-col">
        <header className="border-b border-white/10 bg-slate-950/80 px-5 py-4 backdrop-blur-xl lg:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">{isHome ? 'Inicio privado' : 'Área principal'}</p>
              <h2 className="mt-1 text-xl font-semibold text-white">{isHome ? 'Panel de control' : 'Configuración'}</h2>
            </div>

            {isHome ? (
              <nav className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-white/6 p-1 shadow-lg shadow-black/20 backdrop-blur-md">
                <Link to="/" className="rounded-full px-3 py-2 text-sm text-slate-200 hover:bg-white/8 hover:text-white">Resumen</Link>
                <Link to="/settings" className="rounded-full px-3 py-2 text-sm text-slate-200 hover:bg-white/8 hover:text-white">Perfil</Link>
                <Link to="/login" className="rounded-full bg-slate-900/80 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Salir</Link>
              </nav>
            ) : (
              <Link to="/settings" className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white shadow-xl shadow-black/20">Editar perfil</Link>
            )}
          </div>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-6">
          <Outlet />
        </main>
      </section>
    </div>
  )
}
