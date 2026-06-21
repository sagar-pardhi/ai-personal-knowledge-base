import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { kbApi } from "@/api/kb.api";

export function useKbs() {
  return useQuery({
    queryKey: ["kbs"],
    queryFn: async () => {
      const { data } = await kbApi.getAll();

      return data;
    },
  });
}

export function useCreateKb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kbApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kbs"],
      });
    },
  });
}

export function useDeleteKb() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: kbApi.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["kbs"],
      });
    },
  });
}

export function useKb(id: string) {
  return useQuery({
    queryKey: ["kb", id],

    queryFn: async () => {
      const { data } = await kbApi.getOne(id);

      return data;
    },

    enabled: !!id,
  });
}
