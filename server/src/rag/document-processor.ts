import { prisma } from "../lib/prisma.js";

import { getFileBuffer } from "../storage/r2-reader.js";

import { parseDocument } from "../parsers/parser.service.js";

import { chunkText } from "./chunker.js";

export async function processDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    return;
  }

  try {
    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        status: "PROCESSING",
      },
    });

    const buffer = await getFileBuffer(document.storageKey);

    const text = await parseDocument(document.fileType, buffer);

    const chunks = chunkText(text);

    await prisma.documentChunk.createMany({
      data: chunks.map((chunk, index) => ({
        content: chunk,

        chunkIndex: index,

        documentId,
      })),
    });

    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        status: "COMPLETED",
      },
    });
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
