"use client";

import { useState } from "react";
import { Cloud, Check, RefreshCw, Settings } from "lucide-react";
import Link from "next/link";

export default function CloudSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("2 hours ago");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus("syncing");
    try {
      const response = await fetch('/api/cloud-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' }),
      });
      const data = await response.json();
      if (data.success) {
        setIsSyncing(false);
        setSyncStatus("success");
        setLastSync("Just now");
        setTimeout(() => setSyncStatus("idle"), 2000);
      } else {
        setIsSyncing(false);
        setSyncStatus("error");
      }
    } catch (error) {
      setIsSyncing(false);
      setSyncStatus("error");
    }
  };

  return (
    <div className="h-screen flex bg-dark-bg">
      <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <Link href="/chat">
            <img src="/logo.png" alt="Bloomy AI" className="w-8 h-8" />
          </Link>
          <span className="font-semibold text-dark-text">Cloud Sync</span>
        </div>
        
        <div className="px-4 py-2">
          <div className="text-xs text-dark-text-secondary mb-2">Sync Settings</div>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors flex items-center justify-between">
              <span>Auto-sync</span>
              <div className="w-4 h-4 bg-bloomy-purple rounded-full" />
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors flex items-center justify-between">
              <span>Sync chats</span>
              <div className="w-4 h-4 bg-bloomy-purple rounded-full" />
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors flex items-center justify-between">
              <span>Sync files</span>
              <div className="w-4 h-4 bg-bloomy-purple rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-dark-text mb-1">Sync Status</h3>
                  <p className="text-sm text-dark-text-secondary">Last synced: {lastSync}</p>
                </div>
                <div className="flex items-center gap-2">
                  {syncStatus === "success" && (
                    <div className="flex items-center gap-1 text-green-500">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Synced</span>
                    </div>
                  )}
                  <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="bg-gradient-to-r from-bloomy-blue to-bloomy-purple px-4 py-2 rounded-lg font-medium text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSyncing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Cloud className="w-4 h-4" />
                    )}
                    Sync Now
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-bloomy-blue/20 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-bloomy-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text">Chats</h4>
                    <p className="text-sm text-dark-text-secondary">24 conversations</p>
                  </div>
                </div>
                <div className="text-sm text-dark-text-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Synced</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-bloomy-purple/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-bloomy-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text">Settings</h4>
                    <p className="text-sm text-dark-text-secondary">Preferences</p>
                  </div>
                </div>
                <div className="text-sm text-dark-text-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Synced</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-bloomy-blue/20 flex items-center justify-center">
                    <Cloud className="w-5 h-5 text-bloomy-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text">Files</h4>
                    <p className="text-sm text-dark-text-secondary">12 files</p>
                  </div>
                </div>
                <div className="text-sm text-dark-text-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing...</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-bloomy-purple/20 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-bloomy-purple" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark-text">Workspaces</h4>
                    <p className="text-sm text-dark-text-secondary">3 workspaces</p>
                  </div>
                </div>
                <div className="text-sm text-dark-text-secondary">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Synced</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
