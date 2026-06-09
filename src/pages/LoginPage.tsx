import AuthModeToggle from '../components/AuthModeToggle'

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-[32px] border border-white/10 bg-white/6 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-10">
      <AuthModeToggle />
      <p className="text-[0.68rem] uppercase tracking-[0.35em] text-violet-200">Acceso</p>
      <h1 className="mt-3 text-4xl font-semibold text-white">Iniciar sesión</h1>
      <p className="mt-3 text-slate-200">Ingresa tus credenciales para continuar.</p>

      <form className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-semibold text-slate-100">Correo
          <input type="email" placeholder="tu@correo.com" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-slate-100">Contraseña
          <input type="password" placeholder="••••••••" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" />
        </label>
        <button type="submit" className="rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-500/20">Entrar</button>
      </form>

    </section>
  )
}
