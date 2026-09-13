import { NavLink, useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai";
import {
  bookmarkModalAtom,
  folderModalAtom,
  confirmDeleteDialogAtom,
} from "@/atoms/ui";
import { isAuthenticatedAtom } from "@/atoms/auth";
import { clearTokens } from "@/lib/auth-storage";
import { useFolders } from "@/hooks/use-folders";
import { SearchBar } from "@/components/bookmarks/search";
import {
  Bookmark,
  Plus,
  Folder as FolderIcon,
  Tag as TagIcon,
  Pencil,
  Trash2,
  LogOut,
  Star,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export const Aside = () => {
  const { data: folders = [] } = useFolders();

  const setBookmarkModal = useSetAtom(bookmarkModalAtom);
  const setFolderModal = useSetAtom(folderModalAtom);
  const setDeleteDialog = useSetAtom(confirmDeleteDialogAtom);
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-slate-300/10 border-r border-slate-200 flex flex-col shrink-0 sticky top-0 h-screen">
      <div className="h-14 flex items-center gap-2 px-4 shrink-0">
        <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
          <Bookmark className="w-3.5 h-3.5 fill-white" />
        </div>
        <span className="text-sm font-normal text-slate-900">My Bookmark</span>
      </div>

      <div className="px-4 pb-2 space-y-2.5">
        <SearchBar />
        <Button
          size="sm"
          onClick={() => setBookmarkModal({ isOpen: true, mode: "create" })}
          className="w-full gap-2 shadow-sm font-normal"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Bookmark
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        <div>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal transition-colors cursor-pointer",
                isActive
                  ? "bg-slate-100 text-slate-900 font-normal"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <Bookmark className="w-4 h-4" />
            <span>All Bookmarks</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal transition-colors cursor-pointer",
                isActive
                  ? "bg-slate-100 text-slate-900 font-normal"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </NavLink>

          <NavLink
            to="/unsorted"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal transition-colors cursor-pointer",
                isActive
                  ? "bg-slate-100 text-slate-900 font-normal"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <Inbox className="w-4 h-4" />
            <span>Unsorted</span>
          </NavLink>

          <NavLink
            to="/tags"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-normal transition-colors cursor-pointer",
                isActive
                  ? "bg-slate-100 text-slate-900 font-normal"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )
            }
          >
            <TagIcon className="w-4 h-4" />
            <span>Tags</span>
          </NavLink>
        </div>

        <div>
          <div className="flex items-center justify-between px-3 mb-1.5">
            <span className="text-xs font-normal text-slate-400 uppercase tracking-wider">
              Folders
            </span>
            <button
              onClick={() => setFolderModal({ isOpen: true, mode: "create" })}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Add new folder"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5">
            {folders.length === 0 ? (
              <p className="px-3 py-1.5 text-xs text-slate-400 italic">
                No folders yet
              </p>
            ) : (
              folders.map((folder) => (
                <div
                  key={folder.id}
                  className="group flex items-center justify-between rounded-lg hover:bg-slate-50"
                >
                  <NavLink
                    to={`/folder/${folder.id}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm flex-1 truncate transition-colors cursor-pointer",
                        isActive
                          ? "bg-slate-100 text-slate-900 font-normal"
                          : "text-slate-600 group-hover:text-slate-900",
                      )
                    }
                  >
                    <FolderIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{folder.name}</span>
                  </NavLink>

                  <div className="opacity-0 group-hover:opacity-100 flex items-center pr-2 gap-0.5 shrink-0 transition-opacity">
                    <button
                      onClick={() =>
                        setFolderModal({ isOpen: true, mode: "edit", folder })
                      }
                      className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                      title="Edit folder"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteDialog({
                          isOpen: true,
                          type: "folder",
                          id: folder.id,
                          title: folder.name,
                        })
                      }
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete folder"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </nav>

      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Log out
        </button>
      </div>
    </aside>
  );
};
