import { chromaClient, efOpenAI } from "../lib/chroma.js";

export async function getCollection() {
  return chromaClient.getOrCreateCollection({
    name: "knowledge-base",
    embeddingFunction: efOpenAI,
  });
}

interface SaveChunksInput {
  id: string;
  content: string;
  embedding: number[];
  documentId: string;
}

export async function saveChunks(chunks: SaveChunksInput[]) {
  const collection = await getCollection();

  await collection.add({
    ids: chunks.map((c) => c.id),
    documents: chunks.map((c) => c.content),
    embeddings: chunks.map((c) => c.embedding),
    metadatas: chunks.map((c) => ({
      documentId: c.documentId,
    })),
  });
}
