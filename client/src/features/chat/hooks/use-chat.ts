import { useCallback, useState } from "react";

import { streamChat } from "../api/chat";

import type { ChatMessage } from "../types";

export function useChat(knowledgeBaseId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const askQuestion = useCallback(
    async (question: string) => {
      if (!question.trim()) {
        return;
      }

      setError(null);
      setLoading(true);

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      const assistantId = crypto.randomUUID();

      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        sources: [],
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);

      try {
        await streamChat({
          knowledgeBaseId,
          question,

          onToken(token) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      content: msg.content + token,
                    }
                  : msg,
              ),
            );
          },

          onSources(sources) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantId
                  ? {
                      ...msg,
                      sources,
                    }
                  : msg,
              ),
            );
          },

          onDone() {
            setLoading(false);
          },

          onError(message) {
            setLoading(false);
            setError(message);
          },
        });
      } catch (err) {
        setLoading(false);

        setError(err instanceof Error ? err.message : "Unknown error");
      }
    },
    [knowledgeBaseId],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    askQuestion,
    clearChat,
  };
}
