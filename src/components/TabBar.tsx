import { Library, Radio, Search, Mic } from "lucide-react";

export type Tab = "listen" | "library" | "search" | "recognize";

export function TabBar({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: typeof Radio }[] = [
    { id: "listen", label: "Listen Now", icon: Radio },
    { id: "recognize", label: "Recognize", icon: Mic },
    { id: "library", label: "Library", icon: Library },
    { id: "search", label: "Search", icon: Search },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border pb-safe">
      <div className="flex items-stretch justify-around">
        {items.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-[22px] w-[22px]" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
