import { Request, Response } from "express";

import { chatWithKnowledgeBase } from "../../retrieval/chat.service.js";

import { streamChat } from "../../retrieval/chat-stream.service.js";
import { chatSchema } from "./chat.schema.js";

export async function chatHandler(req: Request, res: Response) {
  const { knowledgeBaseId, question } = chatSchema.parse(req.body);

  const response = await chatWithKnowledgeBase(knowledgeBaseId, question);

  res.json(response);
}

export async function streamChatHandler(req: Request, res: Response) {
  const { knowledgeBaseId, question } = chatSchema.parse(req.body);

  const { stream, sources } = await streamChat(knowledgeBaseId, question);

  res.setHeader("Content-Type", "text/event-stream");

  res.setHeader("Cache-Control", "no-cache");

  res.setHeader("Connection", "keep-alive");

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content;

    if (!token) {
      continue;
    }

    res.write(
      `data: ${JSON.stringify({
        token,
      })}\n\n`,
    );
  }

  res.write(`event: sources\n`);

  res.write(`data: ${JSON.stringify(sources)}\n\n`);

  res.write("event: done\n");

  res.write("data: {}\n\n");

  res.end();
}
