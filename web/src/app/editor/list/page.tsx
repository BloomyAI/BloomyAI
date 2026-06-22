"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, Plus, Search, ArrowLeft, FileText, Trash2, Download } from "lucide-react";
import Link from "next/link";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
}

interface Workspace {
  id: string;
  name: string;
  files: FileNode[];
  timestamp: string;
}

export default function EditorListPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedWorkspaces = localStorage.getItem('bloomyai_workspaces');
      if (savedWorkspaces) {
        try {
          const parsed = JSON.parse(savedWorkspaces);
          if (parsed && parsed.length > 0) {
            setWorkspaces(parsed);
          }
        } catch (e) {
          console.error('Failed to load workspaces:', e);
        }
      }
    }
  }, []);

  const createNewWorkspace = () => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name: "New Workspace",
      files: [],
      timestamp: new Date().toISOString(),
    };
    const updated = [newWorkspace, ...workspaces];
    setWorkspaces(updated);
    localStorage.setItem('bloomyai_workspaces', JSON.stringify(updated));
    window.location.href = `/editor/${newWorkspace.id}`;
  };

  const deleteWorkspace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = workspaces.filter(w => w.id !== id);
    setWorkspaces(updated);
    localStorage.setItem('bloomyai_workspaces', JSON.stringify(updated));
  };

  const countFiles = (files: FileNode[]): number => {
    let count = 0;
    files.forEach(file => {
      if (file.type === "file") {
        count++;
      } else if (file.children) {
        count += countFiles(file.children);
      }
    });
    return count;
  };

  const filteredWorkspaces = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#1E222B]">
      {/* Header */}
      <nav className="bg-[#15171E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <ArrowLeft className="w-5 h-5 text-white/60 hover:text-white cursor-pointer" />
            </Link>
            <img src="/logo.png" alt="Bloomy AI" className="w-8 h-8 rounded-full" />
            <span className="text-xl font-bold gradient-text">Workspaces</span>
          </div>
          <button
            onClick={createNewWorkspace}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E222B] hover:bg-[#252933] rounded-lg text-white text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Workspace
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspaces..."
              className="w-full bg-[#15171E] border border-white/10 rounded-lg px-10 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
            />
          </div>
        </div>

        {/* Workspaces List */}
        <div className="space-y-2">
          {filteredWorkspaces.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/40 mb-4">No workspaces yet</p>
              <button
                onClick={createNewWorkspace}
                className="px-6 py-3 bg-bloomy-purple hover:bg-bloomy-purple/80 rounded-lg text-white transition-colors"
              >
                Create your first workspace
              </button>
            </div>
          ) : (
            filteredWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/editor/${workspace.id}`}
                  className="block bg-[#15171E] hover:bg-[#1E222B] border border-white/10 rounded-lg p-4 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FolderOpen className="w-4 h-4 text-bloomy-purple" />
                        <h3 className="text-white font-medium">{workspace.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{countFiles(workspace.files)} files</span>
                        <span>{formatDate(workspace.timestamp)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const blob = new Blob([JSON.stringify(workspace)], { type: "application/json" });
                          const a = document.createElement("a");
                          a.href = URL.createObjectURL(blob);
                          a.download = `${workspace.name}.json`;
                          a.click();
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-white/60" />
                      </button>
                      <button
                        onClick={(e) => deleteWorkspace(workspace.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
