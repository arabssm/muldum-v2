import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

const PRIMARY = "#4A9EFF"; // 밝은 블루
const SECONDARY = "#6BB6FF"; // 더 밝은 블루
const ACCENT = "#8FCDFF"; // 하늘색

// 물들기 버튼
export const WaterButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.6rem 1rem;
  border-radius: 10rem;
  border: none;
  background: #4b4b4b;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    background: #2d2c2c;
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 오버레이
export const WaterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
`;

export const WaterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

// 초기 임팩트 플래시
const impactFlash = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  10% {
    opacity: 1;
    transform: scale(1);
  }
  30% {
    opacity: 0.8;
    transform: scale(2);
  }
  100% {
    opacity: 0;
    transform: scale(4);
  }
`;

export const ImpactFlash = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(74, 158, 255, 0.9), rgba(139, 205, 255, 0.6) 50%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${impactFlash} 0.8s ease-out forwards;
  box-shadow: 0 0 100px 50px rgba(74, 158, 255, 0.7);
`;

// 물결 애니메이션 - 더 역동적으로
const waveAnimation = keyframes`
  0% {
    transform: translateY(100vh) scaleY(0) rotateZ(0deg);
    opacity: 0;
  }
  3% {
    opacity: 1;
  }
  20% {
    transform: translateY(40vh) scaleY(1.5) rotateZ(3deg);
    opacity: 0.9;
  }
  50% {
    transform: translateY(0) scaleY(1.2) rotateZ(-2deg);
    opacity: 0.7;
  }
  80% {
    transform: translateY(-30vh) scaleY(0.8) rotateZ(1deg);
    opacity: 0.3;
  }
  100% {
    transform: translateY(-50vh) scaleY(0.3) rotateZ(0deg);
    opacity: 0;
  }
`;

export const Wave = styled.div<{ delay: number; index: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 130%;
  background: ${({ index }) => {
    const opacity1 = 0.05 + (index * 0.03);
    const opacity2 = 0.15 + (index * 0.04);
    const opacity3 = 0.3 + (index * 0.05);
    return `linear-gradient(
      180deg,
      rgba(74, 158, 255, ${opacity1}) 0%,
      rgba(107, 182, 255, ${opacity2}) 50%,
      rgba(143, 205, 255, ${opacity3}) 100%
    )`;
  }};
  animation: ${waveAnimation} 3.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${({ delay }) => delay}s;
  border-radius: 50% 50% 0 0 / 40% 40% 0 0;
  transform-origin: bottom;
  filter: blur(${({ index }) => index * 0.3}px);
`;

// 거대한 물방울 폭발
const megaBubbleAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(2);
    opacity: 0;
  }
`;

export const MegaBubbles = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
`;

export const MegaBubble = styled.div<{
  angle: number;
  delay: number;
  distance: number;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  --tx: ${({ angle, distance }) => Math.cos((angle * Math.PI) / 180) * distance}px;
  --ty: ${({ angle, distance }) => Math.sin((angle * Math.PI) / 180) * distance}px;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.95),
    rgba(143, 205, 255, 0.8) 40%,
    rgba(74, 158, 255, 0.6)
  );
  border-radius: 50%;
  animation: ${megaBubbleAnimation} 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 
    inset -5px -5px 15px rgba(74, 158, 255, 0.6),
    inset 5px 5px 15px rgba(255, 255, 255, 0.8),
    0 0 40px rgba(74, 158, 255, 0.8);
`;

// 버블 애니메이션 - 더 빠르고 역동적으로
const bubbleRise = keyframes`
  0% {
    transform: translateY(0) translateX(0) scale(0) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50% {
    transform: translateY(-60vh) translateX(30px) scale(1.2) rotate(180deg);
  }
  100% {
    transform: translateY(-110vh) translateX(-30px) scale(0.5) rotate(360deg);
    opacity: 0;
  }
`;

export const Bubbles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

export const Bubble = styled.div<{
  left: number;
  delay: number;
  duration: number;
  size: number;
}>`
  position: absolute;
  bottom: -50px;
  left: ${({ left }) => left}%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 255, 255, 0.95),
    rgba(143, 205, 255, 0.7) 50%,
    rgba(74, 158, 255, 0.5)
  );
  border-radius: 50%;
  animation: ${bubbleRise} ${({ duration }) => duration}s ease-out forwards;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 
    inset -2px -2px 8px rgba(74, 158, 255, 0.5),
    inset 2px 2px 8px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(74, 158, 255, 0.6);
`;

// 반짝이는 파티클 - 더 강렬하게
const sparkleAnimation = keyframes`
  0%, 100% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
