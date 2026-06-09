import { Link, Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen text-slate-100">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3 text-xl font-semibold tracking-tight text-white">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-sky-500 text-sm font-black">RJ</span>
          ReviJob
        </Link>
       
      </header>

      <main className="mx-auto flex w-full max-w-7xl px-6 pb-10 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}
