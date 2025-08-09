import React, { useRef, useEffect, useState, forwardRef } from "react";

interface VideoScaleProps {
  videoSrc: string;
  text: string;
  index: number;
  dark?: boolean;
}

const MAX_SCALE = 1.45;
const MIN_SCALE = 0.8;

const VideoScale = forwardRef<HTMLDivElement, VideoScaleProps>(({ videoSrc, text, index, dark = false }, ref) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    let rafId: number | null = null;

    const loop = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionCenter = rect.top + rect.height / 2;
        const windowCenter = windowHeight / 2;
        const distance = Math.abs(sectionCenter - windowCenter);
        const maxDistance = windowHeight / 2 + rect.height / 2;
        const norm = Math.min(distance / maxDistance, 1); // 0..1

        // 부드러운 곡선(smoothstep)으로 진행률 변환
        const smooth = (t: number) => t * t * (3 - 2 * t);
        const progress = 1 - smooth(norm); // 중앙에서 1, 바깥에서 0

        const s = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * progress;
        setScale(s);
        setOpacity(0.3 + 0.7 * progress); // 0.3 ~ 1.0 범위로 부드럽게
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    const onResize = () => {};
    window.addEventListener("resize", onResize);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
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
          transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 1,
          willChange: "transform, opacity",
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
