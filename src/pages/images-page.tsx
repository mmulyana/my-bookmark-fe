import { useCallback, useEffect, useMemo, useRef, useState, type FC } from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { resolveApiUrl } from "@/api/client";
import { useImages, useUploadImages } from "@/hooks/use-images";
import { useTags } from "@/hooks/use-tags";
import { Button } from "@/components/ui/Button";
import { ImageDetailModal } from "@/components/images/image-detail-modal";
import {
  TagFilter,
  type TagFilterValue,
} from "@/components/images/tag-filter";
import { cn } from "@/lib/utils";
import type { UploadFailure } from "@/types";

const ACCEPT = "image/png,image/jpeg,image/gif,image/webp";

export const ImagesPage: FC = () => {
  const { data: tags = [] } = useTags();
  const [filter, setFilter] = useState<TagFilterValue>({
    tagIds: [],
    untagged: false,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [failures, setFailures] = useState<UploadFailure[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const filters = useMemo(
    () => (filter.untagged ? { hasTags: false } : { tagIds: filter.tagIds }),
    [filter],
  );
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useImages(filters);
  const upload = useUploadImages();

  const images = useMemo(() => data?.pages.flat() ?? [], [data]);
  const selected = images.find((i) => i.id === selectedId) ?? null;

  const handleFiles = useCallback(
    (files: File[]) => {
      const accepted = files.filter((f) => ACCEPT.split(",").includes(f.type));
      const rejected = files.filter((f) => !accepted.includes(f));
      setFailures(
        rejected.map((f) => ({
          name: f.name,
          message: "Unsupported type (png, jpeg, gif, webp only)",
        })),
      );
      if (accepted.length === 0) return;
      upload.mutate(accepted, {
        onSuccess: (r) => setFailures((prev) => [...prev, ...r.failed]),
      });
    },
    [upload],
  );

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length > 0) handleFiles(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  return (
    <div
      onDragOver={(e) => {
        if (!e.dataTransfer.types.includes("Files")) return;
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(Array.from(e.dataTransfer.files));
      }}
      className={cn(
        "min-h-[60vh] rounded-2xl transition-colors",
        dragging && "outline-2 outline-dashed outline-accent bg-accent/5",
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-muted" />
          <h2 className="text-2xl font-semibold tracking-tight">Images</h2>
        </div>
        <div className="flex items-center gap-2">
          <TagFilter tags={tags} value={filter} onChange={setFilter} />
          <Button
            size="sm"
            className="gap-1 rounded-full pl-2.5 pr-3.5"
            onClick={() => fileInput.current?.click()}
            isLoading={upload.isPending}
          >
            {!upload.isPending && <Upload className="w-4 h-4" />}
            Upload
          </Button>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPT}
          multiple
          hidden
          onChange={(e) => {
            handleFiles(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>

      {failures.length > 0 && (
        <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-800">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">
              {failures.length} file{failures.length > 1 ? "s" : ""} could not be uploaded
            </p>
            <button
              onClick={() => setFailures([])}
              aria-label="Dismiss"
              className="cursor-pointer text-rose-700 hover:text-rose-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="mt-1 space-y-0.5 text-xs">
            {failures.map((f, i) => (
              <li key={i} className="truncate">
                {f.name}: {f.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : isError ? (
        <p className="text-sm text-rose-600">Could not load images.</p>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-line">
          <div className="w-12 h-12 rounded-full bg-black/[0.04] flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6 text-muted" />
          </div>
          <h3 className="text-base font-medium">
            {filter.untagged || filter.tagIds.length > 0
              ? "No images match this filter"
              : "No images yet"}
          </h3>
          <p className="mt-1 text-sm text-muted max-w-sm">
            Drop files here, paste a screenshot, or use Upload.
          </p>
        </div>
      ) : (
        <>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => setSelectedId(img.id)}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border border-line bg-black/[0.04] cursor-pointer"
                style={
                  img.width && img.height
                    ? { aspectRatio: `${img.width} / ${img.height}` }
                    : undefined
                }
              >
                <img
                  src={resolveApiUrl(img.url)}
                  alt={img.name}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2.5 pb-1.5 pt-6 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {img.name}
                </span>
              </button>
            ))}
          </div>
          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Load more
              </Button>
            </div>
          )}
        </>
      )}

      <ImageDetailModal image={selected} onClose={() => setSelectedId(null)} />
    </div>
  );
};
