import { demoProposals } from "../data/demo";
import type { CreateProposalInput, Proposal } from "../types";

const META_KEY = "tibox.proposals.react.v1";
const htmlAssets = new Map<string, string>();
const fileAssets = new Map<string, string>();

function cloneSeed() {
  return demoProposals.map((proposal) => ({ ...proposal }));
}

export function listLocalProposals(): Proposal[] {
  const raw = localStorage.getItem(META_KEY);
  if (!raw) {
    const seeded = cloneSeed();
    localStorage.setItem(META_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as Proposal[];
  } catch {
    const seeded = cloneSeed();
    localStorage.setItem(META_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

export async function createLocalProposal(input: CreateProposalInput): Promise<Proposal> {
  const id = crypto.randomUUID();
  const publicToken = crypto.randomUUID().replaceAll("-", "");
  const proposal: Proposal = {
    id,
    publicToken,
    clientName: input.clientName,
    clientRut: input.clientRut,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    kamName: input.kamName,
    opportunityNumber: input.opportunityNumber,
    title: input.title,
    status: "draft",
    accessType: input.accessType,
    format: input.format,
    expiresAt: input.expiresAt,
    createdAt: new Date().toISOString(),
    views: 0
  };

  if (input.file) {
    if (input.format === "html") {
      const html = await input.file.text();
      htmlAssets.set(id, html);
      proposal.contentHtml = html;
    } else {
      fileAssets.set(id, URL.createObjectURL(input.file));
    }
  }

  const current = listLocalProposals();
  localStorage.setItem(META_KEY, JSON.stringify([proposal, ...current]));
  return proposal;
}

export function getLocalProposalByToken(token: string): Proposal | undefined {
  const proposal = listLocalProposals().find((item) => item.publicToken === token);
  if (!proposal) return undefined;
  return {
    ...proposal,
    contentHtml: htmlAssets.get(proposal.id) ?? proposal.contentHtml,
    contentUrl: fileAssets.get(proposal.id) ?? proposal.contentUrl
  };
}

export function incrementLocalView(id: string) {
  const proposals = listLocalProposals().map((proposal) =>
    proposal.id === id
      ? { ...proposal, views: proposal.views + 1, status: "viewed" as const, lastViewedAt: new Date().toISOString() }
      : proposal
  );
  localStorage.setItem(META_KEY, JSON.stringify(proposals));
}

export function resetLocalDemo() {
  localStorage.removeItem(META_KEY);
  htmlAssets.clear();
  fileAssets.forEach((url) => URL.revokeObjectURL(url));
  fileAssets.clear();
}
