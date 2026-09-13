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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
        <div className="flex items-center gap-2">
          <TagIcon className="w-5 h-5 text-indigo-500 stroke-2" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              Tags
            </h2>
          </div>
        </div>

        <Button
          onClick={() => setTagModal({ isOpen: true, mode: "create" })}
          className="gap-1 h-fit py-1 pl-2 pr-2.5"
        >
          <Plus className="w-4 h-4" />
          New Tag
        </Button>
      </div>

      {tags.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
            <TagIcon className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-medium text-slate-800">No tags yet</h3>
          <p className="mt-1 text-sm text-slate-500 max-w-sm">
            Create a tag to start organizing your bookmarks.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setTagModal({ isOpen: true, mode: "create" })}
            className="mt-4"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Tag
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="group relative flex items-center gap-3 px-4 py-2 hover:bg-slate-50/80 transition-colors"
            >
              <Link
                to={`/tags/${tag.id}`}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="min-w-0 flex gap-1 items-center">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {tag.name}
                  </p>
                </div>
              </Link>

              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                <button
                  onClick={() =>
                    setTagModal({ isOpen: true, mode: "edit", tag })
                  }
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  title="Edit tag"
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
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete tag"
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
