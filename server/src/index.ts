import "dotenv/config";
import cors from "cors";
import express from "express";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes, randomUUID } from "node:crypto";
import {
  findAsset,
  findProposalByToken,
  insertProposal,
  listProposals,
  recordView,
  type ProposalRecord
} from "./repository.js";
import { openAsset, uploadAsset } from "./storage.js";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 80 * 1024 * 1024 }
});

const port = Number(process.env.PORT || 7071);
const jwtSecret = process.env.JWT_SECRET || "dev-only-change-me";
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));

function publicProposal(proposal: ProposalRecord) {
  return {
    id: proposal.id,
    publicToken: proposal.publicToken,
    clientName: proposal.clientName,
    clientRut: proposal.clientRut,
    contactName: proposal.contactName,
    contactEmail: proposal.contactEmail,
    kamName: proposal.kamName,
    opportunityNumber: proposal.opportunityNumber,
    title: proposal.title,
    status: proposal.status,
    accessType: proposal.accessType,
    format: proposal.format,
    expiresAt: proposal.expiresAt,
    createdAt: proposal.createdAt,
    views: proposal.views,
    lastViewedAt: proposal.lastViewedAt
  };
}

function expired(proposal: ProposalRecord) {
  return new Date(proposal.expiresAt).getTime() < Date.now();
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "portal-propuestas-tibox-api" });
});

app.get("/api/proposals", async (_request, response, next) => {
  try {
    const proposals = await listProposals();
    response.json(proposals.map(publicProposal));
  } catch (error) {
    next(error);
  }
});

app.post("/api/proposals", upload.single("file"), async (request, response, next) => {
  try {
    const metadata = JSON.parse(String(request.body.metadata || "{}"));
    const required = ["clientName", "contactName", "contactEmail", "kamName", "title", "expiresAt", "accessType", "format"];
    for (const key of required) {
      if (!metadata[key]) {
        response.status(400).json({ error: `Missing field: ${key}` });
        return;
      }
    }

    if (metadata.accessType === "pin" && !metadata.pin) {
      response.status(400).json({ error: "PIN is required for PIN access." });
      return;
    }

    const id = randomUUID();
    const publicToken = randomBytes(24).toString("base64url");
    const pinHash = metadata.accessType === "pin"
      ? await bcrypt.hash(String(metadata.pin), 12)
      : null;

    const proposal: ProposalRecord = {
      id,
      publicToken,
      clientName: String(metadata.clientName),
      clientRut: metadata.clientRut ? String(metadata.clientRut) : null,
      contactName: String(metadata.contactName),
      contactEmail: String(metadata.contactEmail).toLowerCase(),
      kamName: String(metadata.kamName),
      opportunityNumber: metadata.opportunityNumber ? String(metadata.opportunityNumber) : null,
      title: String(metadata.title),
      status: "draft",
      accessType: metadata.accessType,
      pinHash,
      format: metadata.format,
      expiresAt: new Date(metadata.expiresAt).toISOString(),
      createdAt: new Date().toISOString(),
      views: 0,
      lastViewedAt: null
    };

    let asset;
    if (request.file) {
      const stored = await uploadAsset(id, request.file);
      asset = {
        proposalId: id,
        storageKey: stored.storageKey,
        storageProvider: stored.storageProvider,
        originalFileName: request.file.originalname,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes
      };
    }

    await insertProposal(proposal, asset);

    response.status(201).json({
      ...publicProposal(proposal),
      privateUrl: `${corsOrigin}/p/${publicToken}`
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/proposals/:token", async (request, response, next) => {
  try {
    const proposal = await findProposalByToken(request.params.token);
    if (!proposal || proposal.status === "revoked") {
      response.sendStatus(404);
      return;
    }
    if (expired(proposal)) {
      response.status(410).json({ error: "Proposal expired." });
      return;
    }
    response.json(publicProposal(proposal));
  } catch (error) {
    next(error);
  }
});

app.post("/api/public/proposals/:token/access", async (request, response, next) => {
  try {
    const proposal = await findProposalByToken(request.params.token);
    if (!proposal || proposal.status === "revoked" || expired(proposal)) {
      response.status(404).json({ error: "Proposal not available." });
      return;
    }

    const supplied = String(request.body.value || "");
    let allowed = false;

    if (proposal.accessType === "pin" && proposal.pinHash) {
      allowed = await bcrypt.compare(supplied, proposal.pinHash);
    } else if (proposal.accessType === "otp") {
      allowed = supplied === (process.env.DEMO_OTP || "482731");
    }

    if (!allowed) {
      response.status(401).json({ error: "Invalid access code." });
      return;
    }

    await recordView(proposal.id);

    const accessToken = jwt.sign(
      { proposalId: proposal.id, proposalToken: proposal.publicToken },
      jwtSecret,
      { expiresIn: "10m", issuer: "portal-propuestas-tibox" }
    );

    response.json({ accessToken });
  } catch (error) {
    next(error);
  }
});

app.get("/api/public/proposals/:token/content", async (request, response, next) => {
  try {
    const proposal = await findProposalByToken(request.params.token);
    if (!proposal || expired(proposal)) {
      response.sendStatus(404);
      return;
    }

    const accessToken = String(request.query.access_token || "");
    const payload = jwt.verify(accessToken, jwtSecret, {
      issuer: "portal-propuestas-tibox"
    }) as jwt.JwtPayload;

    if (payload.proposalId !== proposal.id || payload.proposalToken !== proposal.publicToken) {
      response.sendStatus(403);
      return;
    }

    const asset = await findAsset(proposal.id);
    if (!asset) {
      response.status(404).json({ error: "Proposal asset not found." });
      return;
    }

    response.setHeader("Content-Type", asset.mimeType || "application/octet-stream");
    response.setHeader("Content-Disposition", `inline; filename="${asset.originalFileName.replaceAll('"', "")}"`);
    response.setHeader("Cache-Control", "private, no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");

    if (asset.mimeType === "text/html") {
      response.setHeader(
        "Content-Security-Policy",
        "default-src 'none'; img-src data: blob: https:; media-src data: blob: https:; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src data: https://fonts.gstatic.com; script-src 'unsafe-inline'; frame-src https:; connect-src 'none';"
      );
    }

    const stream = await openAsset(asset.storageKey, asset.storageProvider);
    stream.on("error", next);
    stream.pipe(response);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error(error);
  response.status(500).json({ error: "Unexpected server error." });
});

app.listen(port, () => {
  console.log(`Portal de Propuestas API listening on http://localhost:${port}`);
});
