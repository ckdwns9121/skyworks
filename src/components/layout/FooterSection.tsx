"use client";

import React from "react";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-[-99]"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
        padding: "32px 24px 24px",
        gap: "24px",
        backgroundColor: "#234198",
        height: "680px",
      }}
    >
      {/* 하단 영역 */}
      <div className="col-span-12 flex items-end justify-between mt-auto">
        {/* 저작권 정보 */}
        <div className="text-white text-sm">
          <div>COPYRIGHT© 2025.</div>
          <div>Skyworks Corp. ALL RIGHT RESERVED.</div>
        </div>

        {/* SKYWORKS 로고 */}
        <div className="text-white text-6xl font-black tracking-wider">
          <Image src="/logo.svg" alt="SKYWORKS" width={500} height={500} className="w-full h-full" />
        </div>
      </div>
    </footer>
  );
}
