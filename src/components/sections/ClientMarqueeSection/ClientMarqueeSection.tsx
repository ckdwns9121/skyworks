import React, { useEffect, useRef, useState } from "react";
import MarqueeLogo from "../../common/MarqueeLogo";

export default function ClientMarqueeSection({ onDarkChange }: { onDarkChange?: (dark: boolean) => void } = {}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [bgState, setBgState] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visible = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
      const ratio = visible / rect.height;
      let newBgState: "dark" | "light";
      if (ratio < 0.5) {
        newBgState = "dark";
      } else if (ratio < 0.9) {
        newBgState = "light";
      } else {
        newBgState = "dark";
      }
      setBgState(newBgState);
      if (onDarkChange) onDarkChange(newBgState === "dark");
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [onDarkChange]);

  return (
    <div
      ref={sectionRef}
      className="h-[200vh] flex flex-col items-center justify-center text-3xl transition-colors duration-700"
      style={{
        background: bgState === "dark" ? "#151515" : "#fff",
        color: bgState === "dark" ? "#fff" : "#151515",
      }}
    >
      <div className="mb-8 text-center text-2xl font-bold">함께한 클라이언트</div>
      <div className="mb-4 text-center text-base font-normal opacity-80">다양한 분야의 파트너와 협업해왔습니다</div>
      <MarqueeLogo images={["/file.svg", "/globe.svg", "/next.svg", "/vercel.svg", "/window.svg"]} height={60} />
    </div>
  );
}
