"use client";

import React from "react";

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
      {/* 상단 텍스트 영역 */}
      <div className="col-span-12 flex flex-col items-center mb-8">
        <div className="text-gray-400 text-lg mb-2">Decade of Expertise</div>
        <div className="w-full h-px bg-gray-300 mb-2"></div>
        <div className="text-gray-400 text-lg mb-2">Unstoppable Dedication</div>
        <div className="w-full h-px bg-gray-300"></div>
      </div>

      {/* 네비게이션 링크 */}
      <div className="col-span-2 col-start-2">
        <div className="text-white space-y-4">
          <div className="text-lg font-medium">About</div>
          <div className="text-lg font-medium">Work</div>
          <div className="text-lg font-medium">Service</div>
          <div className="text-lg font-medium">Contact</div>
        </div>
      </div>

      {/* 주소 정보 */}
      <div className="col-span-3 col-start-4">
        <div className="text-white">
          <div className="text-lg font-medium mb-4">Address</div>
          <div className="text-sm text-gray-200 leading-relaxed">
            <div>경기 안양시 동안구 시민대로327번길 11-41,</div>
            <div>안양창업지원센터 808호</div>
          </div>
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="col-span-3 col-start-7">
        <div className="text-white">
          <div className="text-lg font-medium mb-4">Contact</div>
          <div className="text-sm text-gray-200 leading-relaxed">
            <div>0507-1357-9436</div>
            <div>ceo@skyworkss.com</div>
          </div>
        </div>
      </div>

      {/* SNS 링크 */}
      <div className="col-span-3 col-start-10">
        <div className="text-white">
          <div className="text-lg font-medium mb-4">SNS</div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <span className="text-sm text-gray-200">Instagram</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <span className="text-sm text-gray-200">Youtube</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <span className="text-sm text-gray-200">Kakao Talk</span>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 영역 */}
      <div className="col-span-12 flex items-end justify-between mt-auto">
        {/* 저작권 정보 */}
        <div className="text-white text-sm">
          <div>COPYRIGHT© 2025.</div>
          <div>Skyworks Corp. ALL RIGHT RESERVED.</div>
        </div>

        {/* SKYWORKS 로고 */}
        <div className="text-white text-6xl font-black tracking-wider">SKYWORKS</div>
      </div>
    </footer>
  );
}
