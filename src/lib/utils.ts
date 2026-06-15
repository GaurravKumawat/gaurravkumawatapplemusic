import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Falls back to a lower-res YouTube thumbnail if maxresdefault is missing. */
export function onArtworkError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  if (img.src.includes("maxresdefault")) {
    img.dataset.fallback = "1";
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}

/** Compact view-count formatting, e.g. 1.2M, 340K. */
export function formatViews(n?: number): string | null {
  if (n == null || !isFinite(n) || n <= 0) return null;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${n}`;
}
