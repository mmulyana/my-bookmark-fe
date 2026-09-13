import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { foldersApi } from '@/api/folders'
import { BOOKMARKS_QUERY_KEY } from './use-bookmarks'
import type { CreateFolderInput, UpdateFolderInput } from '@/types'

export const FOLDERS_QUERY_KEY = ['folders']

export function useFolders() {
  return useQuery({
    queryKey: FOLDERS_QUERY_KEY,
    queryFn: foldersApi.getAll,
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateFolderInput) => foldersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY })
    },
  })
}

export function useUpdateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFolderInput }) =>
      foldersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY })
    },
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => foldersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY })
    },
  })
}
