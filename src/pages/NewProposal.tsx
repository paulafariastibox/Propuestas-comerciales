import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { createProposal } from "../services/api";
import type { AccessType, ProposalFormat } from "../types";

export function NewProposal() {
  const navigate = useNavigate();
  const [accessType, setAccessType] = useState<AccessType>("pin");
  const [format, setFormat] = useState<ProposalFormat>("html");
  const [file, setFile] = useState<File>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      await createProposal({
        clientName: String(data.get("clientName") || ""),
        clientRut: String(data.get("clientRut") || ""),
        contactName: String(data.get("contactName") || ""),
        contactEmail: String(data.get("contactEmail") || ""),
        kamName: String(data.get("kamName") || ""),
        opportunityNumber: String(data.get("opportunityNumber") || ""),
        title: String(data.get("title") || ""),
        expiresAt: String(data.get("expiresAt") || ""),
        accessType,
        pin: String(data.get("pin") || ""),
        format,
        file
      });
      navigate("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No fue posible crear la propuesta.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-5xl p-5 md:p-8">
        <div className="mb-6">
          <div className="text-[10px] font-extrabold uppercase tracking-[.2em] text-[#FCC703]">Nueva propuesta</div>
          <h1 className="mt-2 text-3xl font-extrabold">Crear acceso comercial</h1>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Carga el documento, define quién puede verlo y genera una URL privada para el cliente.
          </p>
        </div>

        <form onSubmit={submit} className="glass rounded-3xl p-5 md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["clientName", "Cliente", "Empresa ABC"],
              ["clientRut", "RUT", "76.123.456-7"],
              ["contactName", "Contacto", "Nombre y apellido"],
              ["contactEmail", "Email autorizado", "contacto@cliente.cl"],
              ["kamName", "KAM", "Nombre del ejecutivo"],
              ["opportunityNumber", "N° oportunidad", "OP-2026-000"],
              ["title", "Nombre de propuesta", "Modernización y Seguridad TI"],
              ["expiresAt", "Vigencia hasta", ""]
            ].map(([name, label, placeholder]) => (
              <label key={name} className="grid gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-500">{label}</span>
                <input
                  required={["clientName","contactName","contactEmail","kamName","title","expiresAt"].includes(name)}
                  name={name}
                  type={name === "contactEmail" ? "email" : name === "expiresAt" ? "date" : "text"}
                  placeholder={placeholder}
                  className="rounded-xl border border-white/10 bg-[#041327] px-4 py-3 text-sm outline-none focus:border-cyan-400/50"
                />
              </label>
            ))}
          </div>

          <div className="mt-6">
            <div className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-500">Tipo de acceso</div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {[
                ["pin", "Link + PIN", "El cliente recibe un enlace privado y un PIN."],
                ["otp", "Email + OTP", "El código se envía al email autorizado."]
              ].map(([value, title, description]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setAccessType(value as AccessType)}
                  className={`rounded-2xl border p-4 text-left transition ${accessType === value ? "border-cyan-400/40 bg-cyan-400/[.07]" : "border-white/10 bg-white/[.02]"}`}
                >
                  <div className="text-xs font-extrabold">{title}</div>
                  <div className="mt-1 text-[10px] leading-5 text-slate-500">{description}</div>
                </button>
              ))}
            </div>
          </div>

          {accessType === "pin" && (
            <label className="mt-4 grid max-w-xs gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-500">PIN</span>
              <input name="pin" minLength={4} maxLength={8} defaultValue="2468" className="rounded-xl border border-white/10 bg-[#041327] px-4 py-3 text-sm outline-none focus:border-cyan-400/50" />
            </label>
          )}

          <div className="mt-6">
            <div className="text-[10px] font-extrabold uppercase tracking-[.1em] text-slate-500">Formato</div>
            <div className="mt-2 grid gap-3 md:grid-cols-3">
              {[
                ["html", "HTML interactivo", "Miniweb con botones y animaciones."],
                ["pdf", "PDF", "Mantiene el diseño original."],
                ["pptx", "PPT / PPTX", "Se convertirá en backend antes de mostrarlo."]
              ].map(([value, title, description]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setFormat(value as ProposalFormat)}
                  className={`rounded-2xl border p-4 text-left transition ${format === value ? "border-cyan-400/40 bg-cyan-400/[.07]" : "border-white/10 bg-white/[.02]"}`}
                >
                  <div className="text-xs font-extrabold">{title}</div>
                  <div className="mt-1 text-[10px] leading-5 text-slate-500">{description}</div>
                </button>
              ))}
            </div>
          </div>

          <label className="mt-5 block cursor-pointer rounded-2xl border border-dashed border-white/15 bg-white/[.02] p-7 text-center">
            <div className="text-sm font-bold">{file ? file.name : "Seleccionar archivo de propuesta"}</div>
            <div className="mt-2 text-[10px] text-slate-500">HTML, PDF o PPTX según el formato seleccionado.</div>
            <input
              hidden
              type="file"
              accept={format === "html" ? ".html,.htm,text/html" : format === "pdf" ? ".pdf,application/pdf" : ".ppt,.pptx"}
              onChange={(event) => setFile(event.target.files?.[0])}
            />
          </label>

          {error && <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/[.06] p-3 text-xs text-red-200">{error}</div>}

          <div className="mt-7 flex justify-end gap-3 border-t border-white/10 pt-5">
            <Link to="/" className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-slate-300">Cancelar</Link>
            <button disabled={busy} className="rounded-xl bg-[#FCC703] px-5 py-2.5 text-xs font-extrabold text-[#0a213f] disabled:opacity-50">
              {busy ? "Creando..." : "Crear propuesta"}
            </button>
          </div>
        </form>
      </main>
    </AppShell>
  );
}
