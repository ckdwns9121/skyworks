"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionContextType {
  startTransition: (url: string, callback?: () => void) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType | null>(null);

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error("usePageTransition must be used within PageTransitionProvider");
  }
  return context;
};

interface PageTransitionProviderProps {
  children: ReactNode;
}

export function PageTransitionProvider({ children }: PageTransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionCallback, setTransitionCallback] = useState<(() => void) | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("");
  const pathname = usePathname();

  // 경로 변경 감지
  useEffect(() => {
    if (pathname !== currentPath) {
      setCurrentPath(pathname);
    }
  }, [pathname, currentPath]);

  const startTransition = useCallback((url: string, callback?: () => void) => {
    setIsTransitioning(true);
    setTransitionCallback(() => callback || (() => (window.location.href = url)));
  }, []);

  const handleTransitionComplete = useCallback(() => {
    if (transitionCallback) {
      transitionCallback();
    }

    // 트랜지션 완료 후 상태 리셋
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionCallback(null);
    }, 300);
  }, [transitionCallback]);

  return (
    <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
      {children}

      {/* 페이지 트랜지션 오버레이 */}
      <AnimatePresence mode="wait">
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999] origin-top"
            style={{ backgroundColor: "#234198" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              // 애니메이션 완료 후 페이지 전환
              setTimeout(handleTransitionComplete, 200);
            }}
          />
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}

export default PageTransitionProvider;
