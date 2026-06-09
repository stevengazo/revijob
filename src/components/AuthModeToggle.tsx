import { Link, useLocation } from 'react-router-dom'

export default function AuthModeToggle() {
  const { pathname } = useLocation()

  const options = [
    { label: 'Iniciar sesión', to: '/login' },
    { label: 'Registrarse', to: '/register' },
  ]

  return (
    <div className="mb-6 inline-flex w-full max-w-md rounded-[18px] border border-slate-200 bg-slate-100 p-1 shadow-sm dark:border-white/10 dark:bg-slate-950/85 dark:shadow-[0_10px_30px_rgba(15,23,42,0.45)] dark:backdrop-blur-xl">
      {options.map((option) => {
        const active = pathname === option.to
        return (
          <Link
            key={option.to}
            to={option.to}
            className={`flex-1 rounded-[14px] px-4 py-2.5 text-center text-sm font-semibold tracking-wide transition-all duration-200 ${
              active
                ? 'bg-gradient-to-r from-violet-500 via-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-500 hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white'
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
