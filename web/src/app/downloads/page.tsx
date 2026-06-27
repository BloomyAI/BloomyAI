"use client";

import { motion } from "framer-motion";
import { Download, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function DownloadsPage() {
  const platforms = [
    { name: "Windows", icon: "fa-brands fa-microsoft", size: "97.4 MB", status: "Available", version: "1.0.0", file: "/downloads/bloomy-desktop.zip" },
    { name: "macOS", icon: "fa-brands fa-apple", size: "116 MB", status: "Available", version: "1.0.0", file: "/downloads/bloomy-desktop-macos.zip" },
    { name: "Linux", icon: "fa-brands fa-linux", size: "120 MB", status: "Available", version: "1.0.0", file: "/downloads/bloomy-desktop-linux.zip" },
    { name: "iOS", icon: "fa-brands fa-app-store-ios", size: "98 MB", status: "Coming Soon", version: "1.0.0" },
    { name: "Android", icon: "fa-brands fa-android", size: "105 MB", status: "Coming Soon", version: "1.0.0" },
  ];

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
          <h1 className="text-4xl font-bold mb-4 gradient-text">Download Bloomy AI</h1>
          <p className="text-white/70 mb-12">Get Bloomy AI on your preferred platform</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl text-bloomy-purple">
                    <i className={platform.icon}></i>
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${
                    platform.status === "Available" ? "text-green-400" : "text-yellow-400"
                  }`}>
                    {platform.status === "Available" ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    {platform.status}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                <p className="text-white/60 mb-4">{platform.size} • Version {platform.version}</p>
                <button
                  onClick={() => {
                    if (platform.status === "Available" && platform.file) {
                      const a = document.createElement("a");
                      a.href = platform.file;
                      a.download = platform.file.split("/").pop() || "download.zip";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }
                  }}
                  className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    platform.status === "Available"
                      ? "btn-primary hover:scale-[1.02] transition-transform"
                      : "btn-secondary opacity-50 cursor-not-allowed"
                  }`}
                  disabled={platform.status !== "Available"}
                >
                  <Download className="w-4 h-4" />
                  {platform.status === "Available" ? "Download" : "Coming Soon"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* System Requirements */}
          <div className="mt-12 glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 gradient-text">System Requirements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-bloomy-purple">Windows</h3>
                <ul className="text-white/70 space-y-1 text-sm">
                  <li>• Windows 10 or later</li>
                  <li>• 4GB RAM minimum</li>
                  <li>• 500MB free disk space</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-bloomy-purple">macOS</h3>
                <ul className="text-white/70 space-y-1 text-sm">
                  <li>• macOS 11.0 or later</li>
                  <li>• 4GB RAM minimum</li>
                  <li>• 500MB free disk space</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
