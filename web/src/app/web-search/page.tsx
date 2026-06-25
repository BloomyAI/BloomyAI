"use client";

import { useState } from "react";
import { Search, ExternalLink, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function WebSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // TODO: Implement actual web search API
    setTimeout(() => {
      setResults([
        { title: "Example Result 1", url: "https://example.com", snippet: "This is a sample search result..." },
        { title: "Example Result 2", url: "https://example2.com", snippet: "Another sample search result..." },
        { title: "Example Result 3", url: "https://example3.com", snippet: "Yet another sample search result..." },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex bg-dark-bg">
      <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <Link href="/chat">
            <img src="/logo.png" alt="Bloomy AI" className="w-8 h-8" />
          </Link>
          <span className="font-semibold text-dark-text">Web Search</span>
        </div>
        
        <div className="px-4 py-2">
          <div className="text-xs text-dark-text-secondary mb-2">Search Filters</div>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              All Results
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              News
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Images
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Videos
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-8 border-b border-dark-border">
          <div className="max-w-3xl MX-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the web..."
                className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-dark-border"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="bg-gradient-to-r from-bloomy-blue to-bloomy-purple px-6 py-3 rounded-lg font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {results.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {results.map((result, index) => (
                <div key={index} className="bg-dark-card border border-dark-border rounded-lg p-4 hover:bg-dark-surface transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <ExternalLink className="w-4 h-4 text-dark-text-secondary" />
                    <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-sm text-dark-text-secondary hover:text-dark-text">
                      {result.url}
                    </a>
                  </div>
                  <h3 className="font-semibold text-dark-text mb-2">{result.title}</h3>
                  <p className="text-sm text-dark-text-secondary">{result.snippet}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <Search className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
              <p className="text-dark-text-secondary">Enter a query to search the web</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
