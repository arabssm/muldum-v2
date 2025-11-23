import { useState, useEffect } from 'react';
import {
  getCalendarList,
  createCalendar,
  updateCalendar,
  deleteCalendar,
  CalendarEntry,
  CreateCalendarRequest,
} from '@/shared/api/calendar';
import { showToast } from '@/shared/ui/toast';

export const useCalendar = () => {
  const [calendars, setCalendars] = useState<CalendarEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCalendars = async () => {
    setIsLoading(true);
    try {
      const data = await getCalendarList();
      setCalendars(data);
    } catch (error: any) {
      const errorCode = error?.response?.data?.errorCode;
      if (errorCode === 'TEAM_ACCESS_DENIED') {
        showToast.error('팀 접근 권한이 없습니다');
      } else if (errorCode === 'UNREGISTERED_USER') {
        showToast.error('등록되지 않은 사용자입니다');
      } else {
        showToast.error('캘린더 목록을 불러오는데 실패했습니다');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addCalendar = async (data: CreateCalendarRequest) => {
    try {
      const newCalendar = await createCalendar(data);
      setCalendars((prev) => [...prev, newCalendar]);
      showToast.success('일정이 생성되었습니다');
      return newCalendar;
    } catch (error: any) {
      const errorCode = error?.response?.data?.errorCode;
      if (errorCode === 'INVALID_CALENDAR_ENTRY') {
        showToast.error('유효하지 않은 일정 데이터입니다');
      } else if (errorCode === 'INVALID_DATE_RANGE') {
        showToast.error('종료일이 시작일보다 빠릅니다');
      } else if (errorCode === 'TEAM_ACCESS_DENIED') {
        showToast.error('팀 접근 권한이 없습니다');
      } else {
        showToast.error('일정 생성에 실패했습니다');
      }
      throw error;
    }
  };

  const editCalendar = async (calender_id: number, data: CreateCalendarRequest) => {
    try {
      const updatedCalendar = await updateCalendar(calender_id, data);
      setCalendars((prev) =>
        prev.map((cal) => (cal.calender_id === calender_id ? updatedCalendar : cal))
      );
      showToast.success('일정이 수정되었습니다');
      return updatedCalendar;
    } catch (error: any) {
      const errorCode = error?.response?.data?.errorCode;
      if (errorCode === 'CALENDAR_ENTRY_NOT_FOUND') {
        showToast.error('일정을 찾을 수 없습니다');
      } else if (errorCode === 'INVALID_CALENDAR_ENTRY') {
        showToast.error('유효하지 않은 일정 데이터입니다');
      } else if (errorCode === 'INVALID_DATE_RANGE') {
        showToast.error('종료일이 시작일보다 빠릅니다');
      } else if (errorCode === 'TEAM_ACCESS_DENIED') {
        showToast.error('팀 접근 권한이 없습니다');
      } else {
        showToast.error('일정 수정에 실패했습니다');
      }
      throw error;
    }
  };

  const removeCalendar = async (calender_id: number) => {
    try {
      await deleteCalendar(calender_id);
      setCalendars((prev) => prev.filter((cal) => cal.calender_id !== calender_id));
      showToast.success('일정이 삭제되었습니다');
    } catch (error: any) {
      const errorCode = error?.response?.data?.errorCode;
      if (errorCode === 'CALENDAR_ENTRY_NOT_FOUND') {
        showToast.error('일정을 찾을 수 없습니다');
      } else if (errorCode === 'TEAM_ACCESS_DENIED') {
        showToast.error('팀 접근 권한이 없습니다');
      } else {
        showToast.error('일정 삭제에 실패했습니다');
      }
      throw error;
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  return {
    calendars,
    isLoading,
    fetchCalendars,
    addCalendar,
    editCalendar,
    removeCalendar,
  };
};
