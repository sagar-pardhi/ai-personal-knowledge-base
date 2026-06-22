import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client } from "../lib/r2.js";
import { env } from "../config/env.js";
import { StorageProvider, UploadResult } from "./storage.service.js";
import { v4 as uuid } from "uuid";

export class R2Storage implements StorageProvider {
  async upload(file: Express.Multer.File): Promise<UploadResult> {
    const extension = file.originalname.split(".").pop();

    const storageKey = `documents/${uuid()}.${extension}`;

    try {
      await r2Client.send(
        new PutObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: storageKey,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      console.error(error);
      throw error;
    }

    return {
      storageKey,

      url: `${env.R2_PUBLIC_URL}/${storageKey}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET_NAME,

        Key: storageKey,
      }),
    );
  }
}
