import { apiClient } from "./client";
import type { Tag, CreateTagInput, UpdateTagInput } from "@/types";

export const tagsApi = {
  getAll: () => apiClient<Tag[]>("/tags"),
  create: (data: CreateTagInput) =>
    apiClient<Tag>("/tags", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateTagInput) =>
    apiClient<Tag>(`/tags/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/tags/${id}`, {
      method: "DELETE",
    }),
};
