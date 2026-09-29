import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl font-extrabold tracking-[.16em]">TIBOX</div>
      <div className="grid rotate-45 grid-cols-2 gap-1">
        <span className="size-2.5 rounded-sm bg-[#FCC703]" />
        <span className="size-2.5 rounded-sm bg-[#F24C3D]" />
        <span className="size-2.5 rounded-sm bg-[#12B1FD]" />
        <span className="size-2.5 rounded-sm bg-white" />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const linkClass = (path: string) =>
    `rounded-xl px-4 py-3 text-sm font-semibold transition ${location.pathname === path
      ? "border border-cyan-400/20 bg-cyan-400/10 text-white"
      : "text-slate-400 hover:bg-white/5 hover:text-white"}`;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="hidden min-h-screen border-r border-white/10 bg-[#021022]/85 p-5 lg:flex lg:flex-col">
        <Brand />
        <nav className="mt-10 grid gap-2">
          <Link to="/" className={linkClass("/")}>Dashboard</Link>
          <button className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-500">Propuestas</button>
          <button className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-500">Clientes</button>
          <button className="rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-500">Actividad</button>
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.03] p-3">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-full bg-cyan-500 font-bold text-[#04152c]">PF</div>
            <div>
              <div className="text-xs font-bold">Paula Farias</div>
              <div className="text-[10px] text-slate-500">Mercado y Producto</div>
            </div>
          </div>
        </div>
      </aside>
      <section className="min-w-0">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-white/10 bg-[#031126]/90 px-5 backdrop-blur-xl md:px-8">
          <div className="lg:hidden"><Brand /></div>
          <div className="hidden text-xs font-bold text-slate-400 lg:block">Portal de Propuestas TIBOX</div>
          <Link to="/proposals/new" className="rounded-xl bg-[#FCC703] px-4 py-2.5 text-xs font-extrabold text-[#0a213f] shadow-lg shadow-yellow-400/10 transition hover:-translate-y-px">
            + Nueva propuesta
          </Link>
        </header>
        {children}
      </section>
    </div>
  );
}
