import { prisma } from "../lib/prisma.js";

import { getCollection } from "./chroma.service.js";

import { createQueryEmbedding } from "./query-embedding.js";

export interface RetrievedChunk {
  id: string;
  content: string;
  distance: number;
  documentId: string;
  documentName: string;
  knowledgeBaseId: string;
  chunkIndex: number;
}

export async function retrieveChunks(
  knowledgeBaseId: string,
  question: string,
  limit = 5,
): Promise<RetrievedChunk[]> {
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

  if (ids.length === 0) {
    return [];
  }

  const dbChunks = await prisma.documentChunk.findMany({
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

  const chunkMap = new Map(dbChunks.map((chunk) => [chunk.id, chunk]));

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
    .filter((chunk): chunk is RetrievedChunk => chunk !== null);
}

export async function expandChunks(
  chunks: RetrievedChunk[],
): Promise<RetrievedChunk[]> {
  if (chunks.length === 0) {
    return [];
  }

  const expanded = await prisma.documentChunk.findMany({
    where: {
      OR: chunks.flatMap((chunk) => [
        {
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex - 1,
        },
        {
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex,
        },
        {
          documentId: chunk.documentId,
          chunkIndex: chunk.chunkIndex + 1,
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

  const unique = new Map<string, RetrievedChunk>();

  for (const chunk of expanded) {
    unique.set(chunk.id, {
      id: chunk.id,
      content: chunk.content,
      distance: 0,
      documentId: chunk.document.id,
      documentName: chunk.document.name,
      knowledgeBaseId: chunks[0].knowledgeBaseId,
      chunkIndex: chunk.chunkIndex,
    });
  }

  return Array.from(unique.values());
}
