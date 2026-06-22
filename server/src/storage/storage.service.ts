export interface UploadResult {
  storageKey: string;
  url: string;
}

export interface StorageProvider {
  upload(file: Express.Multer.File): Promise<UploadResult>;

  delete(storageKey: string): Promise<void>;
}
