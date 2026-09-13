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
import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import {
  Star,
  ExternalLink,
  Pencil,
  Trash2,
  Folder as FolderIcon,
  Globe,
} from "lucide-react";

interface BookmarkCardProps {
  bookmark: Bookmark;
  folder?: Folder;
  tags: Tag[];
  viewMode?: BookmarkViewMode;
}

export const BookmarkCard = ({
  bookmark,
  folder,
  tags,
  viewMode = "list",
}: BookmarkCardProps) => {
  const setBookmarkModal = useSetAtom(bookmarkModalAtom);
  const setDeleteDialog = useSetAtom(confirmDeleteDialogAtom);
  const toggleFavoriteMutation = useToggleFavorite();
  const [imgError, setImgError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const handleToggleFavorite = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteMutation.mutate({
      id: bookmark.id,
      isFavorite: !bookmark.isFavorite,
    });
  };

  const handleEdit = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkModal({
      isOpen: true,
      mode: "edit",
      bookmark,
    });
  };

  const handleDelete = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialog({
      isOpen: true,
      type: "bookmark",
      id: bookmark.id,
      title: bookmark.title,
    });
  };

  let hostname = bookmark.url;
  try {
    hostname = new URL(bookmark.url).hostname.replace(/^www\./, "");
  } catch {}

  const formattedDate = formatDate(bookmark.createdAt);

  const thumbnail = (className: string, iconSize: string) => (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${className} overflow-hidden border-b border-slate-200/80 bg-slate-50 flex items-center justify-center cursor-pointer group/thumb`}
    >
      {bookmark.imageUrl && !imgError ? (
        <img
          src={bookmark.imageUrl}
          alt=""
          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
          onError={() => setImgError(true)}
        />
      ) : bookmark.favicon && !faviconError ? (
        <img
          src={bookmark.favicon}
          alt=""
          className={`${iconSize} object-contain`}
          onError={() => setFaviconError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
          <Globe className="w-6 h-6" />
        </div>
      )}
    </a>
  );

  if (viewMode === "grid") {
    return (
      <div className="group relative flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden hover:border-slate-300 transition-colors">
        {thumbnail("w-full aspect-video shrink-0", "w-8 h-8")}

        <div className="flex-1 min-w-0 p-3">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
            title={bookmark.title}
          >
            {bookmark.title}
          </a>

          {bookmark.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {bookmark.description}
            </p>
          )}

          <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-slate-400">
            <span className="font-mono truncate">{hostname}</span>
          </div>

          {(folder || tags.length > 0) && (
            <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
              {folder && (
                <Link to={`/folder/${folder.id}`}>
                  <Badge
                    variant="folder"
                    className="text-[10px] py-0 px-1.5 hover:bg-amber-100"
                  >
                    <FolderIcon className="w-2.5 h-2.5 mr-1 opacity-70" />
                    {folder.name}
                  </Badge>
                </Link>
              )}
              {tags.map((tag) => (
                <Link key={tag.id} to={`/tags/${tag.id}`}>
                  <Badge
                    variant="tag"
                    className="text-[10px] py-0 px-1.5 hover:bg-indigo-100"
                  >
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-lg border border-slate-200/80">
          <button
            onClick={handleToggleFavorite}
            aria-label={
              bookmark.isFavorite ? "Remove from favorites" : "Mark as favorite"
            }
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                bookmark.isFavorite ? "text-amber-400 fill-amber-400" : ""
              }`}
            />
          </button>
          <button
            onClick={handleEdit}
            aria-label="Edit bookmark"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            aria-label="Delete bookmark"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex items-start gap-4 p-4 hover:bg-slate-50/80 transition-colors">
      {thumbnail(
        "shrink-0 w-16 h-16 sm:w-18 sm:h-18 rounded-lg shadow-2xs",
        "w-7 h-7",
      )}

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-1.5">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 inline-flex items-center gap-1"
            title={bookmark.title}
          >
            <span>{bookmark.title}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </a>
        </div>

        {bookmark.description && (
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {bookmark.description}
          </p>
        )}

        <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-slate-400">
          <span className="font-mono text-slate-400">{hostname}</span>

          {formattedDate && (
            <>
              <span className="text-slate-300">·</span>
              <span>{formattedDate}</span>
            </>
          )}

          {folder && (
            <>
              <span className="text-slate-300">·</span>
              <Link to={`/folder/${folder.id}`}>
                <Badge
                  variant="folder"
                  className="text-[10px] py-0 px-1.5 hover:bg-amber-100"
                >
                  <FolderIcon className="w-2.5 h-2.5 mr-1 opacity-70" />
                  {folder.name}
                </Badge>
              </Link>
            </>
          )}

          {tags.map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.id}`}>
              <Badge
                variant="tag"
                className="text-[10px] py-0 px-1.5 hover:bg-indigo-100"
              >
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 pt-0.5">
        <button
          onClick={handleToggleFavorite}
          aria-label={
            bookmark.isFavorite ? "Remove from favorites" : "Mark as favorite"
          }
          className="p-1.5 rounded-lg text-slate-300 hover:text-amber-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Star
            className={cn(
              "w-4 h-4 transition-transform active:scale-125",
              bookmark.isFavorite
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300 hover:text-amber-400",
            )}
          />
        </button>
        <button
          onClick={handleEdit}
          aria-label="Edit bookmark"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleDelete}
          aria-label="Delete bookmark"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
