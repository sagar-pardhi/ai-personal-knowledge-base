import { Request, Response } from "express";

import { retrieveChunks } from "../../rag/retrieval.service.js";
import { getCollection } from "../../rag/chroma.service.js";
import { chromaClient } from "../../lib/chroma.js";

export async function testSearchHandler(req: Request, res: Response) {
  const { knowledgeBaseId, question } = req.body;

  //   await chromaClient.deleteCollection({
  //     name: "knowledge-base",
  //   });

  //   const collection = await getCollection();

  //   const result = await collection.get();

  //   console.log({
  //     ids: result.ids.length,
  //     documents: result.documents?.length,
  //     metadatas: result.metadatas?.length,
  //   });

  const chunks = await retrieveChunks(knowledgeBaseId, question);

  res.json(chunks);
  //   res.json({ message: "Deleted collection" });
}
