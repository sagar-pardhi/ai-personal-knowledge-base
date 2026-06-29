import { Bot } from "lucide-react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { ChatSources } from "./chat-sources";

import type { ChatSource } from "../types";
import { cleanMarkdown } from "@/lib/utils";

interface AssistantMessageProps {
  content: string;
  loading?: boolean;
  sources?: ChatSource[];
}

export function AssistantMessage({
  content,
  loading = false,
  sources = [],
}: AssistantMessageProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        <Bot className="h-5 w-5" />
      </div>

      <div className="flex-1 rounded-xl border bg-card p-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {cleanMarkdown(content)}
        </ReactMarkdown>

        {loading && (
          <span className="ml-1 inline-block h-5 w-2 animate-pulse rounded bg-primary" />
        )}

        {sources.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <ChatSources sources={sources} />
          </div>
        )}
      </div>
    </div>
  );
}
