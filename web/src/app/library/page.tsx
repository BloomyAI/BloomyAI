"use client";

import { Search, Grid, List, FileText, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: string;
  modified: string;
}

export default function LibraryPage() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filter, setFilter] = useState<"all" | "images" | "files">("all");

  useEffect(() => {
    // Load attachments from localStorage
    const conversations = JSON.parse(localStorage.getItem('bloomy-conversations') || '[]');
    const allAttachments: Attachment[] = [];
    
    conversations.forEach((conv: any) => {
      conv.messages?.forEach((msg: any) => {
        if (msg.attachments) {
          msg.attachments.forEach((att: any) => {
            allAttachments.push({
              id: att.id,
              name: att.name,
              type: att.type,
              url: att.url,
              size: att.size || 'Unknown',
              modified: conv.timestamp,
            });
          });
        }
      });
    });
    
    setAttachments(allAttachments);
  }, []);

  const filteredAttachments = attachments.filter(att => {
    const matchesSearch = att.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === "all" ||
      (filter === "images" && att.type.startsWith("image/")) ||
      (filter === "files" && !att.type.startsWith("image/"));
    return matchesSearch && matchesFilter;
  });

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
            <FileText className="w-4 h-4" />
            Library
          </div>
        </div>

        <div className="px-4 py-2">
          <div className="space-y-1">
            <a href="/chat" className="flex items-center gap-2 px-3 py-2 text-dark-text-secondary text-sm hover:bg-dark-border rounded-lg cursor-pointer transition-colors">
              Chat
            </a>
            <a href="/projects" className="flex items-center gap-2 px-3 py-2 text-dark-text-secondary text-sm hover:bg-dark-border rounded-lg cursor-pointer transition-colors">
              Projects
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col h-full w-full p-8">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-dark-text">Library</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-dark-surface border border-dark-border rounded-full py-1.5 pl-9 pr-4 text-sm text-dark-text placeholder-dark-text-secondary focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50 w-64"
                  />
                </div>
                <button className="px-4 py-1.5 bg-dark-card border border-dark-border text-dark-text text-sm font-medium rounded-full hover:bg-dark-border transition-colors">
                  New
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-dark-border mb-6">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setFilter("all")}
                  className={`pb-3 text-sm font-medium ${filter === "all" ? "text-dark-text border-b-2 border-dark-text" : "text-dark-text-secondary hover:text-dark-text"} transition-colors`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter("images")}
                  className={`pb-3 text-sm font-medium ${filter === "images" ? "text-dark-text border-b-2 border-dark-text" : "text-dark-text-secondary hover:text-dark-text"} transition-colors`}
                >
                  Images
                </button>
                <button 
                  onClick={() => setFilter("files")}
                  className={`pb-3 text-sm font-medium ${filter === "files" ? "text-dark-text border-b-2 border-dark-text" : "text-dark-text-secondary hover:text-dark-text"} transition-colors`}
                >
                  Files
                </button>
              </div>
              
              <div className="flex items-center gap-2 pb-3">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${viewMode === "grid" ? "text-dark-text bg-dark-card" : "text-dark-text-secondary hover:text-dark-text"} transition-colors rounded-md hover:bg-dark-border`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${viewMode === "list" ? "text-dark-text bg-dark-card" : "text-dark-text-secondary hover:text-dark-text"} transition-colors rounded-md hover:bg-dark-border`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {viewMode === "list" ? (
              <>
                <div className="grid grid-cols-[1fr,150px,100px] gap-4 px-4 py-2 text-sm text-dark-text-secondary border-b border-dark-border pb-4">
                  <div>Name</div>
                  <div>Modified</div>
                  <div>Size</div>
                </div>

                <div className="py-2 flex flex-col gap-1">
                  {filteredAttachments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-dark-text-secondary">
                      <FileText className="w-12 h-12 mb-4" />
                      <p>No attachments found.</p>
                    </div>
                  ) : (
                    filteredAttachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-4 px-4 py-3 hover:bg-dark-surface rounded-lg cursor-pointer transition-colors border-b border-dark-border/50">
                        <div className="flex-1 flex items-center gap-3">
                          {att.type.startsWith("image/") ? (
                            <img src={att.url} alt={att.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 bg-dark-card rounded flex items-center justify-center">
                              <FileText className="w-5 h-5 text-dark-text-secondary" />
                            </div>
                          )}
                          <span className="text-dark-text">{att.name}</span>
                        </div>
                        <div className="w-[150px] text-dark-text-secondary text-sm">{formatDate(att.modified)}</div>
                        <div className="w-[100px] text-dark-text-secondary text-sm">{att.size}</div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {filteredAttachments.length === 0 ? (
                  <div className="col-span-4 flex flex-col items-center justify-center py-20 text-dark-text-secondary">
                    <FileText className="w-12 h-12 mb-4" />
                    <p>No attachments found.</p>
                  </div>
                ) : (
                  filteredAttachments.map((att) => (
                    <div key={att.id} className="bg-dark-card border border-dark-border rounded-lg p-4 hover:bg-dark-surface cursor-pointer transition-colors">
                      {att.type.startsWith("image/") ? (
                        <img src={att.url} alt={att.name} className="w-full h-32 object-cover rounded mb-3" />
                      ) : (
                        <div className="w-full h-32 bg-dark-surface rounded mb-3 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-dark-text-secondary" />
                        </div>
                      )}
                      <div className="text-sm text-dark-text truncate">{att.name}</div>
                      <div className="text-xs text-dark-text-secondary mt-1">{formatDate(att.modified)}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
