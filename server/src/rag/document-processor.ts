import { createId } from "@paralleldrive/cuid2";

import { prisma } from "../lib/prisma.js";

import { getFileBuffer } from "../storage/r2-reader.js";

import { parseDocument } from "../parsers/parser.service.js";

import { chunkText } from "./chunker.js";

import { cleanText } from "./text-cleaner.js";

import { chunkArray } from "../utils/chunk-array.js";

import { createEmbeddings } from "./embeddings.service.js";

import { saveChunks } from "./chroma.service.js";

const EMBEDDING_BATCH_SIZE = 100;

export async function processDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new Error("Document not found");
  }

  try {
    console.log(`Processing ${document.name}`);

    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        status: "PROCESSING",
      },
    });

    const buffer = await getFileBuffer(document.storageKey);

    const extractedText = await parseDocument(document.fileType, buffer);

    const cleanedText = cleanText(extractedText);

    const chunks = chunkText(cleanedText);

    console.log(`Created ${chunks.length} chunks`);

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
          content: batch[i],
          embedding: embeddings[i],
        });

        chunkIndex++;
      }

      await prisma.documentChunk.createMany({
        data: postgresRows,
      });

      await saveChunks(chromaRows);

      console.log(`Finished batch ${batchIndex + 1}/${batches.length}`);
    }

    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    console.log(`Finished processing ${document.name}`);
  } catch (error) {
    console.error(error);

    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        status: "FAILED",
      },
    });
  }
}
