import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

import { ContextBlock } from "./context-builder.js";

export function buildMessages(
  question: string,
  contextBlocks: ContextBlock[],
): ChatCompletionMessageParam[] {
  const context = contextBlocks
    .map((block) => {
      const chunkLabel =
        block.startChunk === block.endChunk
          ? `Chunk ${block.startChunk}`
          : `Chunks ${block.startChunk}-${block.endChunk}`;

      return `
Document: ${block.documentName}
${chunkLabel}

${block.content}
`;
    })
    .join("\n\n====================\n\n");

  return [
    {
      role: "system",
      content: `
You are an AI assistant that answers questions using ONLY the supplied context.

Rules:

- Answer ONLY from the provided context.
- Never invent facts.
- If the answer is not present in the context, respond exactly with:

"I couldn't find that information in the uploaded documents."

- Keep answers clear and concise.
- Format answers using Markdown.
- Do not mention internal chunk numbers unless explicitly asked.
- When the answer is based on multiple documents, combine the information naturally.
`,
    },

    {
      role: "user",
      content: `
Context:

${context}

Question:

${question}
`,
    },
  ];
}
