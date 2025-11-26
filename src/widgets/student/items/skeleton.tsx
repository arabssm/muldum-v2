"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ItemsSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 동아리 선택 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Skeleton width="150px" height="36px" borderRadius="4px" />
      </div>

      {/* 구입할 물품, 가격, 배송비, 수량 */}
      <div style={{ display: 'flex', gap: '4rem', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'auto' }}>
          <Skeleton width="100px" height="30px" />
          <Skeleton width="40rem" height="45px" borderRadius="4px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'auto' }}>
          <Skeleton width="50px" height="30px" />
          <Skeleton width="10rem" height="45px" borderRadius="4px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'auto' }}>
          <Skeleton width="50px" height="30px" />
          <Skeleton width="10rem" height="45px" borderRadius="4px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'auto' }}>
          <Skeleton width="50px" height="30px" />
          <Skeleton width="80px" height="45px" borderRadius="4px" />
        </div>
      </div>

      {/* 물품링크, 예상 도착일 */}
      <div style={{ display: 'flex', gap: '4rem', width: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'auto' }}>
          <Skeleton width="80px" height="30px" />
          <Skeleton width="62rem" height="45px" borderRadius="4px" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', width: 'auto' }}>
          <Skeleton width="100px" height="30px" />
          <Skeleton width="15rem" height="45px" borderRadius="4px" />
        </div>
      </div>

      {/* 신청사유 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <Skeleton width="80px" height="30px" />
        <Skeleton width="100%" height="20vh" borderRadius="4px" />
      </div>

      {/* 버튼 */}
      <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end' }}>
        <Skeleton width="160px" height="44px" borderRadius="4px" />
        <Skeleton width="100px" height="44px" borderRadius="4px" />
      </div>
    </div>
  );
}