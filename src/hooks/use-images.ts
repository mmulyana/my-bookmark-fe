import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { imagesApi, type ImageFilters } from "@/api/images";
import type { Image, UpdateImageInput } from "@/types";

export const IMAGES_QUERY_KEY = ["images"];
const PER_PAGE = 40;

export function useImages(filters: ImageFilters = {}) {
  return useInfiniteQuery({
    queryKey: [...IMAGES_QUERY_KEY, filters],
    queryFn: ({ pageParam }) =>
      imagesApi.getAll({ ...filters, lastId: pageParam, perPage: PER_PAGE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.length < PER_PAGE ? undefined : lastPage[lastPage.length - 1]?.id,
  });
}

export function useUploadImages() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => imagesApi.upload(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY });
    },
  });
}

export function useUpdateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateImageInput }) =>
      imagesApi.update(id, data),
    onSuccess: (updated) => {
      queryClient.setQueriesData<InfiniteData<Image[]>>(
        { queryKey: IMAGES_QUERY_KEY },
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) =>
              page.map((img) => (img.id === updated.id ? updated : img)),
            ),
          },
      );
    },
  });
}

export function useDeleteImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => imagesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: IMAGES_QUERY_KEY });
    },
  });
}
