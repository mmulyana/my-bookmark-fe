import { useEffect, useState, type FC } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Check, Trash2, X } from "lucide-react";
import { confirmDeleteDialogAtom } from "@/atoms/ui";
import { resolveApiUrl } from "@/api/client";
import { useCreateTag, useTags } from "@/hooks/use-tags";
import { useUpdateImage } from "@/hooks/use-images";
import { ZoomableImage } from "./zoomable-image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import type { Image } from "@/types";

const formatSize = (bytes: number) =>
  bytes >= 1 << 20
    ? `${(bytes / (1 << 20)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

interface Props {
  image: Image | null;
  onClose: () => void;
}

export const ImageDetailModal: FC<Props> = ({ image, onClose }) => {
  const { data: tags = [] } = useTags();
  const createTag = useCreateTag();
  const updateImage = useUpdateImage();
  const setDeleteDialog = useSetAtom(confirmDeleteDialogAtom);
  const deleteDialogOpen = useAtomValue(confirmDeleteDialogAtom).isOpen;

  const [name, setName] = useState("");
  const [newTag, setNewTag] = useState("");

  const imageId = image?.id;
  const imageName = image?.name;
  useEffect(() => {
    setName(imageName ?? "");
    setNewTag("");
  }, [imageId, imageName]);

  const isOpen = image !== null;
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !deleteDialogOpen) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, deleteDialogOpen, onClose]);

  if (!image) return null;

  const setTagIds = (tagIds: string[]) =>
    updateImage.mutate({ id: image.id, data: { tagIds } });

  const toggleTag = (tagId: string) =>
    setTagIds(
      image.tagIds.includes(tagId)
        ? image.tagIds.filter((id) => id !== tagId)
        : [...image.tagIds, tagId],
    );

  const saveName = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setName(image.name);
      return;
    }
    if (trimmed !== image.name) {
      updateImage.mutate({ id: image.id, data: { name: trimmed } });
    }
  };

  const addNewTag = async () => {
    const clean = newTag.trim().toLowerCase().replace(/^#/, "");
    if (!clean) return;
    try {
      const created = await createTag.mutateAsync({ name: clean });
      if (!image.tagIds.includes(created.id)) {
        setTagIds([...image.tagIds, created.id]);
      }
      setNewTag("");
    } catch (err) {
      console.error("Failed to create tag", err);
    }
  };

  const dimensions =
    image.width && image.height ? `${image.width} × ${image.height} · ` : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={image.name}
        className="relative z-10 flex max-h-[90vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl md:flex-row"
      >
        <div className="min-w-0 md:flex-1">
          <ZoomableImage
            key={image.id}
            src={resolveApiUrl(image.url)}
            alt={image.name}
          />
        </div>

        <div className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto p-5 md:w-80">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
                aria-label="Image name"
              />
              <p className="mt-1.5 text-xs text-muted">
                {dimensions}
                {formatSize(image.sizeBytes)} · {formatDate(image.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 min-h-8 p-2 bg-slate-50 border border-slate-200 rounded-lg">
              {tags.length === 0 ? (
                <span className="text-xs text-slate-400">
                  No tags yet. Create one below.
                </span>
              ) : (
                tags.map((tag) => {
                  const selected = image.tagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className="cursor-pointer"
                    >
                      <Badge
                        variant={selected ? "default" : "outline"}
                        className={
                          selected
                            ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                            : "hover:bg-slate-100"
                        }
                      >
                        {selected && <Check className="w-3 h-3 mr-1" />}#
                        {tag.name}
                      </Badge>
                    </button>
                  );
                })
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Create new tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addNewTag();
                  }
                }}
                className="text-xs h-8"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewTag}
                isLoading={createTag.isPending}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>
            {updateImage.isError && (
              <p className="mt-2 text-xs text-rose-600">
                {updateImage.error.message}
              </p>
            )}
          </div>

          <div className="mt-auto flex justify-end">
            <Button
              variant="ghost"
              className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
              onClick={() => {
                setDeleteDialog({
                  isOpen: true,
                  type: "image",
                  id: image.id,
                  title: image.name,
                });
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
