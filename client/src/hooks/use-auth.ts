import { useQuery } from "@tanstack/react-query";

import { authApi } from "../api/auth.api";

export function useAuth() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await authApi.me();

      return data;
    },

    retry: false,
  });
}
