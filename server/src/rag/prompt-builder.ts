import { RetrievedChunk } from "./retrieval.service.js";

export function buildPrompt(question: string, chunks: RetrievedChunk[]) {
  const context = chunks
    .map(
      (chunk) => `
Document: ${chunk.documentName}

Chunk ${chunk.chunkIndex}

${chunk.content}
`,
    )
    .join("\n\n---\n\n");

  return `
You are an AI assistant.

Answer ONLY using the provided context.

If the answer cannot be found,
say:

"I couldn't find that information in the uploaded documents."

Context:

${context}

Question:

${question}

Answer:
`;
}
