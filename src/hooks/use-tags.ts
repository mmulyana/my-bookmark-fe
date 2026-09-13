import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "@/api/tags";
import { BOOKMARKS_QUERY_KEY } from "./use-bookmarks";
import type { CreateTagInput, UpdateTagInput } from "@/types";

export const TAGS_QUERY_KEY = ["tags"];

export function useTags() {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: tagsApi.getAll,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagInput) => tagsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagInput }) =>
      tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY });
    },
  });
}
