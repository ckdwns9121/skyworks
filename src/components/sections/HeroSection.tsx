"use client";

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
