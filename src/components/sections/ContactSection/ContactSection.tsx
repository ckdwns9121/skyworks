"use client";

import React from "react";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="bg-white text-[#151515] w-full">
      <div className="w-full pt-20 px-6 pb-20">
        <div className="flex gap-8 items-center">
          {/* 왼쪽 이미지 영역 */}
          <div className="flex-1 h-[600px] relative rounded-lg overflow-hidden">
            <Image
              src="/images/assets/world.jpg"
              alt="SKYWORKS Production Studio"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* 오른쪽 텍스트 영역 */}
          <div className="flex-1 max-w-md">
            <div className="text-[14px] text-gray-500 mb-3">Contact Us</div>
            <h2 className="text-[36px] font-bold text-[#151515] mb-8 leading-tight">Ready for the Next Step?</h2>

            <div className="space-y-6 mb-10">
              <p className="text-[16px] leading-[1.7] text-[#151515]/80">
                저희는 다양한 분야의 제작 경험을 통해 각기 다른 장르에서도 참신하고 창의적인 콘텐츠를 만들어내며,
                클라이언트가 기대하는 그 이상의 만족을 제공합니다.
              </p>
              <p className="text-[16px] leading-[1.7] text-[#151515]/80">
                완성도 높은 결과물로 고객의 비전을 실현하는 종합 프로덕션입니다.
              </p>
            </div>

            <button
              className="inline-flex items-center gap-2 border border-[#151515] bg-white text-[#151515] px-8 py-4 text-[18px] font-medium transition hover:-translate-y-px hover:shadow-lg"
              type="button"
            >
              Contact →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
