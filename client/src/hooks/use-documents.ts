import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { documentApi } from "@/api/documents.api";

export function useDocuments(knowledgeBaseId: string) {
  return useQuery({
    queryKey: ["documents", knowledgeBaseId],

    queryFn: async () => {
      const { data } = await documentApi.getByKb(knowledgeBaseId);

      return data;
    },

    enabled: !!knowledgeBaseId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentApi.upload,

    onSuccess: (_, formData) => {
      const kbId = formData.get("knowledgeBaseId") as string;

      queryClient.invalidateQueries({
        queryKey: ["documents", kbId],
      });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
    },
  });
}
