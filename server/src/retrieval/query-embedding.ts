import { createEmbeddings } from "./embeddings.service.js";

export async function createQueryEmbedding(question: string) {
  const embeddings = await createEmbeddings([question]);

  return embeddings[0];
}
