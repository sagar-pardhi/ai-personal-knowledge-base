import { prisma } from "../../lib/prisma.js";
import { DocumentStatus } from "../../generated/prisma/client.js";

export async function updateDocumentStatus(
  documentId: string,
  status: DocumentStatus,
  progress: number,
) {
  return prisma.document.update({
    where: {
      id: documentId,
    },
    data: {
      status,
      processingProgress: progress,
    },
  });
}
