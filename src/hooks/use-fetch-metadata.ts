import { useMutation } from '@tanstack/react-query'
import { metadataApi } from '@/api/metadata'
import type { FetchMetadataResponse } from '@/types'

export function useFetchMetadata() {
  return useMutation<FetchMetadataResponse, Error, string>({
    mutationFn: (url: string) => metadataApi.fetchMetadata(url),
  })
}
