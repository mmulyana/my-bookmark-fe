import { useMemo, useCallback, type FC } from "react";
import { useParams } from "react-router-dom";
import { useAtom, useAtomValue } from "jotai";
import { searchQueryAtom, bookmarkViewModeAtom } from "@/atoms/ui";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useFolders } from "@/hooks/use-folders";
import { useTags } from "@/hooks/use-tags";
import { useBookmarkPageMeta } from "@/hooks/use-bookmark-page-meta";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { List, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookmarkFilters } from "@/api/bookmarks";

export type BookmarkView = "favorites" | "unsorted";

interface BookmarkListPageProps {
  view?: BookmarkView;
}

export const BookmarkListPage: FC<BookmarkListPageProps> = ({ view }) => {
  const { folderId, tagId } = useParams<{
    folderId?: string;
    tagId?: string;
  }>();
  const searchQuery = useAtomValue(searchQueryAtom);
  const [viewMode, setViewMode] = useAtom(bookmarkViewModeAtom);

  const serverFilters: BookmarkFilters | undefined =
    view === "favorites"
      ? { isFavorite: true }
      : view === "unsorted"
        ? { hasFolder: false, hasTags: false }
        : undefined;

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookmarks(serverFilters);
  const bookmarks = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);
  const loadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    }, { rootMargin: "400px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();

  const currentFolder = useMemo(
    () => folders.find((f) => f.id === folderId),
    [folders, folderId],
  );

  const currentTag = useMemo(
    () => tags.find((t) => t.id === tagId),
    [tags, tagId],
  );

  const filteredBookmarks = useMemo(() => {
    let list = [...bookmarks];

    if (folderId) {
      list = list.filter((b) => b.folderId === folderId);
    }

    if (tagId) {
      list = list.filter((b) => b.tagIds.includes(tagId));
    }

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.url.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q)),
      );
    }

    return list;
  }, [bookmarks, folderId, tagId, searchQuery]);

  const { pageTitle, PageIcon, emptyMessage } = useBookmarkPageMeta({
    folderId,
    tagId,
    view,
    currentFolder,
    currentTag,
    searchQuery,
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <h1 className="flex items-center gap-2.5 text-2xl font-semibold tracking-tight min-w-0">
          {PageIcon}
          <span className="truncate">{pageTitle}</span>
        </h1>

        <div className="flex items-center gap-0.5 bg-black/[0.05] rounded-full p-0.5 shrink-0">
          {(
            [
              ["list", List, "List view"],
              ["grid", LayoutGrid, "Grid view"],
            ] as const
          ).map(([mode, Icon, label]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              aria-label={label}
              className={cn(
                "size-7 grid place-items-center rounded-full transition-colors cursor-pointer",
                viewMode === mode
                  ? "bg-white text-ink shadow-xs"
                  : "text-muted hover:text-ink",
              )}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      <BookmarkList
        bookmarks={filteredBookmarks}
        folders={folders}
        tags={tags}
        isLoading={isLoading}
        isError={isError}
        refetch={refetch}
        emptyMessage={emptyMessage}
        currentFolderId={folderId}
        currentTagId={tagId}
        viewMode={viewMode}
      />
      <div ref={loadMoreRef} className="h-4" aria-hidden="true" />
    </div>
  );
};
