import axiosInstance from "@/shared/lib/axiosInstance";

export const getNoticeDetail = async (notice_id: string) => {
  const res = await axiosInstance.get(`/api/ara/notice/${notice_id}`);
  return res.data;
};