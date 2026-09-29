import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { listProposals } from "../services/api";
import type { Proposal } from "../types";
import { resetLocalDemo } from "../lib/localStore";

const statusLabel: Record<Proposal["status"], string> = {
  draft: "Borrador",
  sent: "Enviada",
  viewed: "Visualizada",
  expired: "Vencida",
  revoked: "Revocada"
};

export function Dashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [query, setQuery] = useState("");

  async function refresh() {
    setProposals(await listProposals());
  }

  useEffect(() => { void refresh(); }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return proposals.filter((proposal) =>
      [proposal.clientName, proposal.title, proposal.contactName, proposal.kamName]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [proposals, query]);

  const viewed = proposals.filter((item) => item.status === "viewed").length;
  const sent = proposals.filter((item) => item.status === "sent").length;
  const views = proposals.reduce((sum, item) => sum + item.views, 0);

  return (
    <AppShell>
      <main className="mx-auto max-w-[1450px] p-5 md:p-8">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#FCC703]">Gestión comercial</div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Propuestas con una mejor experiencia.</h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
              Publica propuestas HTML, PDF o PPTX, controla el acceso y revisa cuándo un cliente interactúa con ellas.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/p/demo-web" className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-extrabold text-[#03233a]">
              Ver demo cliente
            </Link>
            <button
              onClick={() => { resetLocalDemo(); void refresh(); }}
              className="rounded-xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-xs font-bold text-slate-300"
            >
              Restaurar demo
            </button>
          </div>
        </div>

        <section className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Propuestas activas", proposals.length, "Disponibles en el portal"],
            ["Visualizadas", viewed, "Clientes que ya ingresaron"],
            ["Pendientes", sent, "Enviadas sin apertura"],
            ["Visualizaciones", views, "Acumuladas"]
          ].map(([label, value, foot]) => (
            <article key={String(label)} className="glass rounded-2xl p-5">
              <div className="text-xs font-semibold text-slate-400">{label}</div>
              <div className="mt-2 text-3xl font-extrabold">{value}</div>
              <div className="mt-1 text-[10px] text-slate-600">{foot}</div>
            </article>
          ))}
        </section>

        <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cliente, propuesta o KAM..."
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#041327] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
          />
          <div className="text-xs text-slate-500">{filtered.length} propuestas</div>
        </div>

        <section className="glass mt-3 overflow-hidden rounded-2xl">
          <div className="hidden grid-cols-[1.15fr_1.6fr_.9fr_.75fr_.65fr_.45fr] gap-4 border-b border-white/10 px-5 py-3 text-[9px] font-extrabold uppercase tracking-[.12em] text-slate-600 lg:grid">
            <span>Cliente</span><span>Propuesta</span><span>KAM</span><span>Acceso</span><span>Estado</span><span />
          </div>
          <div>
            {filtered.map((proposal) => (
              <div key={proposal.id} className="grid gap-3 border-b border-white/[.06] px-5 py-4 last:border-0 lg:grid-cols-[1.15fr_1.6fr_.9fr_.75fr_.65fr_.45fr] lg:items-center lg:gap-4">
                <div>
                  <div className="text-xs font-bold">{proposal.clientName}</div>
                  <div className="mt-1 text-[10px] text-slate-500">{proposal.contactName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold">{proposal.title}</div>
                  <div className="mt-1 text-[10px] text-slate-500">{proposal.opportunityNumber ?? "Sin oportunidad"} · {proposal.format.toUpperCase()}</div>
                </div>
                <div className="text-xs text-slate-300">{proposal.kamName}</div>
                <div className="text-xs text-slate-400">{proposal.accessType === "otp" ? "Email + OTP" : "Link + PIN"}</div>
                <div>
                  <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/[.06] px-2.5 py-1 text-[10px] font-bold text-cyan-200">
                    {statusLabel[proposal.status]}
                  </span>
                </div>
                <Link to={`/p/${proposal.publicToken}`} className="rounded-lg border border-white/10 px-3 py-2 text-center text-[10px] font-bold text-slate-300 hover:bg-white/5">
                  Abrir
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
