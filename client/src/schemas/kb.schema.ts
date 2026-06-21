import { z } from "zod";

export const createKbSchema = z.object({
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
});

export type CreateKbFormValues = z.infer<typeof createKbSchema>;
