import { prisma } from "../lib/prisma.js";

import { SearchResult } from "./vector-search.service.js";

export interface ExpandedChunk {
  id: string;

  content: string;

  documentId: string;

  documentName: string;

  knowledgeBaseId: string;

  chunkIndex: number;
}

export async function expandSearchResults(
  results: SearchResult[],
): Promise<ExpandedChunk[]> {
  if (!results.length) {
    return [];
  }

  const expanded = await prisma.documentChunk.findMany({
    where: {
      OR: results.flatMap((result) => [
        {
          documentId: result.documentId,

          chunkIndex: result.chunkIndex - 1,
        },

        {
          documentId: result.documentId,

          chunkIndex: result.chunkIndex,
        },

        {
          documentId: result.documentId,

          chunkIndex: result.chunkIndex + 1,
        },
      ]),
    },

    include: {
      document: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: [
      {
        documentId: "asc",
      },
      {
        chunkIndex: "asc",
      },
    ],
  });

  const unique = new Map<string, ExpandedChunk>();

  for (const chunk of expanded) {
    unique.set(chunk.id, {
      id: chunk.id,

      content: chunk.content,

      documentId: chunk.document.id,

      documentName: chunk.document.name,

      knowledgeBaseId: results[0].knowledgeBaseId,

      chunkIndex: chunk.chunkIndex,
    });
  }

  return Array.from(unique.values());
}
