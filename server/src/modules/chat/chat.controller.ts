import { Request, Response } from "express";

import { chatWithKnowledgeBase } from "../../rag/chat.service.js";

export async function chatHandler(req: Request, res: Response) {
  const { knowledgeBaseId, question } = req.body;

  const response = await chatWithKnowledgeBase(knowledgeBaseId, question);

  res.json(response);
}
