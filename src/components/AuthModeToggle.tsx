import { Link, useLocation } from 'react-router-dom'

export default function AuthModeToggle() {
  const { pathname } = useLocation()

  const options = [
    { label: 'Iniciar sesión', to: '/login' },
    { label: 'Registrarse', to: '/register' },
  ]

  return (
    <div className="mb-6 inline-flex w-full max-w-md rounded-[18px] border border-white/10 bg-slate-950/85 p-1 shadow-[0_10px_30px_rgba(15,23,42,0.45)] backdrop-blur-xl">
      {options.map((option) => {
        const active = pathname === option.to
        return (
          <Link
            key={option.to}
            to={option.to}
            className={`flex-1 rounded-[14px] px-4 py-2.5 text-center text-sm font-semibold tracking-wide transition-all duration-200 ${
              active
                ? 'bg-gradient-to-r from-violet-500 via-violet-500 to-sky-500 text-white shadow-lg shadow-violet-500/20'
                : 'text-slate-300 hover:bg-white/6 hover:text-white'
            }`}
          >
            {option.label}
          </Link>
        )
      })}
    </div>
  )
}
