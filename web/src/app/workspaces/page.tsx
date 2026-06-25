"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, Search, MoreVertical, Trash2, Edit3, Clock, FileText } from "lucide-react";

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState([
    { id: 1, name: "My Project", description: "Web development project", lastModified: "2 hours ago", files: 12 },
    { id: 2, name: "AI Research", description: "Machine learning experiments", lastModified: "1 day ago", files: 8 },
    { id: 3, name: "Documentation", description: "Project documentation", lastModified: "3 days ago", files: 5 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewWorkspace, setShowNewWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");

  const filteredWorkspaces = workspaces.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateWorkspace = async () => {
    if (newWorkspaceName.trim()) {
      try {
        const response = await fetch('/api/workspaces', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'create',
            data: { 
              name: newWorkspaceName,
              description: newWorkspaceDesc || "No description",
              userId: 'current-user' 
            }
          }),
        });
        const data = await response.json();
        if (data.success) {
          setWorkspaces([...workspaces, {
            id: data.workspace.id,
            name: newWorkspaceName,
            description: newWorkspaceDesc || "No description",
            lastModified: "Just now",
            files: 0
          }]);
          setNewWorkspaceName("");
          setNewWorkspaceDesc("");
          setShowNewWorkspace(false);
        }
      } catch (error) {
        alert('Failed to create workspace');
      }
    }
  };

  const handleDeleteWorkspace = (id: number) => {
    setWorkspaces(workspaces.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#1E222B]">
      {/* Header */}
      <nav className="bg-[#15171E] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Bloomy AI" className="w-10 h-10 rounded-full" />
            <span className="text-2xl font-bold gradient-text">Bloomy AI</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="text-white/80 hover:text-white transition-colors">Home</a>
            <a href="/chat" className="text-white/80 hover:text-white transition-colors">Chat</a>
            <a href="/editor" className="text-white/80 hover:text-white transition-colors">Editor</a>
            <a href="/downloads" className="text-white/80 hover:text-white transition-colors">Downloads</a>
            <a href="/settings" className="text-white/80 hover:text-white transition-colors">Settings</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">Workspaces</h1>
              <p className="text-white/70">Manage your project workspaces</p>
            </div>
            <button
              onClick={() => setShowNewWorkspace(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              New Workspace
            </button>
          </div>

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

          {/* New Workspace Modal */}
          {showNewWorkspace && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowNewWorkspace(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 gradient-text">Create New Workspace</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Name</label>
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="Workspace name"
                      className="w-full bg-[#15171E] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/80">Description</label>
                    <textarea
                      value={newWorkspaceDesc}
                      onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                      placeholder="Workspace description"
                      rows={3}
                      className="w-full bg-[#15171E] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowNewWorkspace(false)}
                      className="flex-1 btn-secondary py-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateWorkspace}
                      className="flex-1 btn-primary py-3"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace, index) => (
              <motion.div
                key={workspace.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-bloomy-purple to-bloomy-blue flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <button className="p-1 hover:bg-white/10 rounded">
                    <MoreVertical className="w-4 h-4 text-white/60" />
                  </button>
                </div>
                <h3 className="text-xl font-bold mb-2">{workspace.name}</h3>
                <p className="text-white/60 mb-4 text-sm">{workspace.description}</p>
                <div className="flex items-center justify-between text-sm text-white/40">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workspace.lastModified}
                  </div>
                  <div>{workspace.files} files</div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredWorkspaces.length === 0 && (
            <div className="text-center py-12">
              <FolderPlus className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/40 mb-4">No workspaces found</p>
              <button
                onClick={() => setShowNewWorkspace(true)}
                className="btn-primary"
              >
                Create Your First Workspace
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
