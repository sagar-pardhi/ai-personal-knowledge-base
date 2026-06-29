import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import { Loader2, Bot } from "lucide-react";

interface ChatAnswerProps {
  answer: string;
  loading: boolean;
  error: string | null;
}

export function ChatAnswer({ answer, loading, error }: ChatAnswerProps) {
  function cleanMarkdown(text: string) {
    return text.replace(/^```(?:markdown)?\s*\n/i, "").replace(/\n```$/, "");
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
        {error}
      </div>
    );
  }

  if (!loading && !answer) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <Bot className="mb-4 h-12 w-12 text-muted-foreground" />

        <h3 className="text-lg font-semibold">Ask your documents anything</h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Questions are answered using the uploaded documents in this knowledge
          base.
        </p>
      </div>
    );
  }

  console.log(JSON.stringify(answer));

  return (
    <div className="rounded-lg border bg-card p-6">
      {loading && !answer && (
        <div className="mb-4 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Thinking...
        </div>
      )}

      <div className="rounded-lg border bg-card p-6 overflow-hidden">
        <article
          className="
      prose
      dark:prose-invert
      max-w-none
      wrap-break-word
      overflow-x-auto
    "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{cleanMarkdown(answer)}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
