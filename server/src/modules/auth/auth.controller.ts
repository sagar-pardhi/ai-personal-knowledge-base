import { Request, Response } from "express";

import * as authService from "./auth.service.js";

export async function registerHandler(req: Request, res: Response) {
  const user = await authService.register(req.body);

  res.status(201).json(user);
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body);

  res.json(result);
}

export async function meHandler(req: Request, res: Response) {
  const user = await authService.getCurrentUser(req.user!.id);

  res.json(user);
}