`;

export const Sparkles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

export const Sparkle = styled.div<{
  left: number;
  top: number;
  delay: number;
  duration: number;
}>`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: 6px;
  height: 6px;
  background: radial-gradient(circle, #fff, ${ACCENT});
  border-radius: 50%;
  animation: ${sparkleAnimation} ${({ duration }) => duration}s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 
    0 0 15px ${PRIMARY}, 
    0 0 30px ${SECONDARY}, 
    0 0 45px ${ACCENT},
    0 0 60px rgba(143, 205, 255, 0.8);
`;

// 파문 효과 - 더 강렬하게
const rippleAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  30% {
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(8);
    opacity: 0;
  }
`;

export const Ripples = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Ripple = styled.div<{ delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 5px solid ${PRIMARY};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${rippleAnimation} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 
    0 0 30px ${PRIMARY}, 
    inset 0 0 30px rgba(54, 65, 85, 0.4);
`;

// 회오리 효과 - 더 빠르게
const vortexAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(4) rotate(1080deg);
    opacity: 0;
  }
`;

export const Vortex = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const VortexRing = styled.div<{ delay: number; index: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${({ index }) => 150 + index * 30}px;
  height: ${({ index }) => 150 + index * 30}px;
  border: ${({ index }) => 4 - index * 0.2}px dashed ${PRIMARY};
  border-radius: 50%;
  animation: ${vortexAnimation} 3s ease-out infinite;
  animation-delay: ${({ delay }) => delay}s;
  opacity: ${({ index }) => 0.8 - index * 0.05};
`;

// 물보라 효과 - 더 역동적으로
const splashAnimation = keyframes`
  0% {
    transform: translateY(0) scale(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(var(--scale)) rotate(720deg);
    opacity: 0;
  }
`;

export const Splashes = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
`;

export const Splash = styled.div<{
  left: number;
  delay: number;
  rotation: number;
  scale: number;
}>`
  position: absolute;
  bottom: 0;
  left: ${({ left }) => left}%;
  width: 80px;
  height: 80px;
  --scale: ${({ scale }) => scale};
  background: radial-gradient(
    ellipse at center,
    rgba(143, 205, 255, 0.9) 0%,
    rgba(107, 182, 255, 0.7) 40%,
    rgba(74, 158, 255, 0.4) 70%,
    transparent 100%
  );
  border-radius: 50% 50% 0 50%;
  animation: ${splashAnimation} 2.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${({ delay }) => delay}s;
  transform: rotate(${({ rotation }) => rotation}deg);
  filter: blur(2px);
`;

// 번개 효과
const lightningAnimation = keyframes`
  0%, 100% {
    opacity: 0;
  }
  10%, 30%, 50% {
    opacity: 1;
  }
  20%, 40%, 60% {
    opacity: 0;
  }
`;

export const Lightning = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

export const LightningBolt = styled.div<{ left: number; delay: number }>`
  position: absolute;
  left: ${({ left }) => left}%;
  top: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    ${ACCENT} 20%,
    #fff 50%,
    ${SECONDARY} 80%,
    transparent 100%
  );
  animation: ${lightningAnimation} 0.3s ease-in-out;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 0 0 20px ${PRIMARY}, 0 0 40px ${ACCENT};
  transform: skewX(-5deg);
`;

// 폭발 파티클
const explosionAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
`;

export const Explosions = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
`;

export const ExplosionParticle = styled.div<{
  angle: number;
  delay: number;
  distance: number;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15px;
  height: 15px;
  --tx: ${({ angle, distance }) => Math.cos((angle * Math.PI) / 180) * distance}px;
  --ty: ${({ angle, distance }) => Math.sin((angle * Math.PI) / 180) * distance}px;
  background: radial-gradient(circle, #fff, ${ACCENT});
  border-radius: 50%;
  animation: ${explosionAnimation} 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 0 0 20px ${PRIMARY}, 0 0 30px ${SECONDARY};
`;

// 소용돌이 파티클
const swirlAnimation = keyframes`
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(0) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) rotate(var(--rotation)) translateX(300px) scale(1);
    opacity: 0;
  }
`;

export const SwirlParticles = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
`;

export const SwirlParticle = styled.div<{
  delay: number;
  rotation: number;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  --rotation: ${({ rotation }) => rotation}deg;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95), ${ACCENT});
  border-radius: 50%;
  animation: ${swirlAnimation} 2s ease-out forwards;
  animation-delay: ${({ delay }) => delay}s;
  box-shadow: 0 0 15px ${PRIMARY}, 0 0 25px ${SECONDARY};
`;
