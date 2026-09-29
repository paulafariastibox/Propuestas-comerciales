import type { CreateProposalInput, Proposal } from "../types";
import {
  createLocalProposal,
  getLocalProposalByToken,
  incrementLocalView,
  listLocalProposals
} from "../lib/localStore";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";

export async function listProposals(): Promise<Proposal[]> {
  if (DEMO_MODE) return listLocalProposals();
  const response = await fetch(`${API_BASE}/proposals`, { credentials: "include" });
  if (!response.ok) throw new Error("No fue posible cargar las propuestas.");
  return response.json();
}

export async function createProposal(input: CreateProposalInput): Promise<Proposal> {
  if (DEMO_MODE) return createLocalProposal(input);

  const form = new FormData();
  form.append("metadata", JSON.stringify({
    clientName: input.clientName,
    clientRut: input.clientRut,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    kamName: input.kamName,
    opportunityNumber: input.opportunityNumber,
    title: input.title,
    expiresAt: input.expiresAt,
    accessType: input.accessType,
    pin: input.pin,
    format: input.format
  }));
  if (input.file) form.append("file", input.file);

  const response = await fetch(`${API_BASE}/proposals`, {
    method: "POST",
    body: form,
    credentials: "include"
  });
  if (!response.ok) throw new Error("No fue posible crear la propuesta.");
  return response.json();
}

export async function getPublicProposal(token: string): Promise<Proposal | undefined> {
  if (DEMO_MODE) return getLocalProposalByToken(token);
  const response = await fetch(`${API_BASE}/public/proposals/${encodeURIComponent(token)}`);
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error("No fue posible cargar la propuesta.");
  return response.json();
}

export async function verifyAccess(token: string, value: string) {
  if (DEMO_MODE) {
    const proposal = getLocalProposalByToken(token);
    const expected = proposal?.accessType === "otp" ? "482731" : "2468";
    if (value !== expected) throw new Error("Código de acceso incorrecto.");
    if (proposal) incrementLocalView(proposal.id);
    return { accessToken: "demo-access-token" };
  }

  const response = await fetch(`${API_BASE}/public/proposals/${encodeURIComponent(token)}/access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value })
  });
  if (!response.ok) throw new Error("Código de acceso incorrecto.");
  return response.json() as Promise<{ accessToken: string }>;
}

export function contentUrl(token: string, accessToken: string) {
  return `${API_BASE}/public/proposals/${encodeURIComponent(token)}/content?access_token=${encodeURIComponent(accessToken)}`;
}
