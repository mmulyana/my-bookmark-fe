import { useMemo, type FC, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import { Clock, Pin, Search, SquarePen } from "lucide-react";
import { bookmarkModalAtom } from "@/atoms/ui";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useFolders } from "@/hooks/use-folders";
import { useTags } from "@/hooks/use-tags";
import { BookmarkCard } from "@/components/bookmarks/bookmark-card";
import type { Bookmark } from "@/types";

function greeting(date: Date) {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const Section: FC<{
  icon: typeof Clock;
  title: string;
  to?: string;
  children: ReactNode;
}> = ({ icon: Icon, title, to, children }) => (
  <section className="mt-12">
    <div className="flex items-center justify-between mb-3">
      <h2 className="flex items-center gap-1.5 text-xs font-medium text-muted">
        <Icon className="w-3.5 h-3.5" />
        {title}
      </h2>
      {to && (
        <Link to={to} className="text-xs text-muted hover:text-ink">
          See all
        </Link>
      )}
    </div>
    {children}
  </section>
);

const CardSkeleton = () => (
  <div className="h-[212px] rounded-2xl border border-line bg-card animate-pulse" />
);

export const HomePage: FC = () => {
  const setBookmarkModal = useSetAtom(bookmarkModalAtom);
  const now = useMemo(() => new Date(), []);

  const recent = useBookmarks();
  const favorites = useBookmarks({ isFavorite: true });
  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();

  const folderMap = useMemo(
    () => new Map(folders.map((f) => [f.id, f])),
    [folders],
  );
  const tagMap = useMemo(() => new Map(tags.map((t) => [t.id, t])), [tags]);

  const recentItems = recent.data?.pages[0]?.slice(0, 8) ?? [];
  const favoriteItems = favorites.data?.pages[0]?.slice(0, 8) ?? [];

  const renderCard = (b: Bookmark) => (
    <BookmarkCard
      key={b.id}
      bookmark={b}
      folder={b.folderId ? folderMap.get(b.folderId) : undefined}
      tags={b.tagIds.map((id) => tagMap.get(id)).filter((t) => !!t)}
      viewMode="grid"
    />
  );

  const grid = (loading: boolean, items: Bookmark[], empty: string) => {
    if (loading)
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    if (items.length === 0)
      return <p className="text-sm text-muted py-6">{empty}</p>;
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(renderCard)}
      </div>
    );
  };

  return (
    <div>
      <p className="text-xs font-medium tracking-wider text-muted uppercase">
        {now.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </p>
      <h1 className="mt-2 text-[32px] leading-tight font-semibold tracking-tight">
        {greeting(now)}
      </h1>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setBookmarkModal({ isOpen: true, mode: "create" })}
          className="h-8 pl-3 pr-3.5 rounded-full bg-accent text-white text-xs font-medium inline-flex items-center gap-1.5 hover:bg-blue-600 transition-colors cursor-pointer"
        >
          <SquarePen className="w-3.5 h-3.5" />
          New Bookmark
        </button>
        <button
          onClick={() => document.getElementById("global-search")?.focus()}
          className="h-8 pl-3 pr-3.5 rounded-full bg-card border border-line text-xs font-medium inline-flex items-center gap-1.5 hover:bg-black/[0.04] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </div>

      <Section icon={Clock} title="Jump back in" to="/bookmarks">
        {grid(recent.isLoading, recentItems, "Belum ada bookmark. Tambahkan yang pertama.")}
      </Section>

      <Section icon={Pin} title="Pinned" to="/favorites">
        {grid(
          favorites.isLoading,
          favoriteItems,
          "Tandai bookmark dengan bintang untuk menyematkannya di sini.",
        )}
      </Section>
    </div>
  );
};
