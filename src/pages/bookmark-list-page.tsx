import { useMemo, type FC } from "react";
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
    data: bookmarks = [],
    isLoading,
    isError,
    refetch,
  } = useBookmarks(serverFilters);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-2">
          {PageIcon}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              {pageTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-0.5 bg-slate-100 rounded-lg p-0.5 self-start">
          <button
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              viewMode === "list"
                ? "bg-white text-slate-900"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={cn(
              "p-1.5 rounded-md transition-colors cursor-pointer",
              viewMode === "grid"
                ? "bg-white text-slate-900"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
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
    </div>
  );
};
