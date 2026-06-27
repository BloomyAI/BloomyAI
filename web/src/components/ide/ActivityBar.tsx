"use client";

import { Files, Search, GitBranch, Terminal, Sparkles } from "lucide-react";

export type SidebarView = "explorer" | "search" | "git" | "ai";

interface ActivityBarProps {
  active: SidebarView;
  onChange: (view: SidebarView) => void;
  terminalOpen: boolean;
  onToggleTerminal: () => void;
}

export function ActivityBar({ active, onChange, terminalOpen, onToggleTerminal }: ActivityBarProps) {
  const items: { id: SidebarView; icon: typeof Files; title: string }[] = [
    { id: "explorer", icon: Files, title: "Explorer (Ctrl+Shift+E)" },
    { id: "search", icon: Search, title: "Search (Ctrl+Shift+F)" },
    { id: "git", icon: GitBranch, title: "Source Control" },
    { id: "ai", icon: Sparkles, title: "Bloomy AI" },
  ];

  return (
    <div className="w-[48px] bg-[#333333] flex flex-col items-center shrink-0">
      {items.map(({ id, icon: Icon, title }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          title={title}
          className={`w-full h-[48px] flex items-center justify-center relative ${
            active === id ? "text-[#ffffff]" : "text-[#858585] hover:text-[#cccccc]"
          }`}
        >
          {active === id && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[70%] bg-[#ffffff]" />
          )}
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </button>
      ))}
      <div className="flex-1" />
      <button
        onClick={onToggleTerminal}
        title="Terminal (Ctrl+`)"
        className={`w-full h-[48px] flex items-center justify-center ${
          terminalOpen ? "text-[#ffffff]" : "text-[#858585] hover:text-[#cccccc]"
        }`}
      >
        <Terminal className="w-6 h-6" strokeWidth={1.5} />
      </button>
    </div>
  );
}
