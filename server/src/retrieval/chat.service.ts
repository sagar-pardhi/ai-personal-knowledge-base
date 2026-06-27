import { openai } from "../lib/openai.js";

import { vectorSearch } from "./vector-search.service.js";

import { expandSearchResults } from "./context-expansion.service.js";

import { buildContextBlocks } from "./context-builder.js";

import { buildMessages } from "./prompt-builder.js";

export interface ChatResponse {
  answer: string;

  sources: {
    documentId: string;
    documentName: string;
    startChunk: number;
    endChunk: number;
  }[];
}

export async function chatWithKnowledgeBase(
  knowledgeBaseId: string,
  question: string,
): Promise<ChatResponse> {
  // Step 1
  const searchResults = await vectorSearch(knowledgeBaseId, question);

  if (searchResults.length === 0) {
    return {
      answer:
        "I couldn't find any relevant information in the uploaded documents.",
      sources: [],
    };
  }

  // Step 2
  const expandedChunks = await expandSearchResults(searchResults);

  // Step 3
  const contextBlocks = buildContextBlocks(expandedChunks);

  // Step 4
  const messages = buildMessages(question, contextBlocks);

  // Step 5
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",

    temperature: 0,

    messages,
  });

  return {
    answer: completion.choices[0].message.content ?? "",

    sources: contextBlocks.map((block) => ({
      documentId: block.documentId,

      documentName: block.documentName,

      startChunk: block.startChunk,

      endChunk: block.endChunk,
    })),
  };
}
