import type { Bookmark, Folder, Tag } from "@/types";
import type { BookmarkViewMode } from "@/atoms/ui";
import { BookmarkCard } from "./bookmark-card";
import { BookmarkX, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSetAtom } from "jotai";
import { bookmarkModalAtom } from "@/atoms/ui";
import { cn } from "@/lib/utils";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  folders: Folder[];
  tags: Tag[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  emptyMessage?: string;
  currentFolderId?: string;
  currentTagId?: string;
  viewMode?: BookmarkViewMode;
}

export const BookmarkList = ({
  bookmarks,
  folders,
  tags,
  isLoading,
  isError,
  refetch,
  emptyMessage = "No bookmarks found.",
  currentFolderId,
  currentTagId,
  viewMode = "list",
}: BookmarkListProps) => {
  const setBookmarkModal = useSetAtom(bookmarkModalAtom);

  if (isLoading) {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-line bg-card overflow-hidden animate-pulse"
            >
              <div className="h-[76px] bg-black/5" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-2/3 bg-black/5 rounded" />
                <div className="h-3 w-1/2 bg-black/[0.04] rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3.5 px-3 py-2.5 animate-pulse">
            <div className="size-9 rounded-lg bg-black/5 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/2 bg-black/5 rounded" />
              <div className="h-3 w-1/3 bg-black/[0.04] rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-rose-100">
        <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
        <h3 className="text-base font-semibold text-slate-800">
          Failed to load bookmarks
        </h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          Something went wrong while communicating with the data store.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="mt-4"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-line">
        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
          <BookmarkX className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-base font-medium text-slate-800">{emptyMessage}</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          Add your first bookmark to this collection to keep track of
          interesting sites.
        </p>
        <Button
          variant="primary"
          size="sm"
          onClick={() =>
            setBookmarkModal({
              isOpen: true,
              mode: "create",
              defaultFolderId: currentFolderId,
              defaultTagId: currentTagId,
            })
          }
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Bookmark
        </Button>
      </div>
    );
  }

  const folderMap = new Map(folders.map((f) => [f.id, f]));
  const tagMap = new Map(tags.map((t) => [t.id, t]));

  return (
    <div
      className={cn(
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-0.5",
      )}
    >
      {bookmarks.map((b) => {
        const bookmarkFolder = b.folderId
          ? folderMap.get(b.folderId)
          : undefined;
        const bookmarkTags = b.tagIds
          .map((tId) => tagMap.get(tId))
          .filter((t): t is Tag => Boolean(t));

        return (
          <BookmarkCard
            key={b.id}
            bookmark={b}
            folder={bookmarkFolder}
            tags={bookmarkTags}
            viewMode={viewMode}
          />
        );
      })}
    </div>
  );
};
