import React, { useRef, useEffect, useState, forwardRef } from "react";

interface VideoScaleProps {
  videoSrc: string;
  text: string;
  index: number;
  dark?: boolean;
}

const VideoScale = forwardRef<HTMLDivElement, VideoScaleProps>(({ videoSrc, text, index, dark = false }, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const windowCenter = windowHeight / 2;
      const distance = Math.abs(sectionCenter - windowCenter);
      const maxDistance = windowHeight / 2 + rect.height / 2;
      // 0(중앙) ~ 1(화면 밖)로 정규화
      const norm = Math.min(distance / maxDistance, 1);

      // 더 크게 커지도록 최대 스케일/최소 스케일 상향 조정
      const MAX_SCALE = 1.4; // 기존 1.2 → 1.4로 증대
      const MIN_SCALE = 0.75; // 하한은 살짝 완화

      let s: number;
      if (norm <= 0.5) {
        // 중앙에 접근할수록 1 → MAX_SCALE로 선형 증가
        const t = (0.5 - norm) / 0.5; // 0..1
        s = 1 + t * (MAX_SCALE - 1);
      } else {
        // 중앙을 지나 멀어질수록 MAX_SCALE → MIN_SCALE로 선형 감소
        const t = (norm - 0.5) / 0.5; // 0..1
        s = MAX_SCALE - t * (MAX_SCALE - MIN_SCALE);
      }
      s = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
      setScale(s);
      setOpacity(1 - norm * 0.7); // 멀어질수록 투명도 감소
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // ref 연결
  React.useImperativeHandle(ref, () => sectionRef.current as HTMLDivElement, [sectionRef.current]);

  return (
    <div
      ref={sectionRef}
      className="h-[120vh] flex flex-col items-center justify-center relative transition-colors duration-700"
      style={{
        zIndex: 10,
        background: "transparent",
        color: dark ? "#fff" : "#151515",
        transition: "background 0.7s cubic-bezier(0.4,0,0.2,1), color 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        className="flex items-center justify-center w-full"
        style={{
          transform: `scale(${scale})`,
          opacity,
          transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 1,
        }}
      >
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-xl shadow-lg w-[70vw] max-w-4xl h-[60vh] object-cover"
          style={{ background: "#222" }}
        />
      </div>
    </div>
  );
});

VideoScale.displayName = "VideoScale";

export default VideoScale;
