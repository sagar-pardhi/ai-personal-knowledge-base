import { GetObjectCommand } from "@aws-sdk/client-s3";

import { r2Client } from "../lib/r2.js";

import { env } from "../config/env.js";

export async function getFileBuffer(storageKey: string) {
  const response = await r2Client.send(
    new GetObjectCommand({
      Bucket: env.R2_BUCKET_NAME,

      Key: storageKey,
    }),
  );

  const bytes = await response.Body?.transformToByteArray();

  return Buffer.from(bytes!);
}
