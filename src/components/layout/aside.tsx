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
  Home,
  Plus,
  Folder as FolderIcon,
  Tag as TagIcon,
  Pencil,
  Trash2,
  LogOut,
  Star,
  Inbox,
  SquarePen,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-2.5 px-3 h-8 rounded-lg text-[13px] transition-colors cursor-pointer min-w-0",
    isActive
      ? "bg-black/[0.07] text-ink font-medium"
      : "text-ink/75 hover:bg-black/[0.04]",
  );

const NavItem = ({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}) => (
  <NavLink to={to} end={end} className={navClass}>
    <Icon className="w-4 h-4 shrink-0 text-ink/60" />
    <span className="truncate">{label}</span>
  </NavLink>
);

const SectionLabel = ({
  children,
  action,
}: {
  children: string;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-3 mb-1 h-5">
    <span className="text-[11px] font-medium text-muted">{children}</span>
    {action}
  </div>
);

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
    <aside className="w-64 bg-sidebar border-r border-line flex flex-col shrink-0 sticky top-0 h-screen">
      <div className="h-14 flex items-center justify-between gap-2 pl-4 pr-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-ink text-white flex items-center justify-center shrink-0">
            <Bookmark className="w-3 h-3 fill-white" />
          </div>
          <span className="text-[13px] font-semibold truncate">My Bookmark</span>
        </div>
        <button
          onClick={() => setBookmarkModal({ isOpen: true, mode: "create" })}
          className="size-8 rounded-full bg-white border border-line shadow-xs grid place-items-center text-ink/70 hover:text-ink transition-colors cursor-pointer"
          title="New bookmark"
          aria-label="New bookmark"
        >
          <SquarePen className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 pb-3">
        <SearchBar />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-5 scrollbar-none">
        <div className="space-y-0.5">
          <NavItem to="/" end icon={Home} label="Home" />
          <NavItem to="/bookmarks" icon={Bookmark} label="All Bookmarks" />
        </div>

        <div className="space-y-0.5">
          <SectionLabel>Pinned</SectionLabel>
          <NavItem to="/favorites" icon={Star} label="Favorites" />
          <NavItem to="/unsorted" icon={Inbox} label="Unsorted" />
          <NavItem to="/tags" icon={TagIcon} label="Tags" />
        </div>

        <div className="space-y-0.5">
          <SectionLabel
            action={
              <button
                onClick={() => setFolderModal({ isOpen: true, mode: "create" })}
                className="p-0.5 rounded text-muted hover:text-ink hover:bg-black/5 transition-colors cursor-pointer"
                title="Add new folder"
                aria-label="Add new folder"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            }
          >
            Folders
          </SectionLabel>

          {folders.length === 0 ? (
            <p className="px-3 py-1 text-xs text-muted">No folders yet</p>
          ) : (
            folders.map((folder) => (
              <div key={folder.id} className="group relative flex items-center">
                <NavLink
                  to={`/folder/${folder.id}`}
                  className={(s) => cn(navClass(s), "flex-1")}
                >
                  <FolderIcon className="w-4 h-4 shrink-0 text-ink/60" />
                  <span className="truncate">{folder.name}</span>
                </NavLink>

                <div className="absolute right-1.5 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                  <button
                    onClick={() =>
                      setFolderModal({ isOpen: true, mode: "edit", folder })
                    }
                    className="p-1 text-muted hover:text-ink rounded transition-colors cursor-pointer"
                    title="Edit folder"
                    aria-label="Edit folder"
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
                    className="p-1 text-muted hover:text-rose-600 rounded transition-colors cursor-pointer"
                    title="Delete folder"
                    aria-label="Delete folder"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </nav>

      <div className="p-3 border-t border-line">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 h-8 rounded-lg text-[13px] text-ink/65 hover:bg-black/[0.04] hover:text-rose-600 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
};
