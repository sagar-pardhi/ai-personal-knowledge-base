import { Worker } from "bullmq";

import { processDocument } from "../rag/document-processor.js";
import { redisClient } from "./connection.js";

export const worker = new Worker(
  "document-processing",

  async (job) => {
    console.log(`Starting job ${job.id}`);

    const start = Date.now();

    await processDocument(job.data.documentId);

    console.log(`Finished job ${job.id} in ${Date.now() - start}ms`);
  },

  {
    connection: redisClient,

    concurrency: 3,
  },
);

async function shutdown() {
  console.log("Stopping worker...");

  await worker.close();

  process.exit(0);
}

process.on("SIGINT", shutdown);

process.on("SIGTERM", shutdown);
