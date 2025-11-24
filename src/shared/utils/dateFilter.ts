/**
 * 날짜 기반 필터링 유틸리티
 * API 명세서: nth 파라미터 제거 및 updated_at 기반 조회로 변경
 */

import type { TeacherItem } from "@/shared/api/items";

/**
 * 특정 기간 내 승인된 물품 필터링
 * @param items 물품 목록
 * @param startDate 시작 날짜
 * @param endDate 종료 날짜
 * @returns 필터링된 물품 목록
 */
export function filterByDateRange(
  items: TeacherItem[],
  startDate: Date,
  endDate: Date
): TeacherItem[] {
  return items.filter((item) => {
    if (item.status !== "APPROVED") return false;
    const updatedAt = new Date(item.updated_at);
    return updatedAt >= startDate && updatedAt <= endDate;
  });
}

/**
 * 날짜별로 물품 그룹핑
 * @param items 물품 목록
 * @returns 날짜별로 그룹핑된 물품 객체
 */
export function groupByDate(items: TeacherItem[]): Record<string, TeacherItem[]> {
  return items.reduce((acc, item) => {
    const date = new Date(item.updated_at).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, TeacherItem[]>);
}

/**
 * 승인/거절 날짜 포맷팅
 * @param item 물품 정보
 * @returns 포맷팅된 날짜 문자열
 */
export function formatUpdatedDate(item: TeacherItem): string {
  if (!item.updated_at) return "-";
  const date = new Date(item.updated_at);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 상태별 날짜 레이블 반환
 * @param item 물품 정보
 * @returns 상태에 맞는 날짜 레이블
 */
export function getStatusDateLabel(item: TeacherItem): string {
  if (item.status === "APPROVED") {
    return `승인 날짜: ${formatUpdatedDate(item)}`;
  } else if (item.status === "REJECTED") {
    return `거절 날짜: ${formatUpdatedDate(item)}`;
  } else {
    return `수정 날짜: ${formatUpdatedDate(item)}`;
  }
}
