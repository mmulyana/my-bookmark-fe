import { useMemo } from "react";
import {
  Folder as FolderIcon,
  Inbox,
  Star,
  Tag as TagIcon,
} from "lucide-react";

interface BookmarkPageMetaParams {
  folderId?: string;
  tagId?: string;
  view?: "favorites" | "unsorted";
  currentFolder?: { name: string };
  currentTag?: { name: string };
  searchQuery: string;
}

export function useBookmarkPageMeta({
  folderId,
  tagId,
  view,
  currentFolder,
  currentTag,
  searchQuery,
}: BookmarkPageMetaParams) {
  return useMemo(() => {
    let pageMeta;

    switch (true) {
      case Boolean(folderId):
        pageMeta = {
          pageTitle: currentFolder?.name ?? "Folder",
          PageIcon: <FolderIcon className="w-6 h-6 text-amber-500" />,
          emptyMessage: currentFolder
            ? `No bookmarks in folder "${currentFolder.name}"`
            : "Folder is empty.",
        };
        break;

      case Boolean(tagId):
        pageMeta = {
          pageTitle: currentTag ? `#${currentTag.name}` : "Tag",
          PageIcon: <TagIcon className="w-5 h-5 text-indigo-500" />,
          emptyMessage: currentTag
            ? `No bookmarks with tag #${currentTag.name}`
            : "Tag has no bookmarks.",
        };
        break;

      case view === "favorites":
        pageMeta = {
          pageTitle: "Favorites",
          PageIcon: <Star className="w-5 h-5 text-amber-500" />,
          emptyMessage: "No favorite bookmarks yet.",
        };
        break;

      case view === "unsorted":
        pageMeta = {
          pageTitle: "Unsorted",
          PageIcon: <Inbox className="w-5 h-5 text-slate-400" />,
          emptyMessage: "Every bookmark has a folder or a tag.",
        };
        break;

      default:
        pageMeta = {
          pageTitle: "All Bookmarks",
          PageIcon: null,
          emptyMessage: "No bookmarks saved yet.",
        };
    }

    return {
      ...pageMeta,
      emptyMessage: searchQuery
        ? `No bookmarks match "${searchQuery}"`
        : pageMeta.emptyMessage,
    };
  }, [currentFolder, currentTag, folderId, searchQuery, tagId, view]);
}
