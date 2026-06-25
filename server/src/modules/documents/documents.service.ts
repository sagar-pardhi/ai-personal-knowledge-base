import { prisma } from "../../lib/prisma.js";
import { documentQueue } from "../../queues/document.queue.js";
import { processDocument } from "../../rag/document-processor.js";
import { storage } from "../../storage/index.js";

import { AppError } from "../../utils/app-error.js";

export async function uploadDocument(
  knowledgeBaseId: string,
  file: Express.Multer.File,
) {
  const uploaded = await storage.upload(file);

  const document = await prisma.document.create({
    data: {
      name: file.originalname,
      storageKey: uploaded.storageKey,
      fileUrl: uploaded.url,
      fileType: file.mimetype,
      fileSize: file.size,
      knowledgeBaseId,
    },
  });

  await documentQueue.add("process-document", {
    documentId: document.id,
  });

  return document;
}

export async function getDocuments(knowledgeBaseId: string) {
  return prisma.document.findMany({
    where: {
      knowledgeBaseId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteDocument(documentId: string) {
  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  });

  if (!document) {
    throw new AppError(404, "Document not found");
  }

  await storage.delete(document.storageKey);

  await prisma.document.delete({
    where: {
      id: documentId,
    },
  });

  return {
    success: true,
  };
}
