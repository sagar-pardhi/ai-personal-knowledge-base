import { useEffect, useRef } from "react";
import { MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useChat } from "../hooks/use-chat";

import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";

interface ChatPanelProps {
  knowledgeBaseId: string;
}

export function ChatPanel({ knowledgeBaseId }: ChatPanelProps) {
  const { messages, loading, error, askQuestion, clearChat } =
    useChat(knowledgeBaseId);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex h-full flex-col rounded-xl border bg-background mt-5">
      {/* Header */}

      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="text-lg font-semibold">AI Assistant</h2>

          <p className="text-sm text-muted-foreground">
            Ask questions about your uploaded documents.
          </p>
        </div>

        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearChat}>
            <MessageSquarePlus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        )}
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <h3 className="text-xl font-semibold">👋 Welcome</h3>

              <p className="mt-3 text-muted-foreground">
                Ask anything about the uploaded documents.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                loading={loading && index === messages.length - 1}
              />
            ))}

            <div ref={bottomRef} />
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Input */}

      <div className="border-t p-4">
        <ChatInput loading={loading} onSubmit={askQuestion} />
      </div>
    </div>
  );
}
