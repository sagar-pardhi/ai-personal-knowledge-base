import { openai } from "../lib/openai.js";

import { vectorSearch } from "./vector-search.service.js";

import { expandSearchResults } from "./context-expansion.service.js";

import { buildContextBlocks } from "./context-builder.js";

import { buildMessages } from "./prompt-builder.js";

export async function streamChat(knowledgeBaseId: string, question: string) {
  const search = await vectorSearch(knowledgeBaseId, question);

  if (!search.length) {
    throw new Error("No relevant context found.");
  }

  const expanded = await expandSearchResults(search);

  const context = buildContextBlocks(expanded);

  const messages = buildMessages(question, context);

  const stream = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    temperature: 0,

    stream: true,

    messages,
  });

  return {
    stream,

    sources: context.map((block) => ({
      documentId: block.documentId,

      documentName: block.documentName,

      startChunk: block.startChunk,

      endChunk: block.endChunk,
    })),
  };
}
