import { useEffect, useRef, useState, type FC } from "react";
import { Check, ChevronDown, Tag as TagIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tag } from "@/types";

export interface TagFilterValue {
  tagIds: string[];
  untagged: boolean;
}

interface Props {
  tags: Tag[];
  value: TagFilterValue;
  onChange: (value: TagFilterValue) => void;
}

export const TagFilter: FC<Props> = ({ tags, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const count = value.untagged ? 1 : value.tagIds.length;

  const toggleTag = (id: string) =>
    onChange({
      untagged: false,
      tagIds: value.tagIds.includes(id)
        ? value.tagIds.filter((t) => t !== id)
        : [...value.tagIds, id],
    });

  const row = (active: boolean) =>
    cn(
      "flex w-full items-center gap-2 rounded-lg px-2.5 h-8 text-left text-[13px] cursor-pointer transition-colors",
      active ? "bg-black/[0.06] font-medium" : "hover:bg-black/[0.04]",
    );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-full border bg-white px-3 text-xs font-medium cursor-pointer transition-colors",
          count > 0 ? "border-ink text-ink" : "border-line text-ink/75 hover:border-black/20",
        )}
      >
        <TagIcon className="w-3.5 h-3.5" />
        {value.untagged ? "Untagged" : count > 0 ? `Tags · ${count}` : "Tags"}
        <ChevronDown className="w-3.5 h-3.5 text-muted" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute right-0 z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-lg"
        >
          <button
            type="button"
            role="option"
            aria-selected={value.untagged}
            className={row(value.untagged)}
            onClick={() =>
              onChange({ tagIds: [], untagged: !value.untagged })
            }
          >
            <span className="w-4 shrink-0">
              {value.untagged && <Check className="w-4 h-4" />}
            </span>
            Untagged
          </button>

          {tags.length > 0 && <div className="my-1 h-px bg-line" />}

          {tags.map((tag) => {
            const active = value.tagIds.includes(tag.id);
            return (
              <button
                key={tag.id}
                type="button"
                role="option"
                aria-selected={active}
                className={row(active)}
                onClick={() => toggleTag(tag.id)}
              >
                <span className="w-4 shrink-0">
                  {active && <Check className="w-4 h-4" />}
                </span>
                <span className="truncate">#{tag.name}</span>
              </button>
            );
          })}

          {count > 0 && (
            <>
              <div className="my-1 h-px bg-line" />
              <button
                type="button"
                className={cn(row(false), "text-muted")}
                onClick={() => onChange({ tagIds: [], untagged: false })}
              >
                <span className="w-4 shrink-0" />
                Clear filter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
