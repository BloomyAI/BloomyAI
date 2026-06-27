"use client";

import { useState } from "react";

interface MenuBarProps {
  onAction: (action: string) => void;
}

const MENUS: { label: string; items: { label: string; action: string; shortcut?: string }[] }[] = [
  {
    label: "File",
    items: [
      { label: "New File", action: "newFile", shortcut: "Ctrl+N" },
      { label: "New Folder", action: "newFolder" },
      { label: "Save", action: "save", shortcut: "Ctrl+S" },
      { label: "Import ZIP...", action: "import" },
      { label: "Export ZIP...", action: "export" },
    ],
  },
  {
    label: "Edit",
    items: [
      { label: "Undo", action: "undo", shortcut: "Ctrl+Z" },
      { label: "Redo", action: "redo", shortcut: "Ctrl+Y" },
      { label: "Delete", action: "delete", shortcut: "Delete" },
    ],
  },
  {
    label: "View",
    items: [
      { label: "Command Palette...", action: "palette", shortcut: "Ctrl+Shift+P" },
      { label: "Explorer", action: "explorer" },
      { label: "Search", action: "search" },
      { label: "Terminal", action: "terminal", shortcut: "Ctrl+`" },
    ],
  },
  {
    label: "Help",
    items: [{ label: "About Bloomy IDE", action: "about" }],
  },
];

export function MenuBar({ onAction }: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div
      className="h-[30px] bg-[#3c3c3c] flex items-center px-1 text-[#cccccc] text-xs shrink-0 border-b border-[#2b2b2b] select-none"
      onMouseLeave={() => setOpenMenu(null)}
    >
      {MENUS.map((menu) => (
        <div key={menu.label} className="relative">
          <button
            className={`px-2 py-1 rounded hover:bg-[#505050] ${openMenu === menu.label ? "bg-[#505050]" : ""}`}
            onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
            onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
          >
            {menu.label}
          </button>
          {openMenu === menu.label && (
            <div className="absolute top-full left-0 z-[200] min-w-[220px] bg-[#252526] border border-[#454545] shadow-lg py-1">
              {menu.items.map((item) => (
                <button
                  key={item.action}
                  className="w-full px-8 py-1.5 text-left hover:bg-[#094771] flex justify-between gap-8"
                  onClick={() => {
                    onAction(item.action);
                    setOpenMenu(null);
                  }}
                >
                  <span>{item.label}</span>
                  {item.shortcut && <span className="text-[#858585]">{item.shortcut}</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
