"use client";

import type { EditorTab } from "@/lib/ide/types";
import { getBreadcrumbs } from "@/lib/ide/vfs";
import { ChevronRight, FileText, X } from "lucide-react";
import Editor, { DiffEditor } from "@monaco-editor/react";

const EDITOR_OPTIONS = {
  fontSize: 14,
  fontFamily: "'Consolas', 'Courier New', monospace",
  fontLigatures: true,
  minimap: { enabled: true, scale: 1 },
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: "smooth" as const,
  cursorSmoothCaretAnimation: "on" as const,
  renderLineHighlight: "line" as const,
  bracketPairColorization: { enabled: true },
  guides: { bracketPairs: true, indentation: true },
  autoClosingBrackets: "always" as const,
  autoClosingQuotes: "always" as const,
  autoIndent: "full" as const,
  tabSize: 2,
  wordWrap: "off" as const,
  lineNumbers: "on" as const,
  folding: true,
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: { other: true, comments: false, strings: true },
  multiCursorModifier: "alt" as const,
  snippetSuggestions: "top" as const,
  padding: { top: 8 },
  scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
};

interface EditorPanelProps {
  tabs: EditorTab[];
  activeTabId: string;
  theme: string;
  diffMode?: { original: string; modified: string; path: string } | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onChange: (value: string | undefined) => void;
  onMount: (editor: unknown) => void;
  onNewFile: () => void;
  onBreadcrumbClick: (path: string) => void;
}

export function EditorPanel({
  tabs,
  activeTabId,
  theme,
  diffMode,
  onTabSelect,
  onTabClose,
  onChange,
  onMount,
  onBreadcrumbClick,
}: EditorPanelProps) {
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const breadcrumbs = activeTab ? getBreadcrumbs(activeTab.path) : [];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#1e1e1e]">
      {/* Tab bar — VS Code style */}
      <div className="h-[35px] bg-[#252526] flex items-end overflow-x-auto shrink-0">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          const name = tab.path.split("/").pop() || tab.path;
          return (
            <div
              key={tab.id}
              onClick={() => onTabSelect(tab.id)}
              className={`group flex items-center gap-1.5 h-[35px] px-3 text-[13px] cursor-pointer border-r border-[#252526] min-w-0 shrink-0 max-w-[200px] ${
                isActive
                  ? "bg-[#1e1e1e] text-[#ffffff] border-t border-t-[#007acc]"
                  : "bg-[#2d2d2d] text-[#969696] hover:bg-[#1e1e1e] hover:text-[#cccccc]"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0 opacity-70" />
              <span className="truncate">{name}</span>
              {tab.modified && <span className="text-[#cccccc] text-lg leading-none">●</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-[#4d4d4d] shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Breadcrumbs */}
      {activeTab && !diffMode && (
        <div className="h-[22px] flex items-center px-4 gap-0.5 bg-[#1e1e1e] text-[11px] text-[#cccccc] shrink-0 border-b border-[#2b2b2b]">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-0.5 shrink-0">
              {i > 0 && <ChevronRight className="w-3 h-3 text-[#858585]" />}
              <button
                onClick={() => onBreadcrumbClick(crumb.path)}
                className="hover:text-[#ffffff] truncate max-w-[140px] px-0.5 rounded hover:bg-[#2a2d2e]"
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {diffMode ? (
          <DiffEditor
            height="100%"
            language={activeTab?.language || "plaintext"}
            original={diffMode.original}
            modified={diffMode.modified}
            theme={theme}
            options={{ ...EDITOR_OPTIONS, renderSideBySide: true }}
          />
        ) : activeTab ? (
          <Editor
            height="100%"
            path={activeTab.path}
            language={activeTab.language}
            value={activeTab.content}
            onChange={onChange}
            onMount={onMount}
            theme={theme}
            options={EDITOR_OPTIONS}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-[#858585] bg-[#1e1e1e]">
            <div className="text-center">
              <p className="text-[22px] text-[#cccccc] mb-2">Bloomy IDE</p>
              <p className="text-[13px]">Open a file from the explorer</p>
              <p className="text-[12px] mt-2 text-[#6e6e6e]">Ctrl+N new file · Ctrl+Shift+P command palette</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
