import { ContextBlock } from "./context-builder.js";

export function buildSources(blocks: ContextBlock[]) {
  return blocks.map((block) => ({
    documentId: block.documentId,

    documentName: block.documentName,

    chunks: block.chunks,

    relevanceScore: 1,
  }));
}
