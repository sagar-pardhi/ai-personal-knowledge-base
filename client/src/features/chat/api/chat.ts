import type { ChatSource } from "../types";

interface StreamChatOptions {
  knowledgeBaseId: string;
  question: string;

  onToken(token: string): void;

  onSources(sources: ChatSource[]): void;

  onDone(): void;

  onError(error: string): void;
}

export async function streamChat({
  knowledgeBaseId,
  question,
  onToken,
  onSources,
  onDone,
}: StreamChatOptions) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/chat/stream`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        knowledgeBaseId,
        question,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to start chat");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, {
      stream: true,
    });

    const events = buffer.split("\n\n");

    buffer = events.pop() ?? "";

    for (const event of events) {
      let eventType = "message";

      let data = "";

      for (const line of event.split("\n")) {
        if (line.startsWith("event:")) {
          eventType = line.replace("event:", "").trim();
        }

        if (line.startsWith("data:")) {
          data += line.replace("data:", "");
        }
      }

      if (!data) {
        continue;
      }

      switch (eventType) {
        case "message": {
          const parsed = JSON.parse(data);

          onToken(parsed.token);

          break;
        }

        case "sources":
          onSources(JSON.parse(data));
          break;

        case "done":
          onDone();
          break;
      }
    }
  }
}
