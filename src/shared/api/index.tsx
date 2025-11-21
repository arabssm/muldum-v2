import axiosInstance from "@/shared/lib/axiosInstance";

export const getNoticeDetail = async (notice_id: string) => {
  const res = await axiosInstance.get(`/ara/notice/${notice_id}`);
  return res.data;
};

export const deleteNotice = async (notice_id: string) => {
  const res = await axiosInstance.delete(`/tch/notice/${notice_id}`);
  return res.data;
};