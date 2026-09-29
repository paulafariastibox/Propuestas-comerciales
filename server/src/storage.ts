import { BlobServiceClient } from "@azure/storage-blob";
import { createReadStream, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import type { Readable } from "node:stream";

export interface StoredAsset {
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  storageProvider: "azure-blob" | "local";
}

const containerName = process.env.AZURE_STORAGE_CONTAINER || "propuestas";

function blobConfigured() {
  return Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING);
}

export async function uploadAsset(
  proposalId: string,
  file: Express.Multer.File
): Promise<StoredAsset> {
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storageKey = `${proposalId}/${Date.now()}-${safeName}`;

  if (blobConfigured()) {
    const service = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );
    const container = service.getContainerClient(containerName);
    await container.createIfNotExists();
    const blob = container.getBlockBlobClient(storageKey);
    await blob.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype }
    });
    return {
      storageKey,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageProvider: "azure-blob"
    };
  }

  const root = process.env.LOCAL_UPLOAD_DIR || "./uploads";
  const fullPath = normalize(join(root, storageKey));
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, file.buffer);

  return {
    storageKey,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    storageProvider: "local"
  };
}

export async function openAsset(
  storageKey: string,
  storageProvider: "azure-blob" | "local"
): Promise<Readable> {
  if (storageProvider === "azure-blob") {
    const service = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING!
    );
    const response = await service
      .getContainerClient(containerName)
      .getBlobClient(storageKey)
      .download();
    if (!response.readableStreamBody) throw new Error("Blob stream not available.");
    return response.readableStreamBody;
  }

  const root = process.env.LOCAL_UPLOAD_DIR || "./uploads";
  return createReadStream(normalize(join(root, storageKey)));
}
