import React from "react";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  variant?: "inline" | "card" | "minimal";
  className?: string;
}

export default function ErrorDisplay({ error, onRetry, variant = "inline", className = "" }: ErrorDisplayProps) {
  const baseClasses = "text-red-600 font-medium";

  if (variant === "minimal") {
    return <span className={`${baseClasses} text-sm ${className}`}>{error}</span>;
  }

  if (variant === "inline") {
    return (
      <div className={`${baseClasses} text-sm p-2 bg-red-50 border border-red-200 rounded ${className}`}>{error}</div>
    );
  }

  // card variant (default)
  return (
    <div className={`${baseClasses} p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-500">🚨</span>
        <span className="font-semibold">오류가 발생했습니다</span>
      </div>
      <p className="text-red-600 text-sm mb-3">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
