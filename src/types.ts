export type AccessType = "pin" | "otp";
export type ProposalStatus = "draft" | "sent" | "viewed" | "expired" | "revoked";
export type ProposalFormat = "html" | "pdf" | "pptx";

export interface Proposal {
  id: string;
  publicToken: string;
  clientName: string;
  clientRut?: string;
  contactName: string;
  contactEmail: string;
  kamName: string;
  opportunityNumber?: string;
  title: string;
  status: ProposalStatus;
  accessType: AccessType;
  format: ProposalFormat;
  expiresAt: string;
  createdAt: string;
  views: number;
  lastViewedAt?: string;
  contentUrl?: string;
  contentHtml?: string;
}

export interface CreateProposalInput {
  clientName: string;
  clientRut?: string;
  contactName: string;
  contactEmail: string;
  kamName: string;
  opportunityNumber?: string;
  title: string;
  expiresAt: string;
  accessType: AccessType;
  pin?: string;
  format: ProposalFormat;
  file?: File;
}
