"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import ScrollTriggerText from "@/components/sections/SpaceSection/ScrollTriggerText";
import ClientMarqueeSection from "@/components/sections/ClientMarqueeSection/ClientMarqueeSection";
import VideoScaleSection from "@/components/common/VideoScale";
import StickyNav from "@/components/common/StickyNav";

export default function SpaceSection() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number | null>(null);
  // ScrollTriggerText 관련 상태 모두 제거
  const [clientDark, setClientDark] = useState(false); // 클라이언트 섹션의 dark 상태
  const videoList = [
    { src: "/videos/hero-video.mp4", text: "Music & Live" },
    { src: "/videos/hero-video.mp4", text: "Concert & Event" },
    { src: "/videos/hero-video.mp4", text: "Brand Film" },
    { src: "/videos/hero-video.mp4", text: "Documentary" },
    { src: "/videos/hero-video.mp4", text: "Advertising" },
  ];
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000); // aspect는 아래에서 설정
    camera.position.set(0, 0, 8); // 15 → 8로 변경
    cameraRef.current = camera;

    // mountRef의 크기를 기준으로 캔버스 크기 설정
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#151515"); // 배경색 설정
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 카메라 비율도 mountRef 기준으로 설정
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // POST-PROCESSING: Composer + Bloom (강도 낮춤)
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    // bloom 효과 제거
    composerRef.current = composer;

    // PARTICLES
    const particleCount = 100000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      let radius;
      const ratio = Math.random();
      if (ratio < 0.05) {
        // 5%만 중심부(0~2)에 생성
        radius = Math.random() * 2;
      } else {
        // 95%는 2~20에 생성 (기존 2~8 → 2~20)
        radius = 2 + Math.random() * 18;
      }
      const branch = ((i % 4) / 4) * Math.PI * 2;
      const spin = radius * 1.5;

      const x = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * 0.5;
      const y = (Math.random() - 0.5) * 0.5;
      const z = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * 0.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = Math.max(0.05, 0.2 - Math.sqrt(x * x + y * y) * 0.01);

      const colorVariation = Math.random();
      if (radius < 2) {
        // 중심부 → 적당히 밝게 (너무 과하지 않게 1.5~2)
        colors[i * 3] = 2;
        colors[i * 3 + 1] = 2;
        colors[i * 3 + 2] = 2;
      } else if (colorVariation < 0.3) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (colorVariation < 0.6) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.7;
        colors[i * 3 + 2] = 0.3;
      } else {
        colors[i * 3] = 0.4;
        colors[i * 3 + 1] = 0.6;
        colors[i * 3 + 2] = 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        
        void main() {
          vColor = color;
          float flicker = sin(time * 2.0 + position.x * 50.0 + position.y * 50.0) * 0.3 + 0.7;
          vAlpha = flicker;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
          gl_FragColor = vec4(vColor, alpha * vAlpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // === 안개 파티클 추가 (별 파티클과 같은 분포, 적은 수, 크게, 투명하게) ===
    const fogParticleCount = 60; // 훨씬 적게
    const fogPositions = new Float32Array(fogParticleCount * 3);
    const fogSizes = new Float32Array(fogParticleCount);
    for (let i = 0; i < fogParticleCount; i++) {
      let radius;
      const ratio = Math.random();
      if (ratio < 0.05) {
        radius = Math.random() * 2;
      } else {
        radius = 2 + Math.random() * 18;
      }
      const branch = ((i % 4) / 4) * Math.PI * 2;
      const spin = radius * 1.5;
      const x = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * 0.5;
      const y = (Math.random() - 0.5) * 0.5;
      const z = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * 0.5;
      fogPositions[i * 3] = x;
      fogPositions[i * 3 + 1] = y;
      fogPositions[i * 3 + 2] = z;
      fogSizes[i] = 10 + Math.random() * 14; // 10~24 사이 크게
    }
    const fogGeometry = new THREE.BufferGeometry();
    fogGeometry.setAttribute("position", new THREE.BufferAttribute(fogPositions, 3));
    fogGeometry.setAttribute("size", new THREE.BufferAttribute(fogSizes, 1));
    const fogTexture = new THREE.TextureLoader().load("/images/assets/particle_blur.png");
    const fogMaterial = new THREE.PointsMaterial({
      map: fogTexture,
      size: 16,
      transparent: true,
      opacity: 0.09,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0x6ecaff, // 밝은 파랑
    });
    const fogParticles = new THREE.Points(fogGeometry, fogMaterial);
    fogParticles.name = "fogParticles";
    scene.add(fogParticles);
    // === 안개 파티클 추가 끝 ===

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      if (particlesRef.current) {
        // 기본 회전(항상 적용)
        particlesRef.current.rotation.y += 0.0005;
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
      }
      // 안개 파티클도 약간씩 회전
      const fog = scene.getObjectByName("fogParticles");
      if (fog) {
        fog.rotation.y += 0.00015;
      }

      if (composerRef.current) {
        composerRef.current.render();
      }
    };
    animate();

    const handleScroll = () => {
      // ... three.js 카메라/파티클 스크롤 효과만 남김 ...
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const visibleRatio = (window.innerHeight - rect.top) / rect.height;
      if (cameraRef.current && particlesRef.current) {
        if (visibleRatio < 0.5) {
          cameraRef.current.position.set(0, 0, 15);
          cameraRef.current.lookAt(0, 0, 0);
          return;
        }
        const progress = Math.min((visibleRatio - 0.5) / 0.5, 1);
        const startPos = new THREE.Vector3(0, 0, 8); // 15 → 8
        const midPos = new THREE.Vector3(0, 0, 18); // 40 → 18
        const endPos = new THREE.Vector3(0, 10, 12); // 25 → 12
        const rotationAmount = Math.PI * 1.5;
        if (progress < 0.6) {
          const phase = progress / 0.6;
          cameraRef.current.position.lerpVectors(startPos, midPos, phase);
          particlesRef.current.rotation.y = rotationAmount * phase;
          cameraRef.current.lookAt(0, 0, 0);
        } else {
          const phase = (progress - 0.6) / 0.4;
          cameraRef.current.position.lerpVectors(midPos, endPos, phase);
          particlesRef.current.rotation.y = rotationAmount;
          cameraRef.current.lookAt(0, 0, 0);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 각 비디오 섹션의 중앙이 화면 중앙에 가장 가까운 것의 인덱스를 찾음
      const windowCenter = window.innerHeight / 2;
      let minDist = Infinity;
      let idx = 0;
      videoRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - windowCenter);
        if (dist < minDist) {
          minDist = dist;
          idx = i;
        }
      });
      setCurrentVideoIdx(idx);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative z-10 h-[500vh] bg-[#151515] w-full font-[Pretendard,Hanken_Grotesk,-apple-system,BlinkMacSystemFont,system-ui,Roboto,Helvetica_Neue,Segoe_UI,Apple_SD_Gothic_Neo,Noto_Sans_KR,Malgun_Gothic,Apple_Color_Emoji,Segoe_UI_Emoji,Segoe_UI_Symbol,sans-serif] box-border m-0 p-0 border-0 text-[100%] align-baseline block"
        style={{
          lineHeight: 1,
        }}
      >
        {/* three.js 캔버스 */}
        <div
          ref={mountRef}
          className="sticky top-0 w-full h-screen opacity-40 pointer-events-none box-border m-0 p-0 border-0 text-[100%] align-baseline"
          style={{
            lineHeight: 1,
          }}
        />

        <div className="sticky top-[0px] w-[80vw] mx-auto h-[100vh] flex items-center justify-center pointer-events-none box-border m-0 p-0 mt-[-30vh] border-0 text-[100%] align-baseline">
          <ScrollTriggerText
            main="탄탄한 기획력과 현장 실행력을 바탕으로 최고의 결과물을 만듭니다."
            className="text-center"
          />
        </div>
      </section>
      {/* 다음 섹션(로고 마퀴) */}
      <ClientMarqueeSection onDarkChange={setClientDark} />
      {/* 비디오 섹션 전체를 감싸는 래퍼 */}
      <div style={{ position: "relative" }}>
        <StickyNav title={videoList[currentVideoIdx].text} index={currentVideoIdx} total={videoList.length} />
        {videoList.map((item, idx) => (
          <VideoScaleSection
            key={idx}
            videoSrc={item.src}
            text={item.text}
            index={idx}
            dark={clientDark}
            ref={(el) => {
              if (el) {
                videoRefs.current[idx] = el;
              }
            }}
          />
        ))}
      </div>
    </>
  );
}
