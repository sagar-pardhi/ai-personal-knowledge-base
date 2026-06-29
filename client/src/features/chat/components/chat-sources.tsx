import { FileText } from "lucide-react";

import type { ChatSource } from "../types";

interface ChatSourcesProps {
  sources: ChatSource[];
}

function formatChunks(chunks?: number[]) {
  if (!chunks || chunks.length === 0) {
    return "";
  }

  if (chunks.length === 1) {
    return `Chunk ${chunks[0]}`;
  }

  const sorted = [...chunks].sort((a, b) => a - b);

  return `Chunks ${sorted[0]}-${sorted[sorted.length - 1]}`;
}

export function ChatSources({ sources }: ChatSourcesProps) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground">Sources</h4>

      <div className="space-y-2">
        {sources.map((source) => (
          <div
            key={`${source.documentId}-${(source.chunks || []).join("-")}`}
            className="flex items-start gap-3 rounded-lg border p-3"
          >
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{source.documentName}</p>

              {source.chunks && source.chunks.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatChunks(source.chunks)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
