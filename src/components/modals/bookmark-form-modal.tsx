import { useState, useEffect, type FormEvent } from "react";
import { useAtom } from "jotai";
import { bookmarkModalAtom } from "@/atoms/ui";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useFolders } from "@/hooks/use-folders";
import { useTags, useCreateTag } from "@/hooks/use-tags";
import { useCreateBookmark, useUpdateBookmark } from "@/hooks/use-bookmarks";
import { useFetchMetadata } from "@/hooks/use-fetch-metadata";
import { Globe, Sparkles, Star, Plus, Check } from "lucide-react";

type BookmarkForm = {
  url: string;
  title: string;
  description: string;
  favicon: string;
  imageUrl: string;
  folderId: string | null;
  selectedTagIds: string[];
  isFavorite: boolean;
};

export const BookmarkFormModal = () => {
  const [modalState, setModalState] = useAtom(bookmarkModalAtom);
  const isEdit = modalState.mode === "edit";

  const { data: folders = [] } = useFolders();
  const { data: tags = [] } = useTags();

  const createTagMutation = useCreateTag();
  const createBookmarkMutation = useCreateBookmark();
  const updateBookmarkMutation = useUpdateBookmark();
  const fetchMetadataMutation = useFetchMetadata();

  const [form, setForm] = useState<BookmarkForm>({
    url: "",
    title: "",
    description: "",
    favicon: "",
    imageUrl: "",
    folderId: null,
    selectedTagIds: [],
    isFavorite: false,
  });
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState("");

  const {
    url,
    title,
    description,
    favicon,
    imageUrl,
    folderId,
    selectedTagIds,
    isFavorite,
  } = form;

  const updateForm = <K extends keyof BookmarkForm>(
    field: K,
    value: BookmarkForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (modalState.isOpen) {
      if (isEdit && modalState.bookmark) {
        const b = modalState.bookmark;
        setForm({
          url: b.url,
          title: b.title,
          description: b.description || "",
          favicon: b.favicon || "",
          imageUrl: b.imageUrl || "",
          folderId: b.folderId || null,
          selectedTagIds: b.tagIds || [],
          isFavorite: b.isFavorite,
        });
      } else {
        setForm({
          url: "",
          title: "",
          description: "",
          favicon: "",
          imageUrl: "",
          folderId: modalState.defaultFolderId || null,
          selectedTagIds: modalState.defaultTagId
            ? [modalState.defaultTagId]
            : [],
          isFavorite: false,
        });
      }
      setNewTagName("");
      setError("");
    }
  }, [
    modalState.isOpen,
    modalState.bookmark,
    isEdit,
    modalState.defaultFolderId,
    modalState.defaultTagId,
  ]);

  const handleClose = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleFetchMetadata = async () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError("Please enter a URL first");
      return;
    }

    let validUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(validUrl)) {
      validUrl = `https://${validUrl}`;
      updateForm("url", validUrl);
    }

    try {
      setError("");
      const meta = await fetchMetadataMutation.mutateAsync(validUrl);
      if (meta.title && !title) {
        updateForm("title", meta.title);
      } else if (meta.title) {
        updateForm("title", meta.title);
      }
      if (meta.description) {
        updateForm("description", meta.description);
      }
      if (meta.favicon) {
        updateForm("favicon", meta.favicon);
      }
      if (meta.imageUrl) {
        updateForm("imageUrl", meta.imageUrl);
      }
    } catch {
      setError("Could not auto-fetch info. You can fill it manually.");
    }
  };

  const handleToggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      selectedTagIds: prev.selectedTagIds.includes(tagId)
        ? prev.selectedTagIds.filter((id) => id !== tagId)
        : [...prev.selectedTagIds, tagId],
    }));
  };

  const handleCreateNewTag = async () => {
    const cleanTag = newTagName
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-_]/g, "");
    if (!cleanTag) return;

    try {
      const created = await createTagMutation.mutateAsync({ name: cleanTag });
      if (!selectedTagIds.includes(created.id)) {
        setForm((prev) => ({
          ...prev,
          selectedTagIds: [...prev.selectedTagIds, created.id],
        }));
      }
      setNewTagName("");
    } catch (err) {
      console.error("Failed to create tag", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    let trimmedUrl = url.trim();
    const trimmedTitle = title.trim();

    if (!trimmedUrl) {
      setError("URL is required");
      return;
    }
    if (!trimmedTitle) {
      setError("Title is required");
      return;
    }

    if (!/^https?:\/\//i.test(trimmedUrl)) {
      trimmedUrl = `https://${trimmedUrl}`;
    }

    try {
      if (isEdit && modalState.bookmark) {
        await updateBookmarkMutation.mutateAsync({
          id: modalState.bookmark.id,
          data: {
            url: trimmedUrl,
            title: trimmedTitle,
            description: description.trim() || undefined,
            favicon: favicon.trim() || undefined,
            imageUrl: imageUrl.trim() || undefined,
            folderId: folderId || null,
            tagIds: selectedTagIds,
            isFavorite,
          },
        });
      } else {
        await createBookmarkMutation.mutateAsync({
          url: trimmedUrl,
          title: trimmedTitle,
          description: description.trim() || undefined,
          favicon: favicon.trim() || undefined,
          imageUrl: imageUrl.trim() || undefined,
          folderId: folderId || null,
          tagIds: selectedTagIds,
          isFavorite,
        });
      }
      handleClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save bookmark");
    }
  };

  const isSubmitting =
    createBookmarkMutation.isPending || updateBookmarkMutation.isPending;

  return (
    <Modal
      isOpen={modalState.isOpen}
      onClose={handleClose}
      title={isEdit ? "Edit Bookmark" : "Add Bookmark"}
      description="Save and organize your links with metadata, folders, and tags."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="bookmark-url"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Website URL <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                id="bookmark-url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => updateForm("url", e.target.value)}
                className="pl-9"
                required
                autoFocus={!isEdit}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleFetchMetadata}
              isLoading={fetchMetadataMutation.isPending}
              disabled={!url.trim()}
              title="Auto-fetch page title, description & favicon"
            >
              <Sparkles className="w-4 h-4 text-amber-500 mr-1" />
              Fetch info
            </Button>
          </div>
        </div>

        <div>
          <label
            htmlFor="bookmark-title"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Title <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            {favicon ? (
              <img
                src={favicon}
                alt=""
                className="w-5 h-5 rounded shrink-0 object-contain"
                onError={() => updateForm("favicon", "")}
              />
            ) : null}
            <Input
              id="bookmark-title"
              placeholder="Bookmark title"
              value={title}
              onChange={(e) => updateForm("title", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="bookmark-desc"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description
          </label>
          <Textarea
            id="bookmark-desc"
            placeholder="Short notes or description about this bookmark"
            value={description}
            onChange={(e) => updateForm("description", e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <label
            htmlFor="bookmark-folder"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Folder
          </label>
          <select
            id="bookmark-folder"
            value={folderId || ""}
            onChange={(e) => updateForm("folderId", e.target.value || null)}
            className="flex h-9 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">(No folder - Unassigned)</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2 min-h-8 p-2 bg-slate-50 border border-slate-200 rounded-lg">
            {tags.length === 0 ? (
              <span className="text-xs text-slate-400">
                No tags available yet. Create one below.
              </span>
            ) : (
              tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.id)}
                    className="cursor-pointer"
                  >
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className={
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                          : "hover:bg-slate-100"
                      }
                    >
                      {isSelected && <Check className="w-3 h-3 mr-1" />}#
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
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateNewTag();
                }
              }}
              className="text-xs h-8"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCreateNewTag}
              disabled={!newTagName.trim() || createTagMutation.isPending}
            >
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-slate-700">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => updateForm("isFavorite", e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <Star
              className={`w-4 h-4 ${
                isFavorite ? "text-amber-400 fill-amber-400" : "text-slate-400"
              }`}
            />
            Mark as favorite
          </label>
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEdit ? "Save Changes" : "Create Bookmark"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
