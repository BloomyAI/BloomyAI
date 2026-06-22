"use client";

import { Search, Folder, Plus, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  modified: string;
  chats: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "created" | "shared">("all");
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    // Load projects from localStorage
    const savedProjects = localStorage.getItem('bloomy-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    // For now, all projects are "created by you"
    const matchesFilter = filter === "all" || filter === "created";
    return matchesSearch && matchesFilter;
  });

  const createProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName.trim(),
        modified: new Date().toISOString(),
        chats: [],
      };
      const updatedProjects = [...projects, newProject];
      setProjects(updatedProjects);
      localStorage.setItem('bloomy-projects', JSON.stringify(updatedProjects));
      setNewProjectName("");
      setNewProjectOpen(false);
    }
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem('bloomy-projects', JSON.stringify(updatedProjects));
  };

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
    <div className="min-h-screen bg-dark-bg flex">
      {/* Sidebar */}
      <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-dark-border">
          <div className="flex items-center gap-2">
            <span className="text-dark-text font-semibold">BloomyAI</span>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-dark-card rounded-lg text-dark-text text-sm">
            <Folder className="w-4 h-4" />
            Projects
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="space-y-1">
            <a href="/chat" className="flex items-center gap-2 px-3 py-2 text-dark-text-secondary text-sm hover:bg-dark-border rounded-lg cursor-pointer transition-colors">
              Chat
            </a>
            <a href="/library" className="flex items-center gap-2 px-3 py-2 text-dark-text-secondary text-sm hover:bg-dark-border rounded-lg cursor-pointer transition-colors">
              Library
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col h-full w-full p-8">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-dark-text">Projects</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search projects"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-dark-surface border border-dark-border rounded-full py-1.5 pl-9 pr-4 text-sm text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50 w-64"
                  />
                </div>
                <button 
                  onClick={() => setNewProjectOpen(true)}
                  className="px-4 py-1.5 bg-dark-card border border-dark-border text-dark-text text-sm font-medium rounded-full hover:bg-dark-border transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 border-b border-dark-border mb-6">
              <button 
                onClick={() => setFilter("all")}
                className={`pb-3 text-sm font-medium ${filter === "all" ? "text-dark-text border-b-2 border-dark-text" : "text-dark-text-secondary hover:text-dark-text"} transition-colors`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("created")}
                className={`pb-3 text-sm font-medium ${filter === "created" ? "text-dark-text border-b-2 border-dark-text" : "text-dark-text-secondary hover:text-dark-text"} transition-colors`}
              >
                Created by you
              </button>
              <button 
                onClick={() => setFilter("shared")}
                className={`pb-3 text-sm font-medium ${filter === "shared" ? "text-dark-text border-b-2 border-dark-text" : "text-dark-text-secondary hover:text-dark-text"} transition-colors`}
              >
                Shared with you
              </button>
            </div>

            <div className="grid grid-cols-[1fr,200px] gap-4 px-4 py-2 text-sm text-dark-text-secondary border-b border-dark-border pb-4">
              <div>Name</div>
              <div>Modified</div>
            </div>

            <div className="py-2 flex flex-col gap-1">
              {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-dark-text-secondary">
                  <Folder className="w-12 h-12 mb-4" />
                  <p>No projects found.</p>
                  <button 
                    onClick={() => setNewProjectOpen(true)}
                    className="mt-4 px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text hover:bg-dark-border transition-colors"
                  >
                    Create your first project
                  </button>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-4 px-4 py-3 hover:bg-dark-surface rounded-lg cursor-pointer transition-colors border-b border-dark-border/50 group">
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-10 h-10 bg-dark-card rounded flex items-center justify-center">
                        <Folder className="w-5 h-5 text-dark-text-secondary" />
                      </div>
                      <span className="text-dark-text">{project.name}</span>
                      <span className="text-xs text-dark-text-secondary bg-dark-card px-2 py-1 rounded">
                        {project.chats.length} chats
                      </span>
                    </div>
                    <div className="w-[200px] text-dark-text-secondary text-sm">{formatDate(project.modified)}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-dark-border rounded transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4 text-dark-text-secondary" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Project Dialog */}
      {newProjectOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-dark-text mb-4">Create New Project</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50 mb-4"
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') createProject();
                if (e.key === 'Escape') setNewProjectOpen(false);
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setNewProjectOpen(false)}
                className="px-4 py-2 bg-dark-surface hover:bg-dark-border rounded-lg text-dark-text transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                className="px-4 py-2 bg-bloomy-purple hover:bg-bloomy-purple/80 rounded-lg text-white transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
