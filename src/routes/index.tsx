import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Search as SearchIcon, X, Play } from "lucide-react";
import { PlayerProvider, usePlayer } from "@/lib/player-context";
import { LibraryProvider } from "@/lib/library-store";
import { getTrending, searchMusic, type Track } from "@/lib/music.functions";
import { onArtworkError, formatViews } from "@/lib/utils";
import { AppleLogo } from "@/components/AppleLogo";
import { MiniPlayer } from "@/components/MiniPlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { TabBar, type Tab } from "@/components/TabBar";
import { TrackRow } from "@/components/TrackRow";
import { LibraryView } from "@/components/LibraryView";
import { ActionSheet } from "@/components/ActionSheet";
import { LyricsView } from "@/components/LyricsView";
import { RecognizeView } from "@/components/RecognizeView";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Music — Web Player" },
      { name: "description", content: "Apple Music–inspired web music player powered by YouTube." },
      { name: "theme-color", content: "#000000" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" },
    ],
  }),
  component: () => (
    <LibraryProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </LibraryProvider>
  ),
});

function App() {
  const [tab, setTab] = useState<Tab>("listen");
  const { current } = usePlayer();
  const [moreFor, setMoreFor] = useState<Track | null>(null);
  const [lyricsFor, setLyricsFor] = useState<Track | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-safe">
        {tab === "listen" && <ListenNow onMore={setMoreFor} />}
        {tab === "search" && <SearchView onMore={setMoreFor} />}
        {tab === "library" && <LibraryView onMore={setMoreFor} />}
        {tab === "recognize" && <RecognizeView />}
      </div>
      <div style={{ height: current ? 140 : 80 }} />
      <MiniPlayer />
      <TabBar tab={tab} onChange={setTab} />
      <NowPlaying
        onMore={() => current && setMoreFor(current)}
        onShowLyrics={() => current && setLyricsFor(current)}
      />
      <ActionSheet
        track={moreFor}
        onClose={() => setMoreFor(null)}
        onShowLyrics={(t) => setLyricsFor(t)}
      />
      {lyricsFor && <LyricsView track={lyricsFor} onClose={() => setLyricsFor(null)} />}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <h1 className="text-[28px] font-bold tracking-tight px-4 pt-3 pb-2">{title}</h1>;
}

const PICK_GRADIENTS = [
  "linear-gradient(160deg, #ff2d55 0%, #8b0a2a 100%)",
  "linear-gradient(160deg, #ff7a00 0%, #7a2e00 100%)",
  "linear-gradient(160deg, #5e5ce6 0%, #1c1c4a 100%)",
  "linear-gradient(160deg, #34c759 0%, #0a3d1e 100%)",
  "linear-gradient(160deg, #00c7be 0%, #064a47 100%)",
];

