import { prisma } from "../lib/prisma.js";

import { getCollection } from "../rag/chroma.service.js";

import { createQueryEmbedding } from "./query-embedding.js";

export interface SearchResult {
  id: string;
  content: string;
  distance: number;

  documentId: string;
  documentName: string;

  knowledgeBaseId: string;

  chunkIndex: number;
}

export async function vectorSearch(
  knowledgeBaseId: string,
  question: string,
  limit = 5,
): Promise<SearchResult[]> {
  const embedding = await createQueryEmbedding(question);

  const collection = await getCollection();

  const result = await collection.query({
    queryEmbeddings: [embedding],

    nResults: limit,

    where: {
      knowledgeBaseId,
    },
  });

  const ids = result.ids[0] ?? [];

  const distances = result.distances?.[0] ?? [];

  if (!ids.length) {
    return [];
  }

  const chunks = await prisma.documentChunk.findMany({
    where: {
      id: {
        in: ids,
      },
    },

    include: {
      document: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const chunkMap = new Map(chunks.map((chunk) => [chunk.id, chunk]));

  return ids
    .map((id, index) => {
      const chunk = chunkMap.get(id);

      if (!chunk) {
        return null;
      }

      return {
        id,

        content: chunk.content,

        distance: distances[index],

        documentId: chunk.document.id,

        documentName: chunk.document.name,

        knowledgeBaseId,

        chunkIndex: chunk.chunkIndex,
      };
    })
    .filter((chunk): chunk is SearchResult => chunk !== null);
}
