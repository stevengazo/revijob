import AuthModeToggle from '../components/AuthModeToggle'

const inputClass =
  'rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:bg-slate-950/80 dark:focus:ring-violet-500/30'

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-white/6 dark:shadow-2xl dark:shadow-black/30 dark:backdrop-blur-xl lg:p-10">
      <AuthModeToggle />
      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-600 dark:text-violet-200">Acceso</p>
      <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">Iniciar sesión</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-200">Ingresa tus credenciales para continuar.</p>

      <form className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">Correo
          <input type="email" placeholder="tu@correo.com" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-100">Contraseña
          <input type="password" placeholder="••••••••" className={inputClass} />
        </label>
        <button type="submit" className="rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:shadow-xl hover:shadow-violet-500/40">Entrar</button>
      </form>
    </section>
  )
}
