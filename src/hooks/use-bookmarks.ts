import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookmarksApi, type BookmarkFilters } from '@/api/bookmarks'
import type { CreateBookmarkInput, UpdateBookmarkInput } from '@/types'

export const BOOKMARKS_QUERY_KEY = ['bookmarks']

export function useBookmarks(filters?: BookmarkFilters) {
  return useQuery({
    queryKey: [...BOOKMARKS_QUERY_KEY, filters ?? {}],
    queryFn: () => bookmarksApi.getAll(filters),
  })
}

export function useCreateBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateBookmarkInput) => bookmarksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY })
    },
  })
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookmarkInput }) =>
      bookmarksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY })
    },
  })
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bookmarksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY })
    },
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      bookmarksApi.update(id, { isFavorite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKMARKS_QUERY_KEY })
    },
  })
}
