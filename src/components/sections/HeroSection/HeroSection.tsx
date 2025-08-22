"use client";

import TransitionLink from "@/components/common/TransitionLink";

export default function HeroSection() {
  return (
    <section className="relative w-full flex flex-col items-center justify-start z-20 bg-[#151515] pt-40 pb-16">
      {/* 메인 타이틀 */}
      <div className="w-full flex flex-col items-center mb-12">
        <h1 className="text-3xl md:text-6xl lg:text6xl font-bold text-white text-center leading-tight">
          MAKE
          <br />
          CREATIVE CONTENT, POSITIVE VALUE, NEW CULTURE
        </h1>
        <p className="text-lg md:text-2xl font-light mt-6 text-white text-center">
          최고의 기술력과 장비로 현장을 꾸리고, 특별한 영상을 제작합니다.
        </p>

        {/* About 페이지 링크 */}
        <div className="mt-8">
          <TransitionLink
            href="/about"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            About SKYWORKS
          </TransitionLink>
        </div>
      </div>
      {/* 비디오 카드 */}
      <div className="w-full px-[20px]">
        <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-2xl bg-[#f5f2f2] flex items-center justify-center">
          <video
            className="w-full h-full object-cover"
            src="/videos/hero-video.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ background: "#f5f2f2" }}
          />
        </div>
      </div>
    </section>
  );
}
