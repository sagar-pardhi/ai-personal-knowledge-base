import { Request, Response } from "express";

import * as kbService from "./kb.service.js";

interface Params {
  id: string;
}

export async function createKbHandler(req: Request, res: Response) {
  const kb = await kbService.createKb(req.user!.id, req.body);

  res.status(201).json(kb);
}

export async function getKbsHandler(req: Request, res: Response) {
  const kbs = await kbService.getKbs(req.user!.id);

  res.json(kbs);
}

export async function getKbHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const kb = await kbService.getKb(id, req.user!.id);

  res.json(kb);
}

export async function updateKbHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const kb = await kbService.updateKb(id, req.user!.id, req.body);

  res.json(kb);
}

export async function deleteKbHandler(req: Request, res: Response) {
  const id = req.params.id as string;
  const result = await kbService.deleteKb(id, req.user!.id);

  res.json(result);
}
