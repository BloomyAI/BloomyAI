"use client";

import { useEffect, useRef } from "react";
import { Zap, Plus, Copy, Check, ToggleLeft, ToggleRight } from "lucide-react";
import type { ChatMessage, Conversation } from "@/lib/ide/types";

interface AiAgentPanelProps {
  conversations: Conversation[];
  activeConvId: string | null;
  aiOutput: string;
  aiPrompt: string;
  isGenerating: boolean;
  autoApply: boolean;
  onAutoApplyChange: (v: boolean) => void;
  onPromptChange: (v: string) => void;
  onSend: () => void;
  onNewChat: () => void;
  onCopy: () => void;
  copied: boolean;
}

export function AiAgentPanel({
  conversations,
  activeConvId,
  aiOutput,
  aiPrompt,
  isGenerating,
  autoApply,
  onAutoApplyChange,
  onPromptChange,
  onSend,
  onNewChat,
  onCopy,
  copied,
}: AiAgentPanelProps) {
  const messagesRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find((c) => c.id === activeConvId);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [activeConv?.messages, aiOutput, isGenerating]);

  return (
    <div className="flex flex-col h-full bg-[#252526]">
      <div className="h-[35px] flex items-center px-3 gap-2 border-b border-[#2b2b2b] shrink-0">
        <Zap className="w-4 h-4 text-[#007acc]" />
        <span className="text-[13px] text-[#cccccc] font-medium">Bloomy Coder</span>
        <div className="flex-1" />
        <button
          onClick={() => onAutoApplyChange(!autoApply)}
          className="flex items-center gap-1 text-[11px] text-[#858585] hover:text-[#cccccc]"
          title="Auto Apply AI file changes"
        >
          {autoApply ? <ToggleRight className="w-4 h-4 text-[#007acc]" /> : <ToggleLeft className="w-4 h-4" />}
          Auto Apply
        </button>
        <button onClick={onNewChat} className="p-1 hover:bg-[#2a2d2e] rounded" title="New Chat">
          <Plus className="w-4 h-4 text-[#858585]" />
        </button>
        <button onClick={onCopy} className="p-1 hover:bg-[#2a2d2e] rounded" title="Copy">
          {copied ? <Check className="w-4 h-4 text-[#89d185]" /> : <Copy className="w-4 h-4 text-[#858585]" />}
        </button>
      </div>

      <div ref={messagesRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeConv?.messages.map((msg: ChatMessage) => (
          <div
            key={msg.id}
            className={`text-[13px] rounded p-2 ${
              msg.role === "user"
                ? "bg-[#2d2d2d] text-[#cccccc]"
                : "bg-[#1e1e1e] text-[#cccccc] border border-[#3c3c3c]"
            }`}
          >
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</pre>
          </div>
        ))}
        {isGenerating && aiOutput && (
          <div className="text-[13px] bg-[#1e1e1e] text-[#cccccc] border border-[#3c3c3c] rounded p-2">
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{aiOutput}</pre>
          </div>
        )}
        {!activeConv?.messages.length && !aiOutput && !isGenerating && (
          <p className="text-[13px] text-[#858585] leading-relaxed">
            Ask Bloomy Coder to create or edit files. With Auto Apply on, files are added to your project automatically.
          </p>
        )}
      </div>

      <div className="p-3 border-t border-[#2b2b2b] shrink-0">
        <div className="flex gap-2">
          <textarea
            value={aiPrompt}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isGenerating) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask Bloomy Coder... (Ctrl+Enter)"
            rows={3}
            className="flex-1 bg-[#3c3c3c] border border-[#3c3c3c] focus:border-[#007acc] rounded px-3 py-2 text-[13px] text-[#cccccc] placeholder-[#858585] focus:outline-none resize-none"
          />
          <button
            onClick={onSend}
            disabled={isGenerating || !aiPrompt.trim()}
            className="px-3 py-2 bg-[#0e639c] hover:bg-[#1177bb] rounded text-[13px] text-[#ffffff] disabled:opacity-50 self-end"
          >
            {isGenerating ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
