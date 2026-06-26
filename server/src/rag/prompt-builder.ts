import { ContextBlock } from "./context-builder.js";

export function buildPrompt(question: string, context: ContextBlock[]) {
  const formattedContext = context
    .map(
      (block) => `
Document: ${block.documentName}

Chunks: ${block.startChunk}-${block.endChunk}

${block.content}
`,
    )
    .join("\n\n----------------------\n\n");

  return `
You are an AI assistant.

You answer ONLY using the supplied context.

Rules:

- Never invent information.
- If the answer cannot be found in the context, say:
  "I couldn't find that information in the uploaded documents."

- Be concise.
- Use Markdown.
- If multiple documents support the answer, combine the information.

=========================

CONTEXT

${formattedContext}

=========================

QUESTION

${question}

=========================

ANSWER
`;
}
