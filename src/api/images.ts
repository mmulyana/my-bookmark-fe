import { apiClient, ApiError } from "./client";
import type {
  Image,
  UpdateImageInput,
  UploadImagesResult,
} from "@/types";

export interface ImageFilters {
  tagIds?: string[];
  hasTags?: boolean;
}

export interface ImagePageParams extends ImageFilters {
  lastId?: string;
  perPage?: number;
}

export const UPLOAD_BATCH_SIZE = 20;

function buildQueryString(params: ImagePageParams): string {
  const qs = new URLSearchParams();
  if (params.tagIds?.length) qs.set("tagIds", params.tagIds.join(","));
  if (params.hasTags !== undefined) qs.set("hasTags", String(params.hasTags));
  if (params.lastId) qs.set("last_id", params.lastId);
  if (params.perPage !== undefined) qs.set("per_page", String(params.perPage));
  const str = qs.toString();
  return str ? `?${str}` : "";
}

async function uploadBatch(files: File[]): Promise<UploadImagesResult> {
  const body = new FormData();
  for (const file of files) body.append("files", file);
  try {
    return await apiClient<UploadImagesResult>("/images", {
      method: "POST",
      body,
    });
  } catch (err) {
    if (err instanceof ApiError && err.status === 422 && err.data) {
      return err.data as UploadImagesResult;
    }
    throw err;
  }
}

export const imagesApi = {
  getAll: (params: ImagePageParams = {}) =>
    apiClient<Image[]>(`/images${buildQueryString(params)}`),

  upload: async (files: File[]): Promise<UploadImagesResult> => {
    const result: UploadImagesResult = { images: [], failed: [] };
    for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
      try {
        const batch = await uploadBatch(files.slice(i, i + UPLOAD_BATCH_SIZE));
        result.images.push(...batch.images);
        result.failed.push(...batch.failed);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        for (const f of files.slice(i, i + UPLOAD_BATCH_SIZE)) {
          result.failed.push({ name: f.name, message });
        }
      }
    }
    return result;
  },

  update: (id: string, data: UpdateImageInput) =>
    apiClient<Image>(`/images/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiClient<{ success: boolean }>(`/images/${id}`, { method: "DELETE" }),
};
