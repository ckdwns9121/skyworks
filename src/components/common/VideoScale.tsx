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
      // scale up: 중앙에 가까울수록 커짐(최대 1.2), scale out: 중앙 지나면 작아짐(최소 0.7)
      let s = 1 + (1 - norm) * 1.5; // 1~1.2
      if (norm > 0.5) {
        // 중앙에서 멀어질 때 scale out
        s = 1.2 - (norm - 0.5) * 1.0; // 1.2~0.7
      }
      s = Math.max(0.7, Math.min(1.2, s));
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
