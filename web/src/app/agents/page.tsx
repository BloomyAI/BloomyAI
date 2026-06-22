"use client";

import { motion } from "framer-motion";
import { Zap, Brain, Sparkles, Code, MessageSquare, FileText, Settings, Lock } from "lucide-react";

export default function AgentsPage() {
  const agents = [
    {
      name: "Bloomy Flash",
      icon: Zap,
      description: "Fast, lightweight models for quick responses",
      useCase: "Quick tasks & simple queries",
      color: "from-bloomy-pink to-bloomy-purple",
      model: "google/gemma-3-27b-it:free"
    },
    {
      name: "Bloomy Core",
      icon: Brain,
      description: "Balanced performance for general tasks",
      useCase: "Everyday AI assistance",
      color: "from-bloomy-purple to-bloomy-blue",
      model: "google/gemma-3-27b-it:free"
    },
    {
      name: "Bloomy Pro",
      icon: Sparkles,
      description: "High-performance models for complex tasks",
      useCase: "Complex research & analysis",
      color: "from-bloomy-blue to-bloomy-purple",
      model: "anthropic/claude-3.5-sonnet"
    },
    {
      name: "Bloomy Coder",
      icon: Code,
      description: "Specialized coding models for software development",
      useCase: "Software development",
      color: "from-bloomy-pink to-bloomy-blue",
      model: "anthropic/claude-3.5-sonnet"
    },
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
          <h1 className="text-4xl font-bold mb-4 gradient-text">AI Agents</h1>
          <p className="text-white/70 mb-12">Choose the right agent for your task</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center mb-4`}>
                  <agent.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{agent.name}</h3>
                <p className="text-white/70 mb-4">{agent.description}</p>
                <div className="text-sm text-bloomy-purple font-medium mb-4">{agent.useCase}</div>
                <div className="text-xs text-white/40 font-mono">{agent.model}</div>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="mt-12 glass-card p-6">
            <h2 className="text-2xl font-bold mb-4 gradient-text">Agent Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-bloomy-purple mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Natural Conversations</h3>
                  <p className="text-white/70 text-sm">Engage in natural, context-aware conversations</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-bloomy-purple mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">File Processing</h3>
                  <p className="text-white/70 text-sm">Process and analyze various file types</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-bloomy-purple mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Secure & Private</h3>
                  <p className="text-white/70 text-sm">Your data stays private and secure</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
