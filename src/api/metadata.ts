import { apiClient } from "./client";
import type { FetchMetadataResponse } from "@/types";

export const metadataApi = {
  fetchMetadata: (url: string) =>
    apiClient<FetchMetadataResponse>("/fetch-metadata", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
};
