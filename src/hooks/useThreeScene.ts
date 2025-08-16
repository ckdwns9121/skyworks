import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { PARTICLE_CONFIG } from "@/constants/particles";

interface UseThreeSceneProps {
  mountRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useThreeScene = ({ mountRef, containerRef }: UseThreeSceneProps) => {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const fogParticlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number | null>(null);

  // 리사이즈 핸들러 개선
  const handleResize = () => {
    if (!mountRef.current || !cameraRef.current || !rendererRef.current || !composerRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 렌더러 크기 업데이트
    rendererRef.current.setSize(width, height);

    // 카메라 비율 업데이트
    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    // 파티클 크기 조정 (화면 크기에 따라)
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.ShaderMaterial;
      // 화면 크기에 따라 파티클 크기 조정
      const baseSize = Math.min(width, height) / 1000; // 화면 크기에 비례한 기본 크기
      material.uniforms.baseSize = { value: baseSize };
    }

    // 안개 파티클 크기 조정
    if (fogParticlesRef.current) {
      const fogMaterial = fogParticlesRef.current.material as THREE.PointsMaterial;
      const baseFogSize = Math.min(width, height) / 100; // 화면 크기에 비례한 안개 크기
      fogMaterial.size = baseFogSize;
    }

    // 컴포저 크기 업데이트
    composerRef.current.setSize(width, height);
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(20, 1, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // 초기 크기 설정
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#151515");
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 성능 최적화
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 카메라 비율 설정
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // POST-PROCESSING: Composer + Bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composerRef.current = composer;

    // PARTICLES
    const particleCount = PARTICLE_CONFIG.main.count;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      let radius;
      const ratio = Math.random();
      if (ratio < 0.05) {
        radius = Math.random() * PARTICLE_CONFIG.main.radius.inner;
      } else {
        radius =
          PARTICLE_CONFIG.main.radius.inner +
          Math.random() * (PARTICLE_CONFIG.main.radius.outer - PARTICLE_CONFIG.main.radius.inner);
      }
      const branch = ((i % PARTICLE_CONFIG.main.branchCount) / PARTICLE_CONFIG.main.branchCount) * Math.PI * 2;
      const spin = radius * PARTICLE_CONFIG.main.spinMultiplier;

      const x = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * PARTICLE_CONFIG.main.noiseRange;
      const y = (Math.random() - 0.5) * PARTICLE_CONFIG.main.noiseRange;
      const z = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * PARTICLE_CONFIG.main.noiseRange;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = Math.max(
        PARTICLE_CONFIG.main.sizeRange.min,
        PARTICLE_CONFIG.main.sizeRange.max - Math.sqrt(x * x + y * y) * 0.01
      );

      const colorVariation = Math.random();
      if (radius < PARTICLE_CONFIG.main.radius.inner) {
        colors[i * 3] = PARTICLE_CONFIG.colors.inner[0];
        colors[i * 3 + 1] = PARTICLE_CONFIG.colors.inner[1];
        colors[i * 3 + 2] = PARTICLE_CONFIG.colors.inner[2];
      } else if (colorVariation < PARTICLE_CONFIG.colorThresholds.white) {
        colors[i * 3] = PARTICLE_CONFIG.colors.white[0];
        colors[i * 3 + 1] = PARTICLE_CONFIG.colors.white[1];
        colors[i * 3 + 2] = PARTICLE_CONFIG.colors.white[2];
      } else if (colorVariation < PARTICLE_CONFIG.colorThresholds.orange) {
        colors[i * 3] = PARTICLE_CONFIG.colors.orange[0];
        colors[i * 3 + 1] = PARTICLE_CONFIG.colors.orange[1];
        colors[i * 3 + 2] = PARTICLE_CONFIG.colors.orange[2];
      } else {
        colors[i * 3] = PARTICLE_CONFIG.colors.blue[0];
        colors[i * 3 + 1] = PARTICLE_CONFIG.colors.blue[1];
        colors[i * 3 + 2] = PARTICLE_CONFIG.colors.blue[2];
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseSize: { value: Math.min(width, height) / 1000 }, // 반응형 크기 추가
      },
      vertexShader: /* glsl */ `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float time;
        uniform float baseSize;
        
        void main() {
          vColor = color;
          float flicker = sin(time * 2.0 + position.x * 50.0 + position.y * 50.0) * 0.3 + 0.7;
          vAlpha = flicker;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // baseSize를 곱해서 반응형 크기 조정
          gl_PointSize = size * baseSize * (300.0 / -mvPosition.z);
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

    // === 안개 파티클 추가 ===
    const fogParticleCount = PARTICLE_CONFIG.fog.count;
    const fogPositions = new Float32Array(fogParticleCount * 3);
    const fogSizes = new Float32Array(fogParticleCount);
    for (let i = 0; i < fogParticleCount; i++) {
      let radius;
      const ratio = Math.random();
      if (ratio < 0.05) {
        radius = Math.random() * PARTICLE_CONFIG.main.radius.inner;
      } else {
        radius =
          PARTICLE_CONFIG.main.radius.inner +
          Math.random() * (PARTICLE_CONFIG.main.radius.outer - PARTICLE_CONFIG.main.radius.inner);
      }
      const branch = ((i % PARTICLE_CONFIG.main.branchCount) / PARTICLE_CONFIG.main.branchCount) * Math.PI * 2;
      const spin = radius * PARTICLE_CONFIG.main.spinMultiplier;
      const x = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * PARTICLE_CONFIG.main.noiseRange;
      const y = (Math.random() - 0.5) * PARTICLE_CONFIG.main.noiseRange;
      const z = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * PARTICLE_CONFIG.main.noiseRange;
      fogPositions[i * 3] = x;
      fogPositions[i * 3 + 1] = y;
      fogPositions[i * 3 + 2] = z;
      fogSizes[i] =
        PARTICLE_CONFIG.fog.sizeRange.min +
        Math.random() * (PARTICLE_CONFIG.fog.sizeRange.max - PARTICLE_CONFIG.fog.sizeRange.min);
    }
    const fogGeometry = new THREE.BufferGeometry();
    fogGeometry.setAttribute("position", new THREE.BufferAttribute(fogPositions, 3));
    fogGeometry.setAttribute("size", new THREE.BufferAttribute(fogSizes, 1));
    const fogTexture = new THREE.TextureLoader().load("/images/assets/particle_blur.png");
    const fogMaterial = new THREE.PointsMaterial({
      map: fogTexture,
      size: Math.min(width, height) / 100, // 반응형 크기
      transparent: true,
      opacity: PARTICLE_CONFIG.fog.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: PARTICLE_CONFIG.fog.color,
    });
    const fogParticles = new THREE.Points(fogGeometry, fogMaterial);
    fogParticles.name = "fogParticles";
    scene.add(fogParticles);
    fogParticlesRef.current = fogParticles;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      if (particlesRef.current) {
        particlesRef.current.rotation.y += PARTICLE_CONFIG.animation.rotationSpeed.main;
        (particlesRef.current.material as THREE.ShaderMaterial).uniforms.time.value = time;
      }

      if (fogParticlesRef.current) {
        fogParticlesRef.current.rotation.y += PARTICLE_CONFIG.animation.rotationSpeed.fog;
      }

      if (composerRef.current) {
        composerRef.current.render();
      }
    };
    animate();

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const visibleRatio = (window.innerHeight - rect.top) / rect.height;
      if (cameraRef.current && particlesRef.current) {
        if (visibleRatio < 0.5) {
          cameraRef.current.position.set(0, 0, 15);
          cameraRef.current.lookAt(0, 0, 0);
          return;
        }
        const progress = Math.min((visibleRatio - 0.5) / 0.5, 1);
        const startPos = new THREE.Vector3(0, 0, 8);
        const midPos = new THREE.Vector3(0, 0, 18);
        const endPos = new THREE.Vector3(0, 10, 12);
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

    // 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // 초기 실행
    handleScroll();
    handleResize();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [mountRef, containerRef]);

  return {
    sceneRef,
    cameraRef,
    rendererRef,
    composerRef,
    particlesRef,
    fogParticlesRef,
    animationRef,
  };
};
