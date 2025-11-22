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