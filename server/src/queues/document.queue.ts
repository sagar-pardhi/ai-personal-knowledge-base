import { Queue } from "bullmq";
import { redisClient } from "./connection.js";

export interface DocumentJobData {
  documentId: string;
}

export const documentQueue = new Queue<DocumentJobData>("document-processing", {
  connection: redisClient,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: 1000,

    removeOnFail: 500,
  },
});

export async function enqueueDocumentProcessing(documentId: string) {
  return documentQueue.add("process-document", {
    documentId,
  });
}
