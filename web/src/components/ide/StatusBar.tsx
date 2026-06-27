"use client";

interface StatusBarProps {
  message: string;
  branch?: string;
  lineCol?: string;
  language?: string;
}

export function StatusBar({ message, branch = "main", lineCol, language }: StatusBarProps) {
  return (
    <div className="h-[22px] bg-[#007acc] flex items-center px-2 text-[#ffffff] text-xs shrink-0 select-none">
      <span className="px-2 hover:bg-[#ffffff1a] cursor-default truncate max-w-[40%]">{message}</span>
      <div className="flex-1" />
      {branch && (
        <span className="px-2 hover:bg-[#ffffff1a] cursor-default flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
            <path d="M7.93 1.01 6.73 2.21l1.27 1.27-1.27 1.27 1.2 1.2 1.27-1.27 1.27 1.27 1.2-1.2-1.27-1.27 1.27-1.27-1.2-1.2-1.27 1.27-1.27-1.27-1.2 1.2zM4.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.66 9.34l4.68-4.68 1.13 1.13-4.68 4.68-1.13-1.13z" />
          </svg>
          {branch}
        </span>
      )}
      {lineCol && <span className="px-2 hover:bg-[#ffffff1a] cursor-default">{lineCol}</span>}
      {language && <span className="px-2 hover:bg-[#ffffff1a] cursor-default">{language}</span>}
    </div>
  );
}
