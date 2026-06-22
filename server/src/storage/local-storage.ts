import fs from "fs/promises";
import path from "path";

import { StorageProvider, UploadResult } from "./storage.service.js";

export class LocalStorage implements StorageProvider {
  async upload(file: Express.Multer.File): Promise<UploadResult> {
    const storageKey = `${Date.now()}-${file.originalname}`;

    const uploadPath = path.join("uploads", storageKey);

    await fs.writeFile(uploadPath, file.buffer);

    return {
      storageKey,
      url: uploadPath,
    };
  }

  async delete(storageKey: string) {
    await fs.unlink(path.join("uploads", storageKey));
  }
}
