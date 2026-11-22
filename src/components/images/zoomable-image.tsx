import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Minus, Plus, RotateCw, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const SCALE_STEP = 0.25;

interface Props {
  src: string;
  alt: string;
}

export const ZoomableImage: FC<Props> = ({ src, alt }) => {
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);

  const zoomBy = useCallback(
    (delta: number) =>
      setScale((s) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s + delta))),
    [],
  );
  const rotate = useCallback(() => setRotation((r) => r + 90), []);
  const reset = useCallback(() => {
    setScale(MIN_SCALE);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  useEffect(() => {
    if (scale === MIN_SCALE) setOffset({ x: 0, y: 0 });
  }, [scale]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomBy(e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP);
    };
    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input, textarea")) return;
      if (e.key === "+" || e.key === "=") zoomBy(SCALE_STEP);
      if (e.key === "-") zoomBy(-SCALE_STEP);
      if (e.key === "r" || e.key === "R") rotate();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomBy, rotate]);

  const startDrag = (e: ReactPointerEvent<HTMLImageElement>) => {
    if (scale === MIN_SCALE) return;
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const moveDrag = (e: ReactPointerEvent<HTMLImageElement>) => {
    const start = dragStart.current;
    if (start) setOffset({ x: e.clientX - start.x, y: e.clientY - start.y });
  };
  const endDrag = (e: ReactPointerEvent<HTMLImageElement>) => {
    dragStart.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const control =
    "rounded-full p-2 transition-colors hover:bg-white/15 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer";

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center overflow-hidden bg-black/[0.04]"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={cn(
          "block h-auto max-h-[45vh] w-full select-none object-contain md:max-h-[85vh]",
          scale > MIN_SCALE
            ? "cursor-grab active:cursor-grabbing"
            : "cursor-zoom-in",
        )}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)`,
          transition: dragging ? "none" : "transform 120ms ease-out",
        }}
        onDoubleClick={() => setScale(scale > MIN_SCALE ? MIN_SCALE : 2)}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/60 p-1 text-white">
        <button
          type="button"
          aria-label="Zoom out"
          disabled={scale <= MIN_SCALE}
          className={control}
          onClick={() => zoomBy(-SCALE_STEP)}
        >
          <Minus size={16} />
        </button>
        <span className="min-w-12 text-center text-xs font-medium tabular-nums">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          disabled={scale >= MAX_SCALE}
          className={control}
          onClick={() => zoomBy(SCALE_STEP)}
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          aria-label="Rotate"
          className={control}
          onClick={rotate}
        >
          <RotateCw size={16} />
        </button>
        <button
          type="button"
          aria-label="Reset view"
          className={control}
          onClick={reset}
        >
          <Undo2 size={16} />
        </button>
      </div>
    </div>
  );
};
