import { Library, Radio, Search, Mic } from "lucide-react";
import { motion } from "motion/react";

export type Tab = "listen" | "library" | "search" | "recognize";

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: typeof Radio }[] = [
    { id: "listen", label: "Listen", icon: Radio },
    { id: "recognize", label: "Recognize", icon: Mic },
    { id: "library", label: "Library", icon: Library },
    { id: "search", label: "Search", icon: Search },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-[calc(env(safe-area-inset-bottom)+10px)] pointer-events-none">
      <nav className="pointer-events-auto glass-strong rounded-full border border-border shadow-[0_8px_30px_rgba(0,0,0,0.5)] px-1.5 py-1.5">
        <div className="flex items-stretch gap-0.5">
          {items.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full px-4 py-2 transition-colors ${
                  active ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <Icon className="relative h-[20px] w-[20px]" />
                <span className="relative text-[10px] font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
