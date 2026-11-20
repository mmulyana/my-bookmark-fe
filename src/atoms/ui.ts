import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Bookmark, Folder, Tag } from "@/types";

export type BookmarkViewMode = "list" | "grid";

export interface BookmarkModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  bookmark?: Bookmark;
  defaultFolderId?: string | null;
  defaultTagId?: string;
}

export interface FolderModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  folder?: Folder;
}

export interface TagModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  tag?: Tag;
}

export interface ConfirmDeleteState {
  isOpen: boolean;
  type: "bookmark" | "folder" | "tag";
  id: string;
  title: string;
}

export const mobileNavOpenAtom = atom<boolean>(false);

export const searchQueryAtom = atom<string>("");

export const bookmarkViewModeAtom = atomWithStorage<BookmarkViewMode>(
  "bookmarkViewMode",
  "list",
);

export const bookmarkModalAtom = atom<BookmarkModalState>({
  isOpen: false,
  mode: "create",
});

export const folderModalAtom = atom<FolderModalState>({
  isOpen: false,
  mode: "create",
});

export const tagModalAtom = atom<TagModalState>({
  isOpen: false,
  mode: "create",
});

export const confirmDeleteDialogAtom = atom<ConfirmDeleteState>({
  isOpen: false,
  type: "bookmark",
  id: "",
  title: "",
});
