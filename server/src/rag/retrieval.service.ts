import { createQueryEmbedding } from "./query-embedding.js";

import { getCollection } from "./chroma.service.js";

export interface RetrievedChunk {
  id: string;
  documentId: string;
  knowledgeBaseId: string;
  chunkIndex: number;
  content: string;
  distance: number;
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

  const docs = result.documents?.[0] ?? [];

  const distances = result.distances?.[0] ?? [];

  const metadata = result.metadatas?.[0] ?? [];

  return ids.map((id, index) => ({
    id,

    content: docs[index] as string,

    distance: distances[index] ?? 0,

    documentId: metadata[index]?.documentId as string,

    knowledgeBaseId: metadata[index]?.knowledgeBaseId as string,

    chunkIndex: metadata[index]?.chunkIndex as number,
  }));
}
