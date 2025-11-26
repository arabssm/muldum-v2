import axiosInstance from "@/shared/lib/axiosInstance";

export interface MonthReportRequest {
  topic: string;
  goal: string[];
  tech: string;
  problem: string;
  teacherFeedback?: string;
  mentorFeedback?: string;
  status?: string;
}

export interface SaveMonthReportResponse {
  reportId: number;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface MonthReportDetailResponse {
  reportId: number;
  topic: string;
  goal: string[];
  tech: string;
  problem: string;
  teacherFeedback: string | null;
  mentorFeedback: string | null;
  status: string;
  feedback: string | null;
}

export interface MonthReportSimpleResponse {
  reportId: number;
  topic: string;
  status: string;
  submittedAt: string | null;
}

export interface StudentMonthReportListResponse {
  month: number;
  reports: MonthReportSimpleResponse[];
}

// 임시 저장된 데이터 조회
export const getDraftReport = async (): Promise<MonthReportDetailResponse | null> => {
  try {
    const { data } = await axiosInstance.get('/std/major/report/draft');
    return data;
  } catch (error) {
    return null;
  }
};

// 임시 저장
export const saveDraftReport = async (data: MonthReportRequest): Promise<SaveMonthReportResponse> => {
  const { data: response } = await axiosInstance.post('/std/major/report/draft', data);
  return response;
};

// 임시 저장 수정
export const updateDraftReport = async (reportId: number, data: MonthReportRequest): Promise<SaveMonthReportResponse> => {
  const { data: response } = await axiosInstance.post(`/std/major/report/${reportId}`, data);
  return response;
};

// 제출
export const submitReport = async (reportId: number, data: MonthReportRequest): Promise<MessageResponse> => {
  const { data: response } = await axiosInstance.post(`/std/major/report/${reportId}/submit`, data);
  return response;
};

// 상세 조회
export const getReportDetail = async (reportId: number): Promise<MonthReportDetailResponse> => {
  const { data } = await axiosInstance.get(`/std/major/report/${reportId}`);
  return data;
};

// 목록 조회
export const getReportList = async (): Promise<StudentMonthReportListResponse> => {
  const { data } = await axiosInstance.get('/std/major/report');
  return data;
};

// 선생님용 - 팀별 월말평가 목록 조회
export const getTeacherReportList = async (teamId?: number | null): Promise<MonthReportSimpleResponse[]> => {
  const url = teamId ? `/tch/major/report?team=${teamId}` : '/tch/major/report';
  const { data } = await axiosInstance.get(url);
  return data;
};

// 선생님용 - 월말평가 상세 조회
export const getTeacherReportDetail = async (reportId: number): Promise<MonthReportDetailResponse> => {
  const { data } = await axiosInstance.get(`/tch/major/report/${reportId}`);
  return data;
};
