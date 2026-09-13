import { apiClient } from "./client";
import type {
  Bookmark,
  CreateBookmarkInput,
  UpdateBookmarkInput,
} from "@/types";

export interface BookmarkFilters {
  isFavorite?: boolean;
  hasFolder?: boolean;
  hasTags?: boolean;
}

export interface BookmarkPageParams extends BookmarkFilters {
  lastId?: string;
  perPage?: number;
}

function buildQueryString(filters?: BookmarkPageParams): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.isFavorite !== undefined)
    params.set("isFavorite", String(filters.isFavorite));
  if (filters.hasFolder !== undefined)
    params.set("hasFolder", String(filters.hasFolder));
  if (filters.hasTags !== undefined)
    params.set("hasTags", String(filters.hasTags));
  if (filters.lastId) params.set("last_id", filters.lastId);
  if (filters.perPage !== undefined) params.set("per_page", String(filters.perPage));
  if (filters.lastId) params.set("last_id", filters.lastId);
  if (filters.perPage !== undefined) params.set("per_page", String(filters.perPage));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const bookmarksApi = {
  getAll: (filters?: BookmarkPageParams) =>
    apiClient<Bookmark[]>(`/bookmarks${buildQueryString(filters)}`),
  create: (data: CreateBookmarkInput) =>
    apiClient<Bookmark>("/bookmarks", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: async (id: string, data: UpdateBookmarkInput) => {
    const { folderId, ...rest } = data;
    if (folderId === null) {
      const cleared = await apiClient<Bookmark>(`/bookmarks/${id}/folder`, {
        method: "DELETE",
      });
      if (Object.keys(rest).length === 0) {
        return cleared;
      }
      return apiClient<Bookmark>(`/bookmarks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(rest),
      });
    }
    return apiClient<Bookmark>(`/bookmarks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/bookmarks/${id}`, {
      method: "DELETE",
    }),
};
