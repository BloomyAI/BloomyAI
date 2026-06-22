"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Bell, Shield, Palette, Globe, Key, Save } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    language: "en",
    notifications: true,
    autoSave: true,
    fontSize: 14,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 gradient-text">Settings</h1>
          <p className="text-white/70 mb-12">Customize your Bloomy AI experience</p>

          <div className="space-y-6">
            {/* Account Settings */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5 text-bloomy-purple" />
                <h2 className="text-xl font-semibold">Account</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Email</label>
                  <input
                    type="email"
                    defaultValue="user@example.com"
                    className="w-full bg-[#15171E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Username</label>
                  <input
                    type="text"
                    defaultValue="BloomyUser"
                    className="w-full bg-[#15171E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  />
                </div>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-bloomy-purple" />
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                    className="w-full bg-[#15171E] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-bloomy-purple/50"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/80">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-sm text-white/60 mt-1">{settings.fontSize}px</div>
                </div>
              </div>
            </div>

            {/* Notifications Settings */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-bloomy-purple" />
                <h2 className="text-xl font-semibold">Notifications</h2>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white/80">Enable notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-white/80">Auto-save conversations</span>
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                    className="rounded"
                  />
                </label>
              </div>
            </div>

            {/* Security Settings */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-bloomy-purple" />
                <h2 className="text-xl font-semibold">Security</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full btn-secondary py-3 flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" />
                  Change Password
                </button>
                <button className="w-full btn-secondary py-3 flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  Manage API Keys
                </button>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
