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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/90 overflow-hidden animate-pulse"
            >
              <div className="aspect-video bg-slate-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
                <div className="h-3 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-4 p-4 animate-pulse">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 w-2/3 bg-slate-200 rounded" />
              <div className="h-3 w-4/5 bg-slate-100 rounded" />
              <div className="h-3 w-1/3 bg-slate-100 rounded mt-2" />
            </div>
            <div className="w-6 h-6 rounded bg-slate-100 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-rose-100 shadow-xs">
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
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
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
          ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
          : "bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden",
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
