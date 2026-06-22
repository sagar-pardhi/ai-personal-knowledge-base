import { Request, Response } from "express";

import * as documentService from "./documents.service.js";

export async function uploadDocumentHandler(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      message: "File is required",
    });
  }

  const document = await documentService.uploadDocument(
    req.body.knowledgeBaseId,
    req.file,
  );

  res.status(201).json(document);
}

export async function getDocumentsHandler(req: Request, res: Response) {
  const documents = await documentService.getDocuments(
    req.params.kbId as string,
  );

  res.json(documents);
}

export async function deleteDocumentHandler(req: Request, res: Response) {
  const result = await documentService.deleteDocument(req.params.id as string);

  res.json(result);
}
