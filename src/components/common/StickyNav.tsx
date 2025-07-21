import React from "react";

interface StickyNavProps {
  title: string;
  index: number;
  total: number;
}

export default function StickyNav({ title, index, total }: StickyNavProps) {
  return (
    <nav
      className="sticky top-1/2 -translate-y-1/2 left-0 w-full z-[100] bg-transparent flex items-center justify-center h-16 px-8 text-[#aaa] text-2xl font-medium tracking-wide pointer-events-auto select-none mix-blend-difference"
      style={{ minHeight: 64 }}
    >
      <div className="flex items-center justify-between w-full max-w-8xl mx-auto">
        <span className="text-lg text-[#aaa]">Work</span>
        <span className="text-6xl text-[#aaa] font-semibold">{title}</span>
        <span className="text-lg text-[#aaa]">
          ({index + 1} / {total})
        </span>
      </div>
    </nav>
  );
}
