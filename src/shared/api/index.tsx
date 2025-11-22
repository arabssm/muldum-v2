import axiosInstance from "@/shared/lib/axiosInstance";

// 공지 부분
export const getNoticeDetail = async (notice_id: string) => {
  const res = await axiosInstance.get(`/ara/notice/${notice_id}`);
  return res.data;
};

export const deleteNotice = async (notice_id: string) => {
  const res = await axiosInstance.delete(`/tch/notice/${notice_id}`);
  return res.data;
};

// 팀스페이스 부분
export const getClubs = async () => {
  const res = await axiosInstance.get(`/ara/major/teamspace`);
  return res.data;
};

// 팀 페이지 노션 부분
export const getNotion = async (team_id: string) => {
  const res = await axiosInstance.get(`/std/teamspace/${team_id}`);
  return res.data;
};

export const editNotion = (team_id: string, data: { name: string; content: string }) =>
  axiosInstance.patch(`/std/teamspace?type=${team_id}`, data).then(res => res.data);

// 월말평가 학생 목록 조회 부분
export const getUserMonth = async (report_id: string) => {
  const res = await axiosInstance.get(`/std/month_report/${report_id}`);
  return res.data;
};

// 월말평가 선생님 목록 조회 부분
export const getAdminMonth = async () => {
  const res = await axiosInstance.get(`/tch/month_report}`);
  return res.data;
};

export const getAdminMonthContent = async (report_id: string) => {
  const res = await axiosInstance.get(`/tch/month_report/${report_id}`);
  return res.data;
};