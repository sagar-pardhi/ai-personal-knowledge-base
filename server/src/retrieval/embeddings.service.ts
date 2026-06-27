import { openai } from "../lib/openai.js";

export async function createEmbeddings(texts: string[]) {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}
