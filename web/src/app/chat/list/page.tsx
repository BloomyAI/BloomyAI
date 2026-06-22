"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Plus, Trash2, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
}

export default function ChatListPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConversations = localStorage.getItem('bloomy-conversations');
      if (savedConversations) {
        try {
          const parsed = JSON.parse(savedConversations);
          if (parsed && parsed.length > 0) {
            setConversations(parsed);
          }
        } catch (e) {
          console.error('Failed to load conversations:', e);
        }
      }
    }
  }, []);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      timestamp: new Date().toISOString(),
    };
    const updated = [newConversation, ...conversations];
    setConversations(updated);
    localStorage.setItem('bloomy-conversations', JSON.stringify(updated));
    window.location.href = `/chat/${newConversation.id}`;
  };

  const deleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    localStorage.setItem('bloomy-conversations', JSON.stringify(updated));
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
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
            <span className="text-xl font-bold gradient-text">Chats</span>
          </div>
          <button
            onClick={createNewConversation}
            className="flex items-center gap-2 px-4 py-2 bg-[#1E222B] hover:bg-[#252933] rounded-lg text-white text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
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
              placeholder="Search conversations..."
              className="w-full bg-[#15171E] border border-white/10 rounded-lg px-10 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/40 mb-4">No conversations yet</p>
              <button
                onClick={createNewConversation}
                className="px-6 py-3 bg-bloomy-purple hover:bg-bloomy-purple/80 rounded-lg text-white transition-colors"
              >
                Start your first conversation
              </button>
            </div>
          ) : (
            filteredConversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/chat/${conv.id}`}
                  className="block bg-[#15171E] hover:bg-[#1E222B] border border-white/10 rounded-lg p-4 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-bloomy-purple" />
                        <h3 className="text-white font-medium">{conv.title}</h3>
                      </div>
                      <p className="text-sm text-white/60">
                        {conv.messages.length > 0
                          ? conv.messages[conv.messages.length - 1].content.slice(0, 100) +
                            (conv.messages[conv.messages.length - 1].content.length > 100 ? "..." : "")
                          : "No messages yet"}
                      </p>
                      <p className="text-xs text-white/40 mt-2">{formatDate(conv.timestamp)}</p>
                    </div>
                    <button
                      onClick={(e) => deleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-white/60" />
                    </button>
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
