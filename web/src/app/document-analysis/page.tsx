"use client";

import { useState } from "react";
import { FileText, Upload, Sparkles, RefreshCw, Download } from "lucide-react";
import Link from "next/link";

export default function DocumentAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    // TODO: Implement actual document analysis API
    setTimeout(() => {
      setAnalysis("Document analysis results would appear here. This would include summaries, key insights, entity extraction, sentiment analysis, and more.");
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="h-screen flex bg-dark-bg">
      <div className="w-64 bg-dark-surface border-r border-dark-border flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <Link href="/chat">
            <img src="/logo.png" alt="Bloomy AI" className="w-8 h-8" />
          </Link>
          <span className="font-semibold text-dark-text">Document Analysis</span>
        </div>
        
        <div className="px-4 py-2">
          <div className="text-xs text-dark-text-secondary mb-2">Analysis Options</div>
          <div className="space-y-1">
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Summary
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Key Insights
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Entity Extraction
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-dark-text-secondary hover:bg-dark-card rounded-md transition-colors">
              Sentiment Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8 flex flex-col items-center justify-center">
          {!file ? (
            <div className="text-center">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-dark-border rounded-lg p-12 hover:border-dark-border transition-colors">
                  <Upload className="w-16 h-16 text-dark-text-secondary mx-auto mb-4" />
                  <p className="text-dark-text-secondary mb-2">Upload a document to analyze</p>
                  <p className="text-sm text-dark-text-secondary">PDF, DOCX, TXT supported</p>
                </div>
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".pdf,.docx,.txt" />
              </label>
            </div>
          ) : (
            <div className="w-full max-w-3xl">
              <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-dark-text-secondary" />
                  <div>
                    <p className="font-medium text-dark-text">{file.name}</p>
                    <p className="text-sm text-dark-text-secondary">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-dark-text-secondary hover:text-dark-text"
                >
                  Remove
                </button>
              </div>

              {analysis ? (
                <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-dark-text">Analysis Results</h3>
                    <button className="flex items-center gap-2 text-sm text-dark-text-secondary hover:text-dark-text">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                  <p className="text-dark-text">{analysis}</p>
                </div>
              ) : (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full bg-gradient-to-r from-bloomy-blue to-bloomy-purple px-6 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Analyze Document
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
