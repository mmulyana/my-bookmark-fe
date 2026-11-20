import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import {
  bookmarkModalAtom,
  confirmDeleteDialogAtom,
  type BookmarkViewMode,
} from "@/atoms/ui";
import type { Bookmark, Folder, Tag } from "@/types";
import { useToggleFavorite } from "@/hooks/use-bookmarks";
import { cn, coverGradient, getHostname, timeAgo } from "@/lib/utils";
import { Star, Pencil, Trash2, Globe } from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  folder?: Folder;
  tags: Tag[];
  viewMode?: BookmarkViewMode;
  className?: string;
}

export const BookmarkCard = ({
  bookmark,
  folder,
  tags,
  viewMode = "grid",
  className,
}: BookmarkCardProps) => {
  const setBookmarkModal = useSetAtom(bookmarkModalAtom);
  const setDeleteDialog = useSetAtom(confirmDeleteDialogAtom);
  const toggleFavoriteMutation = useToggleFavorite();
  const [imgError, setImgError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const hostname = getHostname(bookmark.url);

  const stop = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleToggleFavorite = (e: MouseEvent) => {
    stop(e);
    toggleFavoriteMutation.mutate({
      id: bookmark.id,
      isFavorite: !bookmark.isFavorite,
    });
  };

  const handleEdit = (e: MouseEvent) => {
    stop(e);
    setBookmarkModal({ isOpen: true, mode: "edit", bookmark });
  };

  const handleDelete = (e: MouseEvent) => {
    stop(e);
    setDeleteDialog({
      isOpen: true,
      type: "bookmark",
      id: bookmark.id,
      title: bookmark.title,
    });
  };

  const favicon =
    bookmark.favicon && !faviconError ? (
      <img
        src={bookmark.favicon}
        alt=""
        className="w-full h-full object-contain"
        onError={() => setFaviconError(true)}
      />
    ) : (
      <Globe className="w-3.5 h-3.5 text-muted" />
    );

  const actions = (
    <>
      <button
        onClick={handleToggleFavorite}
        aria-label={
          bookmark.isFavorite ? "Remove from favorites" : "Mark as favorite"
        }
        className="p-1.5 rounded-md text-muted hover:text-amber-500 hover:bg-black/5 transition-colors cursor-pointer"
      >
        <Star
          className={cn(
            "w-3.5 h-3.5",
            bookmark.isFavorite && "text-amber-400 fill-amber-400",
          )}
        />
      </button>
      <button
        onClick={handleEdit}
        aria-label="Edit bookmark"
        className="p-1.5 rounded-md text-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleDelete}
        aria-label="Delete bookmark"
        className="p-1.5 rounded-md text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </>
  );

  if (viewMode === "grid") {
    return (
      <div
        className={cn(
          "group relative flex flex-col rounded-2xl border border-line bg-card overflow-hidden hover:border-black/15 transition-colors",
          className,
        )}
      >
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-[76px] shrink-0 overflow-hidden"
          style={
            bookmark.imageUrl && !imgError
              ? undefined
              : { background: coverGradient(hostname) }
          }
          tabIndex={-1}
          aria-hidden="true"
        >
          {bookmark.imageUrl && !imgError && (
            <img
              src={bookmark.imageUrl}
              alt=""
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </a>

        <div className="absolute top-2 right-2 flex items-center bg-white/90 backdrop-blur rounded-lg border border-line md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          {actions}
        </div>

        <span className="absolute left-4 top-[62px] size-7 rounded-full bg-white ring-1 ring-black/5 shadow-xs p-1.5 grid place-items-center overflow-hidden">
          {favicon}
        </span>

        <div className="flex-1 min-w-0 px-4 pt-6 pb-3.5 flex flex-col">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            title={bookmark.title}
            className="text-sm font-semibold leading-snug line-clamp-2 hover:underline underline-offset-2"
          >
            {bookmark.title}
          </a>
          <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {bookmark.description || hostname}
          </p>
          <div className="mt-auto pt-3 flex items-center gap-1.5 text-[11px] text-muted min-w-0">
            <span className="shrink-0">{timeAgo(bookmark.createdAt)}</span>
            {folder && (
              <>
                <span>·</span>
                <Link
                  to={`/folder/${folder.id}`}
                  className="truncate hover:text-ink"
                >
                  {folder.name}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl hover:bg-black/[0.035] transition-colors",
        className,
      )}
    >
      <span className="size-9 shrink-0 rounded-lg bg-white ring-1 ring-black/5 grid place-items-center p-2 overflow-hidden">
        {favicon}
      </span>

      <div className="flex-1 min-w-0">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          title={bookmark.title}
          className="block text-sm font-medium truncate hover:underline underline-offset-2"
        >
          {bookmark.title}
        </a>
        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted min-w-0">
          <span className="truncate">{hostname}</span>
          <span>·</span>
          <span className="shrink-0">{timeAgo(bookmark.createdAt)}</span>
          {folder && (
            <>
              <span>·</span>
              <Link
                to={`/folder/${folder.id}`}
                className="truncate hover:text-ink"
              >
                {folder.name}
              </Link>
            </>
          )}
          {tags.map((tag) => (
            <Link
              key={tag.id}
              to={`/tags/${tag.id}`}
              className="shrink-0 hover:text-ink"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "flex items-center shrink-0 transition-opacity",
          !bookmark.isFavorite && "md:opacity-0 md:group-hover:opacity-100",
        )}
      >
        {actions}
      </div>
    </div>
  );
};
