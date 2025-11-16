import axiosInstance from "@/shared/lib/axiosInstance";
import type { FilePayload } from "@/shared/types/notice";

export const createNoticeGeneral = async (
  title: string,
  content: string,
  files: FilePayload[],
  deadlineDate: string
) => {
  const { data, status } = await axiosInstance.post("/api/tch/notice", { title, content, files, deadlineDate });
  if (status < 200 || status >= 300) throw new Error(`업로드 실패 (status: ${status})`);
  return data;
};