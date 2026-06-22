import { prisma } from "../../lib/prisma.js";

import { LocalStorage } from "../../storage/local-storage.js";
import { AppError } from "../../utils/app-error.js";

const storage = new LocalStorage();

export async function uploadDocument(
  knowledgeBaseId: string,
  file: Express.Multer.File,
) {
  const uploaded = await storage.upload(file);

  return prisma.document.create({
    data: {
      name: file.originalname,

      storageKey: uploaded.storageKey,

      fileUrl: uploaded.url,

      fileType: file.mimetype,

      fileSize: file.size,

      knowledgeBaseId,
    },
  });
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
