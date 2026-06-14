import { useState } from "react";
import { Heart, ListMusic, Plus, Play, X, Check, Trash2, FileText, Download } from "lucide-react";
import type { Track } from "@/lib/music.functions";
import { useLibrary } from "@/lib/library-store";
import { usePlayer } from "@/lib/player-context";
import { toast } from "sonner";

type Props = {
  track: Track | null;
  onClose: () => void;
  onShowLyrics?: (t: Track) => void;
};

export function ActionSheet({ track, onClose, onShowLyrics }: Props) {
  const lib = useLibrary();
  const { playTrack } = usePlayer();
  const [view, setView] = useState<"main" | "playlists">("main");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  if (!track) return null;
  const fav = lib.isFavorite(track.id);
  const inLib = lib.isInLibrary(track.id);

  const close = () => { setView("main"); setCreating(false); setName(""); onClose(); };

  return (
    <div className="fixed inset-0 z-[60] flex items-end" onClick={close}>
      <div className="absolute inset-0 bg-black/60" />
      <div
        className="relative w-full bg-popover rounded-t-3xl pb-safe animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <img src={track.thumbnail} alt="" className="h-14 w-14 rounded-lg object-cover bg-muted" />
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold truncate">{track.title}</div>
            <div className="text-[13px] text-muted-foreground truncate">{track.artist}</div>
          </div>
          <button onClick={close} className="p-2 text-muted-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {view === "main" && (
          <div className="py-1">
            <Row icon={<Play className="h-5 w-5" />} label="Play" onClick={() => { playTrack(track, [track]); close(); }} />
            <Row
              icon={<Heart className={`h-5 w-5 ${fav ? "fill-primary text-primary" : ""}`} />}
              label={fav ? "Remove from Favorites" : "Add to Favorites"}
              onClick={() => { lib.toggleFavorite(track); toast.success(fav ? "Removed from Favorites" : "Added to Favorites"); close(); }}
            />
            <Row
              icon={<Plus className="h-5 w-5" />}
              label={inLib ? "Remove from Library" : "Add to Library"}
              onClick={() => {
                if (inLib) { lib.removeFromLibrary(track.id); toast.success("Removed from Library"); }
                else { lib.addToLibrary(track); toast.success("Added to Library"); }
                close();
              }}
            />
            <Row icon={<ListMusic className="h-5 w-5" />} label="Add to a Playlist…" onClick={() => setView("playlists")} chevron />
            {onShowLyrics && (
              <Row icon={<FileText className="h-5 w-5" />} label="Show Lyrics" onClick={() => { onShowLyrics(track); close(); }} />
            )}
            <Row
              icon={<Download className="h-5 w-5" />}
              label="Download"
              onClick={() => { toast.info("Downloading isn't available", { description: "YouTube's terms prevent direct downloads from the browser." }); }}
            />
          </div>
        )}

        {view === "playlists" && (
          <div className="py-1 max-h-[60vh] overflow-y-auto">
            {creating ? (
              <div className="px-4 py-3 flex gap-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Playlist name"
                  className="flex-1 bg-secondary rounded-lg px-3 py-2 text-[15px] outline-none"
                />
                <button
                  className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[14px] font-medium"
                  onClick={() => {
                    const pl = lib.createPlaylist(name);
                    lib.addToPlaylist(pl.id, track);
                    toast.success(`Added to ${pl.name}`);
                    close();
                  }}
                >
                  Create
                </button>
              </div>
            ) : (
              <Row icon={<Plus className="h-5 w-5" />} label="New Playlist" onClick={() => setCreating(true)} />
            )}
            {lib.playlists.length === 0 && !creating && (
              <div className="px-4 py-6 text-center text-[13px] text-muted-foreground">No playlists yet</div>
            )}
            {lib.playlists.map((p) => {
              const has = p.trackIds.includes(track.id);
              return (
                <Row
                  key={p.id}
                  icon={<ListMusic className="h-5 w-5" />}
                  label={p.name}
                  trailing={has ? <Check className="h-5 w-5 text-primary" /> : null}
                  onClick={() => {
                    if (has) return close();
                    lib.addToPlaylist(p.id, track);
                    toast.success(`Added to ${p.name}`);
                    close();
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  icon, label, onClick, chevron, trailing,
}: { icon: React.ReactNode; label: string; onClick: () => void; chevron?: boolean; trailing?: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-3 active:bg-white/5 text-left"
    >
      <span className="text-foreground">{icon}</span>
      <span className="flex-1 text-[15px]">{label}</span>
      {trailing}
      {chevron && <span className="text-muted-foreground">›</span>}
    </button>
  );
}

export function DeleteRow({ onClick, label = "Delete" }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-5 py-3 text-destructive active:bg-white/5">
      <Trash2 className="h-5 w-5" />
      <span className="flex-1 text-left text-[15px]">{label}</span>
    </button>
  );
}
