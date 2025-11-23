// 캘린더 API 사용 예시

import { useCalendar } from './useCalendar';

export function CalendarExample() {
  const { calendars, isLoading, addCalendar, editCalendar, removeCalendar } = useCalendar();

  // 1. 목록 조회 - useCalendar 훅을 사용하면 자동으로 조회됨
  // calendars 배열에 데이터가 담김

  // 2. 일정 생성
  const createExample = async () => {
    await addCalendar({
      Startyear: 2025,
      Startdate: 1219,  // 12월 19일
      Endyear: 2025,
      Enddate: 1220,    // 12월 20일
      title: "김현우 생일",
      content: "왜이렇게사니"
    });
  };

  // 3. 일정 수정
  const updateExample = async (calender_id: number) => {
    await editCalendar(calender_id, {
      Startyear: 2025,
      Startdate: 1219,
      Endyear: 2025,
      Enddate: 1221,  // 종료일 변경
      title: "김현우 생일 (수정됨)",
      content: "수정된 내용"
    });
  };

  // 4. 일정 삭제
  const deleteExample = async (calender_id: number) => {
    await removeCalendar(calender_id);
  };

  return {
    calendars,
    isLoading,
    createExample,
    updateExample,
    deleteExample
  };
}
