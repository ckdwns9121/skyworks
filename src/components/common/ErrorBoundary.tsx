"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // 에러가 발생하면 상태를 업데이트하여 fallback UI를 렌더링
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    console.error("ErrorBoundary에서 에러 포착:", error, errorInfo);

    // 부모 컴포넌트에 에러 알림
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 에러가 발생한 경우 fallback UI 렌더링
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-600 text-lg font-semibold mb-2">🚨 오류가 발생했습니다</div>
          <div className="text-red-500 text-sm text-center mb-4">
            예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            페이지 새로고침
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
