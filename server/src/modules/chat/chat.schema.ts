import { z } from "zod";

export const chatSchema = z.object({
  knowledgeBaseId: z.string().trim().min(1, "Knowledge Base ID is required"),

  question: z
    .string()
    .trim()
    .min(1, "Question is required")
    .max(5000, "Question is too long"),
});

export type ChatDto = z.infer<typeof chatSchema>;
