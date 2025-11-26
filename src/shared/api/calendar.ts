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

// 구글 캘린더 연동
export interface UpdateGoogleCalendarRequest {
  googleCalendarId: string;
}

export interface GoogleCalendarEventResponse {
  eventId: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  allDay: boolean;
  status: string;
  htmlLink: string;
  organizer?: string;
  location?: string;
}

export interface GoogleCalendarEventsResponse {
  calendarId: string;
  events: GoogleCalendarEventResponse[];
  nextPageToken?: string;
  nextSyncToken?: string;
}

export interface GoogleCalendarSyncRequest {
  calendarId?: string;
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
  pageToken?: string;
  timeZone?: string;
}

// 팀의 구글 캘린더 ID 저장
export const updateTeamGoogleCalendar = async (
  googleCalendarId: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.patch('/std/teamspace/network/team/google-calendar', {
    googleCalendarId,
  });
  return res.data;
};

// 구글 캘린더 이벤트 가져오기
export const getGoogleCalendarEvents = async (
  params?: GoogleCalendarSyncRequest
): Promise<GoogleCalendarEventsResponse> => {
  const res = await axiosInstance.get('/std/calender/google', { params });
  return res.data;
};
