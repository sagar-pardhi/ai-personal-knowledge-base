import { createId } from "@paralleldrive/cuid2";

import { DocumentStatus } from "../generated/prisma/client.js";

import { prisma } from "../lib/prisma.js";

import { getFileBuffer } from "../storage/r2-reader.js";

import { parseDocument } from "../parsers/parser.service.js";

import { chunkText } from "./chunker.js";

import { cleanText } from "./text-cleaner.js";

import { createEmbeddings } from "./embeddings.service.js";

import { saveChunks } from "./chroma.service.js";

import { chunkArray } from "../utils/chunk-array.js";

import { updateDocumentStatus } from "../modules/documents/document-status.service.js";

const EMBEDDING_BATCH_SIZE = 100;

const ProcessingStage = {
  DOWNLOADING: 10,
  PARSING: 25,
  CHUNKING: 40,
  EMBEDDING: 60,
  INDEXING: 90,
  COMPLETED: 100,
  FAILED: 0,
} as const;

export async function processDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  async function updateStatus(status: DocumentStatus, progress: number) {
    await updateDocumentStatus(documentId, status, progress);
  }

  try {
    console.log(`Processing ${document.name}`);

    await updateStatus("DOWNLOADING", ProcessingStage.DOWNLOADING);

    const buffer = await getFileBuffer(document.storageKey);

    await updateStatus("PARSING", ProcessingStage.PARSING);

    const extractedText = await parseDocument(document.fileType, buffer);

    const cleanedText = cleanText(extractedText);

    await updateStatus("CHUNKING", ProcessingStage.CHUNKING);

    const chunks = await chunkText(cleanedText);

    console.log(`Created ${chunks.length} chunks`);

    await updateStatus("EMBEDDING", ProcessingStage.EMBEDDING);

    const batches = chunkArray(chunks, EMBEDDING_BATCH_SIZE);

    let chunkIndex = 0;

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      console.log(`Embedding batch ${batchIndex + 1}/${batches.length}`);

      const embeddings = await createEmbeddings(batch);

      const postgresRows = [];

      const chromaRows = [];

      for (let i = 0; i < batch.length; i++) {
        const id = createId();

        postgresRows.push({
          id,
          content: batch[i],
          chunkIndex,
          documentId,
        });

        chromaRows.push({
          id,
          documentId,
          knowledgeBaseId: document.knowledgeBaseId,
          chunkIndex,
          content: batch[i],
          embedding: embeddings[i],
        });

        chunkIndex++;
      }

      await prisma.documentChunk.createMany({
        data: postgresRows,
      });

      await updateStatus(
        "INDEXING",
        ProcessingStage.INDEXING +
          Math.round(((batchIndex + 1) / batches.length) * 25),
      );

      await saveChunks(chromaRows);

      console.log(`Finished batch ${batchIndex + 1}/${batches.length}`);
    }

    await updateStatus("COMPLETED", ProcessingStage.COMPLETED);

    console.log(`Finished processing ${document.name}`);
  } catch (error) {
    console.error("Document processing failed:", error);

    await updateStatus("FAILED", ProcessingStage.FAILED);

    throw error;
  }
}
