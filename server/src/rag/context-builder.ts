import { RetrievedChunk } from "./retrieval.service.js";

export interface ContextBlock {
  documentId: string;
  documentName: string;

  startChunk: number;
  endChunk: number;

  content: string;
}

export function buildContextBlocks(chunks: RetrievedChunk[]): ContextBlock[] {
  if (chunks.length === 0) {
    return [];
  }

  const sorted = [...chunks].sort((a, b) => {
    if (a.documentId === b.documentId) {
      return a.chunkIndex - b.chunkIndex;
    }

    return a.documentId.localeCompare(b.documentId);
  });

  const blocks: ContextBlock[] = [];

  let current: ContextBlock = {
    documentId: sorted[0].documentId,
    documentName: sorted[0].documentName,
    startChunk: sorted[0].chunkIndex,
    endChunk: sorted[0].chunkIndex,
    content: sorted[0].content,
  };

  for (let i = 1; i < sorted.length; i++) {
    const chunk = sorted[i];

    const isSameDocument = chunk.documentId === current.documentId;

    const isNeighbor = chunk.chunkIndex === current.endChunk + 1;

    if (isSameDocument && isNeighbor) {
      current.endChunk = chunk.chunkIndex;

      current.content += "\n\n" + chunk.content;
    } else {
      blocks.push(current);

      current = {
        documentId: chunk.documentId,
        documentName: chunk.documentName,
        startChunk: chunk.chunkIndex,
        endChunk: chunk.chunkIndex,
        content: chunk.content,
      };
    }
  }

  blocks.push(current);

  return blocks;
}
