import { useState } from "react";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  loading: boolean;
  onSubmit: (question: string) => Promise<void> | void;
}

export function ChatInput({ loading, onSubmit }: ChatInputProps) {
  const [question, setQuestion] = useState("");

  async function handleSubmit() {
    const value = question.trim();

    if (!value || loading) {
      return;
    }

    await onSubmit(value);

    setQuestion("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      handleSubmit();
    }
  }

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Ask anything about your uploaded documents..."
        value={question}
        disabled={loading}
        rows={4}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Ask
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
