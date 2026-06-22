"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Sparkles, Plus, User, MessageSquarePlus } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function SimpleChatPage() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState("flash");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check authentication on load
  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = '/login';
    }
  }, [status]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    if (!session) {
      window.location.href = '/login';
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          model: selectedModel,
          conversationId: 'simple-chat',
          attachments: [],
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      if (reader) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          for (const line of text.split('\n')) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === 'chunk') {
                  assistantContent += data.content;
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantContent }
                      : msg
                  ));
                } else if (data.type === 'done') {
                  assistantContent = data.content || assistantContent;
                } else if (data.type === 'error') {
                  assistantContent = data.content || 'Error occurred';
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Bloomy" className="w-8 h-8 rounded-full" />
          <span className="text-white font-semibold">Bloomy AI</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600"
          >
            <option value="flash">Flash</option>
            <option value="core">Core</option>
            <option value="pro">Pro</option>
            <option value="code">Code</option>
          </select>
          <button
            onClick={handleNewChat}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="New chat"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
          {session?.user?.image ? (
            <img src={session.user.image} alt="User" className="w-8 h-8 rounded-full cursor-pointer" onClick={handleLogout} title="Logout" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs cursor-pointer" onClick={handleLogout} title="Logout">
              {session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AN'}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Sparkles className="w-16 h-16 text-purple-500 mb-4" />
            <h1 className="text-2xl font-semibold text-white mb-2">How can I help you today?</h1>
            <p className="text-gray-400">Start a conversation with Bloomy AI</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                    <img src="/logo.png" alt="Bloomy" className="w-8 h-8 rounded-full" />
                  </div>
                )}
                <div
                  className={`max-w-2xl p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-white border border-gray-700"
                  }`}
                >
                  {message.role === "user" && session?.user?.image && (
                    <div className="flex items-center gap-2 mb-2">
                      <img src={session.user.image} alt="User" className="w-6 h-6 rounded-full" />
                      <span className="text-xs text-purple-200">{session.user.name}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  <img src="/logo.png" alt="Bloomy" className="w-8 h-8 rounded-full" />
                </div>
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 bg-gray-700 border-2 border-gray-600 rounded-lg p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Bloomy AI..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none text-sm"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
