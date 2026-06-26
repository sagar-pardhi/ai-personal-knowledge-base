import { openai } from "../lib/openai.js";

import { retrieveChunks, expandChunks } from "./retrieval.service.js";

import { buildContextBlocks } from "./context-builder.js";

import { buildPrompt } from "./prompt-builder.js";

export async function chatWithKnowledgeBase(
  knowledgeBaseId: string,
  question: string,
) {
  const retrieved = await retrieveChunks(knowledgeBaseId, question);

  if (retrieved.length === 0) {
    return {
      answer:
        "I couldn't find any relevant information in the uploaded documents.",
      sources: [],
    };
  }

  const expanded = await expandChunks(retrieved);

  const context = buildContextBlocks(expanded);

  const prompt = buildPrompt(question, context);

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    temperature: 0,

    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return {
    answer: completion.choices[0].message.content ?? "",

    sources: context.map((block) => ({
      documentId: block.documentId,

      documentName: block.documentName,

      startChunk: block.startChunk,

      endChunk: block.endChunk,
    })),
  };
}
