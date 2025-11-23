import axiosInstance from "@/shared/lib/axiosInstance";

export interface CalendarEntry {
  calender_id: number;
  Startyear: number;
  Startdate: number;
  Endyear: number;
  Enddate: number;
  title: string;
  content: string;
}

export interface CreateCalendarRequest {
  Startyear: number;
  Startdate: number;
  Endyear: number;
  Enddate: number;
  title: string;
  content: string;
}

// 목록 조회
export const getCalendarList = async (): Promise<CalendarEntry[]> => {
  const res = await axiosInstance.get('/std/calender');
  return res.data;
};

// 생성
export const createCalendar = async (data: CreateCalendarRequest): Promise<CalendarEntry> => {
  const res = await axiosInstance.post('/std/calender', data);
  return res.data;
};

// 수정
export const updateCalendar = async (
  calender_id: number,
  data: CreateCalendarRequest
): Promise<CalendarEntry> => {
  const res = await axiosInstance.patch(`/std/calender/${calender_id}`, data);
  return res.data;
};

// 삭제
export const deleteCalendar = async (calender_id: number): Promise<void> => {
  await axiosInstance.delete(`/std/calender/${calender_id}`);
};
