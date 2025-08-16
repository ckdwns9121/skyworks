export const PARTICLE_CONFIG = {
  // 메인 파티클 설정
  main: {
    count: 100000,
    sizeRange: {
      min: 0.05,
      max: 0.2,
    },
    radius: {
      inner: 2,
      outer: 20,
    },
    spinMultiplier: 1.5,
    branchCount: 4,
    noiseRange: 0.5,
  },

  // 안개 파티클 설정
  fog: {
    count: 60,
    sizeRange: {
      min: 10,
      max: 24,
    },
    opacity: 0.09,
    color: 0x6ecaff,
  },

  // 색상 변형 설정
  colors: {
    inner: [2, 2, 2], // radius < 2인 파티클
    white: [1, 1, 1], // 30% 확률
    orange: [1, 0.7, 0.3], // 30% 확률
    blue: [0.4, 0.6, 1], // 40% 확률
  },

  // 색상 확률 설정
  colorThresholds: {
    white: 0.3,
    orange: 0.6,
    blue: 1.0,
  },

  // 애니메이션 설정
  animation: {
    rotationSpeed: {
      main: 0.0005,
      fog: 0.00015,
    },
  },
};
