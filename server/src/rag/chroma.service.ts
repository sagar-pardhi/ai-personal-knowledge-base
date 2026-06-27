import { chromaClient, efOpenAI } from "../lib/chroma.js";

export interface ChromaChunk {
  id: string;
  content: string;
  embedding: number[];
  documentId: string;
  knowledgeBaseId: string;
  chunkIndex: number;
}

export async function getCollection() {
  return chromaClient.getOrCreateCollection({
    name: "knowledge-base",
    embeddingFunction: efOpenAI,
  });
}

export async function saveChunks(chunks: ChromaChunk[]) {
  const collection = await getCollection();

  await collection.add({
    ids: chunks.map((c) => c.id),

    documents: chunks.map((c) => c.content),

    embeddings: chunks.map((c) => c.embedding),

    metadatas: chunks.map((c) => ({
      documentId: c.documentId,

      knowledgeBaseId: c.knowledgeBaseId,

      chunkIndex: c.chunkIndex,
    })),
  });
}
