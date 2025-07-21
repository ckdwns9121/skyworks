import React, { useEffect, useRef, useState } from "react";
import MarqueeLogo from "../../common/MarqueeLogo";

export default function ClientMarqueeSection({ onDarkChange }: { onDarkChange?: (dark: boolean) => void } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgState, setBgState] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        let newBgState: "dark" | "light";
        if (ratio >= 0.2 && ratio < 0.7) {
          newBgState = "light";
        } else {
          newBgState = "dark";
        }
        setBgState(newBgState);
        if (onDarkChange) onDarkChange(newBgState === "dark");
      },
      {
        threshold: Array.from({ length: 101 }, (_, i) => i / 100),
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [onDarkChange]);

  return (
    <div
      ref={sectionRef}
      className={`h-[200vh] flex flex-col items-center justify-center text-3xl transition-colors duration-700 ${
        bgState === "dark" ? "bg-[#151515] text-white" : "bg-white text-[#151515]"
      }`}
    >
      <div className="mb-8 text-center text-2xl font-bold">함께한 클라이언트</div>
      <div className="mb-4 text-center text-base font-normal opacity-80">다양한 분야의 파트너와 협업해왔습니다</div>
      <MarqueeLogo images={["/file.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/window.svg"]} height={60} />
    </div>
  );
}
