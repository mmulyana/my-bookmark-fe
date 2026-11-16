import { type FC } from "react";
import { Link } from "react-router-dom";
import { useSetAtom } from "jotai";
import { tagModalAtom, confirmDeleteDialogAtom } from "@/atoms/ui";
import { useTags } from "@/hooks/use-tags";
import { Button } from "@/components/ui/Button";
import { Tag as TagIcon, Plus, Pencil, Trash2 } from "lucide-react";

export const TagsPage: FC = () => {
  const { data: tags = [] } = useTags();
  const setTagModal = useSetAtom(tagModalAtom);
  const setDeleteDialog = useSetAtom(confirmDeleteDialogAtom);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <div className="flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-muted" />
          <div>
            <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
              Tags
            </h2>
          </div>
        </div>

        <Button
          onClick={() => setTagModal({ isOpen: true, mode: "create" })}
          size="sm"
          className="gap-1 rounded-full pl-2.5 pr-3.5"
        >
          <Plus className="w-4 h-4" />
          New Tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-line">
          <div className="w-12 h-12 rounded-full bg-black/[0.04] flex items-center justify-center mb-3">
            <TagIcon className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-base font-medium">No tags yet</h3>
          <p className="mt-1 text-sm text-muted max-w-sm">
            Create a tag to start organizing your bookmarks.
          </p>
          <Button
            size="sm"
            onClick={() => setTagModal({ isOpen: true, mode: "create" })}
            className="mt-4 rounded-full"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Tag
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group relative rounded-2xl border border-line bg-card hover:border-black/15 transition-colors"
            >
              <Link
                to={`/tags/${tag.id}`}
                className="flex items-center gap-3 px-4 py-4 min-w-0"
              >
                <span className="size-8 shrink-0 rounded-full bg-white ring-1 ring-black/5 shadow-xs grid place-items-center text-sm font-medium text-muted">
                  #
                </span>
                <span className="text-sm font-medium truncate">{tag.name}</span>
              </Link>

              <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 flex items-center bg-white/90 backdrop-blur rounded-lg border border-line transition-opacity">
                <button
                  onClick={() =>
                    setTagModal({ isOpen: true, mode: "edit", tag })
                  }
                  className="p-1.5 text-muted hover:text-ink rounded-md transition-colors cursor-pointer"
                  title="Edit tag"
                  aria-label="Edit tag"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() =>
                    setDeleteDialog({
                      isOpen: true,
                      type: "tag",
                      id: tag.id,
                      title: tag.name,
                    })
                  }
                  className="p-1.5 text-muted hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                  title="Delete tag"
                  aria-label="Delete tag"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
