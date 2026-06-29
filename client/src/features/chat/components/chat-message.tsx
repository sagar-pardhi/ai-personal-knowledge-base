import type { ChatMessage } from "../types";

import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";

interface ChatMessageProps {
  message: ChatMessage;

  loading: boolean;
}

export function ChatMessage({ message, loading }: ChatMessageProps) {
  if (message.role === "user") {
    return <UserMessage content={message.content} />;
  }

  return (
    <AssistantMessage
      content={message.content}
      loading={loading}
      sources={message.sources}
    />
  );
}
