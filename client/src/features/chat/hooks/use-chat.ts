import { useCallback, useState } from "react";

import { streamChat } from "../api/chat";

import type { ChatSource } from "../types";

export function useChat(knowledgeBaseId: string) {
  const [answer, setAnswer] = useState("");

  const [sources, setSources] = useState<ChatSource[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setAnswer("");
    setSources([]);
    setError(null);
  }, []);

  const askQuestion = useCallback(
    async (question: string) => {
      if (!question.trim()) {
        return;
      }

      reset();

      setLoading(true);

      await streamChat({
        knowledgeBaseId,

        question,

        onToken(token) {
          setAnswer((prev) => prev + token);
        },

        onSources(receivedSources) {
          setSources(receivedSources);
        },

        onDone() {
          setLoading(false);
        },

        onError(message) {
          setLoading(false);

          setError(message);
        },
      });
    },
    [knowledgeBaseId, reset],
  );

  return {
    answer,
    sources,
    loading,
    error,

    askQuestion,

    reset,
  };
}
