"use client";

import { useState } from "react";
import { Mic, Volume2, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function VoiceAI() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual speech recognition
  };

  const handleSpeak = () => {
    if (!transcript.trim()) return;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-screen flex bg-dark-bg">
      <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <Link href="/chat">
            <img src="/logo.png" alt="Bloomy AI" className="w-8 h-8" />
          </Link>
          <span className="font-semibold text-dark-text">Voice AI</span>
        </div>
        
        <div className="px-4 py-2">
          <div className="text-xs text-dark-text-secondary mb-2">Voice Settings</div>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              English (US)
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              English (UK)
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Spanish
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark-text">Transcript</h3>
                <button
                  onClick={handleSpeak}
                  disabled={!transcript.trim() || isSpeaking}
                  className="p-2 hover:bg-dark-surface rounded-md transition-colors disabled:opacity-50"
                >
                  {isSpeaking ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              </div>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Your speech will appear here..."
                className="w-full h-32 bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-dark-text placeholder-dark-text-secondary focus:outline-none focus:border-dark-border resize-none"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRecord}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-bloomy-blue to-bloomy-purple'
                }`}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
            </div>
            <p className="text-center text-dark-text-secondary mt-4">
              {isRecording ? "Recording..." : "Tap to start recording"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
