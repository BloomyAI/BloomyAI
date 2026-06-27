"use client";

import { FileText, FolderOpen, FolderPlus, FilePlus } from "lucide-react";
import type { TreeNode } from "@/lib/ide/types";

interface FileExplorerProps {
  tree: TreeNode[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activePath: string | null;
  renamingPath: string | null;
  renameValue: string;
  onRenameValueChange: (v: string) => void;
  onOpenFile: (path: string) => void;
  onContextMenu: (e: React.MouseEvent, path: string | null) => void;
  onStartRename: (path: string, name: string) => void;
  onCommitRename: (path: string) => void;
  onCancelRename: () => void;
  onNewFile: (parentPath: string | null) => void;
  onNewFolder: (parentPath: string | null) => void;
  onDrop: (targetPath: string | null, draggedPath: string) => void;
  draggedPath: string | null;
  onDragStart: (path: string) => void;
  onDragEnd: () => void;
  onSelect?: (path: string) => void;
}

function TreeItem({
  node,
  depth,
  activePath,
  renamingPath,
  renameValue,
  onRenameValueChange,
  onOpenFile,
  onContextMenu,
  onStartRename,
  onCommitRename,
  onCancelRename,
  onDrop,
  draggedPath,
  onDragStart,
  onDragEnd,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
} & Omit<FileExplorerProps, "tree" | "searchQuery" | "onSearchChange" | "onNewFile" | "onNewFolder">) {
  const isRenaming = renamingPath === node.path;
  const isActive = activePath === node.path;
  const isDragging = draggedPath === node.path;

  return (
    <div>
      <div
        draggable={node.type === "file" || node.type === "folder"}
        onDragStart={(e) => {
          e.stopPropagation();
          onDragStart(node.path);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => {
          if (node.type === "folder") e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (draggedPath && draggedPath !== node.path) {
            onDrop(node.type === "folder" ? node.path : null, draggedPath);
          }
        }}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        className={`flex items-center gap-1.5 py-[3px] pr-2 rounded-sm cursor-pointer group ${
          isActive ? "bg-[#37373d] text-[#ffffff]" : "text-[#cccccc] hover:bg-[#2a2d2e]"
        } ${isDragging ? "opacity-50" : ""}`}
        onClick={() => {
          if (isRenaming) return;
          onSelect?.(node.path);
          if (node.type === "file") onOpenFile(node.path);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, node.path);
        }}
        onDoubleClick={() => onStartRename(node.path, node.name)}
      >
        {node.type === "folder" ? (
          <FolderOpen className="w-4 h-4 text-[#dcb67a] shrink-0" />
        ) : (
          <FileText className="w-4 h-4 text-[#519aba] shrink-0" />
        )}
        {isRenaming ? (
          <input
            autoFocus
            value={renameValue}
            onChange={(e) => onRenameValueChange(e.target.value)}
            onBlur={() => onCommitRename(node.path)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onCommitRename(node.path);
              if (e.key === "Escape") onCancelRename();
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-[#0D1117] border border-[#58A6FF] rounded px-1 text-sm text-[#C9D1D9] focus:outline-none"
          />
        ) : (
          <span className="text-sm text-[#C9D1D9] truncate">{node.name}</span>
        )}
      </div>
      {node.children?.map((child) => (
        <TreeItem
          key={child.path}
          node={child}
          depth={depth + 1}
          activePath={activePath}
          renamingPath={renamingPath}
          renameValue={renameValue}
          onRenameValueChange={onRenameValueChange}
          onOpenFile={onOpenFile}
          onContextMenu={onContextMenu}
          onStartRename={onStartRename}
          onCommitRename={onCommitRename}
          onCancelRename={onCancelRename}
          onDrop={onDrop}
          draggedPath={draggedPath}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function FileExplorer(props: FileExplorerProps) {
  const {
    tree,
    searchQuery,
    onSearchChange,
    onNewFile,
    onNewFolder,
    onContextMenu,
    onDrop,
    draggedPath,
    onDragEnd,
    onSelect,
  } = props;

  return (
    <div className="flex flex-col h-full bg-[#252526]">
      <div className="h-[35px] flex items-center px-4 text-[11px] uppercase tracking-wide text-[#bbbbbb] font-semibold shrink-0">
        Explorer
      </div>
      <div className="px-3 pb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter files..."
          className="w-full bg-[#3c3c3c] border border-[#3c3c3c] focus:border-[#007acc] rounded px-2 py-1 text-[13px] text-[#cccccc] placeholder-[#858585] focus:outline-none"
        />
      </div>
      <div className="px-1 pb-1 flex gap-1 shrink-0">
        <button
          onClick={() => onNewFile(null)}
          title="New File"
          className="p-1 hover:bg-[#2a2d2e] rounded text-[#cccccc]"
        >
          <FilePlus className="w-4 h-4" />
        </button>
        <button
          onClick={() => onNewFolder(null)}
          title="New Folder"
          className="p-1 hover:bg-[#2a2d2e] rounded text-[#cccccc]"
        >
          <FolderPlus className="w-4 h-4" />
        </button>
      </div>
      <div
        className="flex-1 overflow-y-auto p-1 relative"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (draggedPath) onDrop(null, draggedPath);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onContextMenu(e, null);
        }}
      >
        {tree.length === 0 ? (
          <div className="p-4 text-center text-[#8B949E]">
            <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No files</p>
            <p className="text-xs mt-1">Right-click or drag files here</p>
          </div>
        ) : (
          tree.map((node) => (
            <TreeItem key={node.path} node={node} depth={0} {...props} />
          ))
        )}
      </div>
    </div>
  );
}
