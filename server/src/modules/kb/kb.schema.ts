import { z } from "zod";

export const createKbSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export const updateKbSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
});

export type CreateKbInput = z.infer<typeof createKbSchema>;

export type UpdateKbInput = z.infer<typeof updateKbSchema>;
