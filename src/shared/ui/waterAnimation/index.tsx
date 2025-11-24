'use client';

import { useState } from 'react';
import * as S from './style';

export default function WaterAnimation() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    setTimeout(() => setIsActive(false), 8000);
  };

  return (
    <>
      <S.WaterButton onClick={handleClick}>
        물들기
      </S.WaterButton>

      {isActive && (
        <S.WaterOverlay>
          <S.WaterContainer>
            {/* 초기 임팩트 플래시 */}
            <S.ImpactFlash />
            
            {/* 메인 물결 레이어 - 더 많이 */}
            {[...Array(20)].map((_, i) => (
              <S.Wave key={i} delay={i * 0.05} index={i} />
            ))}
            
            {/* 거대한 물방울 폭발 */}
            <S.MegaBubbles>
              {[...Array(15)].map((_, i) => (
                <S.MegaBubble
                  key={i}
                  angle={i * 24}
                  delay={0.2 + i * 0.05}
                  distance={200 + Math.random() * 300}
                />
              ))}
            </S.MegaBubbles>

            {/* 작은 물방울 파티클 - 더 많이 */}
            <S.Bubbles>
              {[...Array(80)].map((_, i) => (
                <S.Bubble
                  key={i}
                  left={Math.random() * 100}
                  delay={Math.random() * 1.5}
                  duration={1 + Math.random() * 2}
                  size={3 + Math.random() * 20}
                />
              ))}
            </S.Bubbles>

            {/* 빛나는 파티클 - 더 많이 */}
            <S.Sparkles>
              {[...Array(100)].map((_, i) => (
                <S.Sparkle
                  key={i}
                  left={Math.random() * 100}
                  top={Math.random() * 100}
                  delay={Math.random() * 2}
                  duration={0.5 + Math.random() * 1.5}
                />
              ))}
            </S.Sparkles>

            {/* 강렬한 파문 */}
            <S.Ripples>
              {[...Array(15)].map((_, i) => (
                <S.Ripple key={i} delay={i * 0.2} />
              ))}
            </S.Ripples>

            {/* 회오리 효과 */}
            <S.Vortex>
              {[...Array(10)].map((_, i) => (
                <S.VortexRing key={i} delay={i * 0.2} index={i} />
              ))}
            </S.Vortex>

            {/* 물보라 효과 */}
            <S.Splashes>
              {[...Array(40)].map((_, i) => (
                <S.Splash
                  key={i}
                  left={10 + Math.random() * 80}
                  delay={Math.random() * 1.5}
                  rotation={Math.random() * 360}
                  scale={0.5 + Math.random() * 1.5}
                />
              ))}
            </S.Splashes>

            {/* 번개 효과 */}
            <S.Lightning>
              {[...Array(8)].map((_, i) => (
                <S.LightningBolt
                  key={i}
                  left={10 + i * 12}
                  delay={0.5 + i * 0.15}
                />
              ))}
            </S.Lightning>

            {/* 폭발 파티클 */}
            <S.Explosions>
              {[...Array(30)].map((_, i) => (
                <S.ExplosionParticle
                  key={i}
                  angle={i * 12}
                  delay={0.3 + (i % 5) * 0.1}
                  distance={150 + Math.random() * 400}
                />
              ))}
            </S.Explosions>

            {/* 소용돌이 파티클 */}
            <S.SwirlParticles>
              {[...Array(50)].map((_, i) => (
                <S.SwirlParticle
                  key={i}
                  delay={i * 0.05}
                  rotation={i * 7.2}
                />
              ))}
            </S.SwirlParticles>
          </S.WaterContainer>
        </S.WaterOverlay>
      )}
    </>
  );
}
