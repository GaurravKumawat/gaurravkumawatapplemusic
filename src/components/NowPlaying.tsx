import { ChevronDown, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, MoreHorizontal, Heart, FileText } from "lucide-react";
import { formatTime, usePlayer } from "@/lib/player-context";
import { useLibrary } from "@/lib/library-store";

export function NowPlaying({ onMore, onShowLyrics }: { onMore?: () => void; onShowLyrics?: () => void }) {
  const { current, isPlaying, toggle, next, prev, position, duration, seek, showFull, setShowFull, shuffle, repeat, toggleShuffle, cycleRepeat } = usePlayer();
  const lib = useLibrary();

  if (!showFull || !current) return null;
  const fav = lib.isFavorite(current.id);

  return (
    <div className="fixed inset-0 z-50 text-foreground overflow-hidden bg-black">
      {/* Blurred artwork background — fully opaque */}
      <div
        className="absolute inset-0 scale-125"
        style={{
          backgroundImage: `url(${current.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(80px) saturate(180%)",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative h-full flex flex-col pt-safe pb-safe px-6">
        {/* Handle */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowFull(false)}
            className="h-1.5 w-10 rounded-full bg-white/40"
            aria-label="Close"
          />
        </div>

        <button
          onClick={() => setShowFull(false)}
          className="absolute top-3 right-4 p-2 text-white/70"
          aria-label="Close"
        >
          <ChevronDown className="h-6 w-6" />
        </button>

        {/* Artwork */}
        <div className="flex-1 flex items-center justify-center my-4">
          <img
            src={current.thumbnail}
            alt=""
            className={`w-full max-w-[340px] aspect-square rounded-2xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-transform duration-500 ${isPlaying ? "scale-100" : "scale-90"}`}
          />
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="text-[20px] font-semibold leading-tight truncate">{current.title}</div>
            <div className="text-[18px] text-white/70 truncate">{current.artist}</div>
          </div>
          <button
            onClick={() => lib.toggleFavorite(current)}
            className="p-2 rounded-full bg-white/15"
            aria-label="Favorite"
          >
            <Heart className={`h-5 w-5 ${fav ? "fill-current text-primary" : ""}`} />
          </button>
          <button onClick={onMore} className="p-2 rounded-full bg-white/15" aria-label="More">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Scrubber */}
        <div>
          <input
            type="range"
            className="am-slider"
            min={0}
            max={duration || 0}
            step={1}
            value={Math.min(position, duration || 0)}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <div className="flex justify-between text-[11px] text-white/60 mt-1 tabular-nums">
            <span>{formatTime(position)}</span>
            <span>-{formatTime(Math.max(0, (duration || 0) - position))}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-4 mb-6">
          <button onClick={prev} className="p-3" aria-label="Previous">
            <SkipBack className="h-8 w-8 fill-current" />
          </button>
          <button
            onClick={toggle}
            className="p-3"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-14 w-14 fill-current" />
            ) : (
              <Play className="h-14 w-14 fill-current" />
            )}
          </button>
          <button onClick={next} className="p-3" aria-label="Next">
            <SkipForward className="h-8 w-8 fill-current" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between text-white/70 pb-2">
          <button onClick={toggleShuffle} className={`p-2 ${shuffle ? "text-primary" : ""}`} aria-label="Shuffle"><Shuffle className="h-5 w-5" /></button>
          <button onClick={onShowLyrics} className="flex items-center gap-1.5 text-[12px] uppercase tracking-wide">
            <FileText className="h-4 w-4" /> Lyrics
          </button>
          <button onClick={cycleRepeat} className={`p-2 ${repeat !== "off" ? "text-primary" : ""}`} aria-label="Repeat">
            {repeat === "one" ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