function ListenNow({ onMore }: { onMore: (t: Track) => void }) {
  const trending = useServerFn(getTrending);
  const { data, isLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: () => trending(),
    staleTime: 5 * 60 * 1000,
  });
  const { playTrack } = usePlayer();
  const tracks = data?.tracks ?? [];
  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div>
      {/* Header with Apple Music branding */}
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{today}</div>
        <div className="flex items-center gap-1.5 text-foreground">
          <AppleLogo className="h-4 w-4" />
          <span className="text-[15px] font-semibold tracking-tight">Music</span>
        </div>
      </div>
      <h1 className="text-[30px] font-bold tracking-tight px-4 pt-0.5 pb-2">Listen Now</h1>

      {/* Top Picks — large gradient cards */}
      <h2 className="text-[20px] font-bold px-4 mb-2">Top Picks</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-5 snap-x snap-mandatory">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[78vw] max-w-[320px] aspect-[3/4] rounded-3xl bg-muted animate-pulse" />
            ))
          : tracks.slice(0, 5).map((t, i) => (
              <motion.button
                key={t.id}
                onClick={() => playTrack(t, tracks)}
                whileTap={{ scale: 0.97 }}
                className="shrink-0 w-[78vw] max-w-[320px] aspect-[3/4] rounded-3xl overflow-hidden relative text-left snap-start shadow-2xl"
                style={{ backgroundImage: PICK_GRADIENTS[i % PICK_GRADIENTS.length] }}
              >
                <img
                  src={t.thumbnail}
                  onError={onArtworkError}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute top-3 left-4 text-[11px] uppercase tracking-wider text-white/80 font-bold">
                  Featured
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white text-[22px] font-bold leading-tight line-clamp-2">{t.title}</div>
                  <div className="text-white/80 text-[14px] truncate">{t.artist}</div>
                </div>
              </motion.button>
            ))}
      </div>

      {/* Trending — square cards with play count */}
      <h2 className="text-[20px] font-bold px-4 mb-2">Trending Now</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-40">
                <div className="w-40 h-40 rounded-xl bg-muted animate-pulse" />
                <div className="h-3 mt-2 w-32 rounded bg-muted animate-pulse" />
                <div className="h-3 mt-1 w-20 rounded bg-muted animate-pulse" />
              </div>
            ))
          : tracks.slice(1, 12).map((t) => {
              const views = formatViews(t.views);
              return (
                <motion.button
                  key={t.id}
                  onClick={() => playTrack(t, tracks)}
                  whileTap={{ scale: 0.95 }}
                  className="shrink-0 w-40 text-left"
                >
                  <div className="relative">
                    <img src={t.thumbnail} onError={onArtworkError} alt="" className="w-40 h-40 rounded-xl object-cover bg-muted" />
                    {views && (
                      <div className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur px-2 py-0.5 text-[10px] text-white font-medium">
                        <Play className="h-2 w-2 fill-current" />
                        {views}
                      </div>
                    )}
                  </div>
                  <div className="text-[14px] font-medium mt-2 line-clamp-1">{t.title}</div>
                  <div className="text-[12px] text-muted-foreground line-clamp-1">{t.artist}</div>
                </motion.button>
              );
            })}
      </div>

      <h2 className="text-[20px] font-bold px-4 mb-2 mt-2">Made For You</h2>
      <div className="px-4">
        {tracks.slice(0, 10).map((t, i) => (
          <TrackRow key={t.id + i} track={t} index={i + 1} onPlay={() => playTrack(t, tracks)} onMore={onMore} />
        ))}
      </div>
    </div>
  );
}

function SearchView({ onMore }: { onMore: (t: Track) => void }) {
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState("");
  const search = useServerFn(searchMusic);
  const { data, isFetching } = useQuery({
    queryKey: ["search", submitted],
    queryFn: () => search({ data: { query: submitted } }),
    enabled: submitted.length > 0,
  });
  const { playTrack } = usePlayer();

  useEffect(() => {
    const id = setTimeout(() => setSubmitted(q.trim()), 350);
    return () => clearTimeout(id);
  }, [q]);

  const tracks: Track[] = data?.tracks ?? [];

  return (
    <div>
      <SectionHeader title="Search" />
      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Artists, Songs, Lyrics, and More"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4">
        {!submitted && (
          <div className="pt-2">
            <div className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Try Searching For
            </div>
            <div className="flex flex-wrap gap-2">
              {["Taylor Swift", "Drake", "The Weeknd", "Billie Eilish", "SZA", "Bad Bunny", "Lo-fi", "Jazz"].map((s) => (
                <button
                  key={s}
                  onClick={() => setQ(s)}
                  className="px-3 py-1.5 rounded-full bg-secondary text-[13px]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {submitted && isFetching && (
          <div className="space-y-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {submitted && !isFetching && tracks.length === 0 && (
          <div className="text-center text-muted-foreground py-12 text-[14px]">No results</div>
        )}

        {tracks.map((t) => (
          <TrackRow key={t.id} track={t} onPlay={() => playTrack(t, tracks)} onMore={onMore} />
        ))}
      </div>
    </div>
  );
}
