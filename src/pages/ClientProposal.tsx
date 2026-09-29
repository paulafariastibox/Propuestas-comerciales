import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProposalViewer } from "../components/ProposalViewer";
import { contentUrl, getPublicProposal, verifyAccess } from "../services/api";
import type { Proposal } from "../types";

export function ClientProposal() {
  const { token = "" } = useParams();
  const [proposal, setProposal] = useState<Proposal>();
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicProposal(token)
      .then(setProposal)
      .finally(() => setLoading(false));
  }, [token]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const result = await verifyAccess(token, String(data.get("code") || ""));
      setAccessToken(result.accessToken);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Acceso denegado.");
    }
  }

  if (loading) return <div className="grid min-h-screen place-items-center text-slate-400">Cargando propuesta...</div>;

  if (!proposal) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-extrabold">Propuesta no disponible</h1>
          <p className="mt-3 text-sm text-slate-400">El enlace puede haber vencido o sido revocado.</p>
          <Link to="/" className="mt-5 inline-block text-sm font-bold text-cyan-300">Volver</Link>
        </div>
      </div>
    );
  }

  if (accessToken) {
    return (
      <div className="fixed inset-0 bg-[#020b18]">
        <header className="flex h-[68px] items-center justify-between border-b border-white/10 bg-[#031126] px-5">
          <div>
            <div className="text-lg font-extrabold tracking-[.16em]">TIBOX</div>
            <div className="mt-1 text-[9px] text-slate-500">{proposal.clientName} · {proposal.title}</div>
          </div>
          <button onClick={() => setAccessToken("")} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold">Cerrar</button>
        </header>
        <div className="h-[calc(100vh-68px)]">
          <ProposalViewer
            proposal={proposal}
            remoteContentUrl={import.meta.env.VITE_DEMO_MODE === "false" ? contentUrl(token, accessToken) : undefined}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_.85fr]">
      <section className="tibox-grid hidden border-r border-white/10 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="text-2xl font-extrabold tracking-[.16em]">TIBOX</div>
        <div className="max-w-3xl">
          <div className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#FCC703]">Propuesta preparada para {proposal.clientName}</div>
          <h1 className="mt-4 text-5xl font-extrabold leading-[1.03] tracking-tight">{proposal.title}</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
            Una experiencia privada para revisar la propuesta desde cualquier dispositivo, con control de acceso y trazabilidad.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="text-[9px] uppercase text-slate-600">Cliente</div><div className="mt-2 font-bold">{proposal.clientName}</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="text-[9px] uppercase text-slate-600">Vigencia</div><div className="mt-2 font-bold">{proposal.expiresAt}</div></div>
          <div className="rounded-2xl border border-white/10 bg-white/[.025] p-4"><div className="text-[9px] uppercase text-slate-600">Formato</div><div className="mt-2 font-bold">{proposal.format.toUpperCase()}</div></div>
        </div>
      </section>

      <section className="grid place-items-center p-6">
        <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-7">
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/[.06] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[.12em] text-emerald-200">
            Acceso protegido
          </div>
          <h2 className="mt-5 text-2xl font-extrabold">Verifica tu acceso</h2>
          <p className="mt-2 text-xs leading-6 text-slate-400">
            {proposal.accessType === "otp"
              ? `Ingresa el código enviado a ${proposal.contactEmail}.`
              : "Ingresa el PIN informado por tu ejecutivo TIBOX."}
          </p>
          <label className="mt-5 grid gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-500">
              {proposal.accessType === "otp" ? "Código OTP" : "PIN"}
            </span>
            <input
              name="code"
              required
              autoComplete="one-time-code"
              inputMode="numeric"
              placeholder={proposal.accessType === "otp" ? "000000" : "••••"}
              className="rounded-xl border border-white/10 bg-[#041327] px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
            />
          </label>
          {error && <div className="mt-3 text-xs text-red-300">{error}</div>}
          <button className="mt-4 w-full rounded-xl bg-[#FCC703] px-4 py-3 text-xs font-extrabold text-[#0a213f]">
            Ingresar a la propuesta
          </button>
          <div className="mt-4 rounded-xl border border-yellow-300/15 bg-yellow-300/[.04] p-3 text-[10px] leading-5 text-yellow-100/60">
            Demo: PIN 2468 · OTP 482731
          </div>
        </form>
      </section>
    </div>
  );
}
