import { createNodeRedisClient, Queue } from "bullmq";

import { client } from "./connection.js";

export const redisClient = createNodeRedisClient(client);

export interface DocumentJob {
  documentId: string;
}

export const documentQueue = new Queue<DocumentJob>("document-processing", {
  connection: redisClient,
});
