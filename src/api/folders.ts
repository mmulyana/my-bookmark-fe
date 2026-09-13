import { apiClient } from "./client";
import type { Folder, CreateFolderInput, UpdateFolderInput } from "@/types";

export const foldersApi = {
  getAll: () => apiClient<Folder[]>("/folders"),
  create: (data: CreateFolderInput) =>
    apiClient<Folder>("/folders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: UpdateFolderInput) =>
    apiClient<Folder>(`/folders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/folders/${id}`, {
      method: "DELETE",
    }),
};
