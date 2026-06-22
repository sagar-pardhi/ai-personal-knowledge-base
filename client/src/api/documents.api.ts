import { api } from "./axios";

export const documentApi = {
  getByKb: (knowledgeBaseId: string) =>
    api.get(`/documents/kb/${knowledgeBaseId}`),

  upload: (formData: FormData) => api.post("/documents/upload", formData),

  delete: (id: string) => api.delete(`/documents/${id}`),
};
