import { Pause, Play, SkipForward } from "lucide-react";
import { usePlayer } from "@/lib/player-context";

export function MiniPlayer() {
  const { current, isPlaying, toggle, next, setShowFull, position, duration } = usePlayer();
  if (!current) return null;
  const pct = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <button
      onClick={() => setShowFull(true)}
      className="fixed left-2 right-2 bottom-[calc(env(safe-area-inset-bottom)+56px)] z-40 glass-strong rounded-2xl shadow-2xl border border-border overflow-hidden text-left active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3 p-2">
        <img
          src={current.thumbnail}
          alt=""
          className="h-11 w-11 rounded-md object-cover bg-muted"
        />
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium truncate text-foreground">{current.title}</div>
          <div className="text-[12px] text-muted-foreground truncate">{current.artist}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggle(); }}
          className="p-2 text-foreground"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="p-2 text-foreground"
          aria-label="Next"
        >
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
      </div>
      <div className="h-[2px] bg-white/10">
        <div className="h-full bg-white/80 transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
}
