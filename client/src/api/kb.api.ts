import { api } from "./axios";

export const kbApi = {
  getAll: () => api.get("/kbs"),

  getOne: (id: string) => api.get(`/kbs/${id}`),

  create: (data: { name: string; description?: string }) =>
    api.post("/kbs", data),

  delete: (id: string) => api.delete(`/kbs/${id}`),
};
