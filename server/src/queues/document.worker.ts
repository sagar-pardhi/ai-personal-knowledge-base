import { Worker } from "bullmq";

import { processDocument } from "../rag/document-processor.js";
import { redisClient } from "./document.queue.js";

new Worker(
  "document-processing",

  async (job) => {
    await processDocument(job.data.documentId);
  },

  {
    connection: redisClient,
    concurrency: 3,
  },
);
