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
  const res = await axiosInstance.get(`/ara/teamspace/major`);
  return res.data;
};

// 팀 페이지 조회 (새 API)
export const getTeamPage = async (team_id: string) => {
  const res = await axiosInstance.get(`/ara/teamspace/network/team/${team_id}`);
  return res.data;
};

// 레거시 팀 페이지 조회 (호환성 유지)
export const getNotion = async (team_id: string) => {
  const res = await axiosInstance.get(`/std/teamspace/${team_id}`);
  return res.data;
};

// 팀 페이지 수정 (이름, 소개)
export const updateTeamPage = (teamId: number, data: { name?: string | null; content: string }) =>
  axiosInstance.patch(`/std/teamspace/network/team/${teamId}`, data).then(res => res.data);

// 팀 배너 이미지 수정
export const updateTeamBanner = (teamId: number, url: string) =>
  axiosInstance.patch(`/std/teamspace/network/team/${teamId}/banner`, { url }).then(res => res.data);

// 팀 아이콘 수정
export const updateTeamIcon = (teamId: number, url: string) =>
  axiosInstance.patch(`/std/teamspace/team/${teamId}/icon`, { url }).then(res => res.data);

// 레거시 API (호환성 유지)
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