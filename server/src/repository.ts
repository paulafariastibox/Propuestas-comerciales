import { randomUUID } from "node:crypto";
import { getPool, sql, sqlConfigured } from "./db.js";

export interface ProposalRecord {
  id: string;
  publicToken: string;
  clientName: string;
  clientRut?: string | null;
  contactName: string;
  contactEmail: string;
  kamName: string;
  opportunityNumber?: string | null;
  title: string;
  status: string;
  accessType: "pin" | "otp";
  pinHash?: string | null;
  format: "html" | "pdf" | "pptx";
  expiresAt: string;
  createdAt: string;
  views: number;
  lastViewedAt?: string | null;
}

export interface AssetRecord {
  id: string;
  proposalId: string;
  storageKey: string;
  storageProvider: "azure-blob" | "local";
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
}

const memoryProposals = new Map<string, ProposalRecord>();
const memoryAssets = new Map<string, AssetRecord>();

function mapProposal(row: Record<string, unknown>): ProposalRecord {
  return {
    id: String(row.id),
    publicToken: String(row.public_token),
    clientName: String(row.client_name),
    clientRut: row.client_rut ? String(row.client_rut) : null,
    contactName: String(row.contact_name),
    contactEmail: String(row.contact_email),
    kamName: String(row.kam_name),
    opportunityNumber: row.opportunity_number ? String(row.opportunity_number) : null,
    title: String(row.title),
    status: String(row.status),
    accessType: String(row.access_type) as "pin" | "otp",
    pinHash: row.pin_hash ? String(row.pin_hash) : null,
    format: String(row.format) as "html" | "pdf" | "pptx",
    expiresAt: new Date(String(row.expires_at)).toISOString(),
    createdAt: new Date(String(row.created_at)).toISOString(),
    views: Number(row.views ?? 0),
    lastViewedAt: row.last_viewed_at ? new Date(String(row.last_viewed_at)).toISOString() : null
  };
}

export async function listProposals(): Promise<ProposalRecord[]> {
  if (!sqlConfigured()) return [...memoryProposals.values()];
  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT TOP (250) *
    FROM dbo.Proposals
    ORDER BY created_at DESC
  `);
  return result.recordset.map(mapProposal);
}

export async function insertProposal(
  proposal: ProposalRecord,
  asset?: Omit<AssetRecord, "id">
) {
  if (!sqlConfigured()) {
    memoryProposals.set(proposal.publicToken, proposal);
    if (asset) {
      memoryAssets.set(proposal.id, { id: randomUUID(), ...asset });
    }
    return;
  }

  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  try {
    await new sql.Request(transaction)
      .input("id", sql.UniqueIdentifier, proposal.id)
      .input("public_token", sql.NVarChar(80), proposal.publicToken)
      .input("client_name", sql.NVarChar(200), proposal.clientName)
      .input("client_rut", sql.NVarChar(30), proposal.clientRut ?? null)
      .input("contact_name", sql.NVarChar(200), proposal.contactName)
      .input("contact_email", sql.NVarChar(320), proposal.contactEmail)
      .input("kam_name", sql.NVarChar(200), proposal.kamName)
      .input("opportunity_number", sql.NVarChar(100), proposal.opportunityNumber ?? null)
      .input("title", sql.NVarChar(300), proposal.title)
      .input("status", sql.VarChar(20), proposal.status)
      .input("access_type", sql.VarChar(10), proposal.accessType)
      .input("pin_hash", sql.NVarChar(255), proposal.pinHash ?? null)
      .input("format", sql.VarChar(10), proposal.format)
      .input("expires_at", sql.DateTime2, new Date(proposal.expiresAt))
      .query(`
        INSERT INTO dbo.Proposals
        (id, public_token, client_name, client_rut, contact_name, contact_email,
         kam_name, opportunity_number, title, status, access_type, pin_hash,
         format, expires_at)
        VALUES
        (@id, @public_token, @client_name, @client_rut, @contact_name, @contact_email,
         @kam_name, @opportunity_number, @title, @status, @access_type, @pin_hash,
         @format, @expires_at)
      `);

    if (asset) {
      await new sql.Request(transaction)
        .input("id", sql.UniqueIdentifier, randomUUID())
        .input("proposal_id", sql.UniqueIdentifier, proposal.id)
        .input("storage_key", sql.NVarChar(900), asset.storageKey)
        .input("storage_provider", sql.VarChar(30), asset.storageProvider)
        .input("original_file_name", sql.NVarChar(500), asset.originalFileName)
        .input("mime_type", sql.NVarChar(200), asset.mimeType)
        .input("size_bytes", sql.BigInt, asset.sizeBytes)
        .query(`
          INSERT INTO dbo.ProposalAssets
          (id, proposal_id, storage_key, storage_provider, original_file_name, mime_type, size_bytes)
          VALUES (@id, @proposal_id, @storage_key, @storage_provider, @original_file_name, @mime_type, @size_bytes)
        `);
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function findProposalByToken(token: string) {
  if (!sqlConfigured()) return memoryProposals.get(token);
  const pool = await getPool();
  const result = await pool
    .request()
    .input("token", sql.NVarChar(80), token)
    .query("SELECT TOP (1) * FROM dbo.Proposals WHERE public_token = @token");
  return result.recordset[0] ? mapProposal(result.recordset[0]) : undefined;
}

export async function findAsset(proposalId: string): Promise<AssetRecord | undefined> {
  if (!sqlConfigured()) return memoryAssets.get(proposalId);
  const pool = await getPool();
  const result = await pool
    .request()
    .input("proposal_id", sql.UniqueIdentifier, proposalId)
    .query("SELECT TOP (1) * FROM dbo.ProposalAssets WHERE proposal_id = @proposal_id ORDER BY created_at DESC");
  const row = result.recordset[0];
  if (!row) return undefined;
  return {
    id: String(row.id),
    proposalId: String(row.proposal_id),
    storageKey: String(row.storage_key),
    storageProvider: String(row.storage_provider) as "azure-blob" | "local",
    originalFileName: String(row.original_file_name),
    mimeType: String(row.mime_type),
    sizeBytes: Number(row.size_bytes)
  };
}

export async function recordView(proposalId: string) {
  if (!sqlConfigured()) {
    for (const [token, proposal] of memoryProposals) {
      if (proposal.id === proposalId) {
        memoryProposals.set(token, {
          ...proposal,
          views: proposal.views + 1,
          status: "viewed",
          lastViewedAt: new Date().toISOString()
        });
        return;
      }
    }
    return;
  }
  const pool = await getPool();
  await pool
    .request()
    .input("proposal_id", sql.UniqueIdentifier, proposalId)
    .query(`
      UPDATE dbo.Proposals
      SET views = views + 1, status = 'viewed', last_viewed_at = SYSUTCDATETIME(), updated_at = SYSUTCDATETIME()
      WHERE id = @proposal_id;

      INSERT INTO dbo.ProposalEvents (id, proposal_id, event_type)
      VALUES (NEWID(), @proposal_id, 'view');
    `);
}
